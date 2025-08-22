/**
 * HIS 接口客户端
 *
 * 封装通用的签名、超时、重试、错误规范化与健康检查。
 * 仅示例用途：实际项目请替换为真实的网关与签名算法。
 */

// 简易存取：从 localStorage 获取配置
function readConfig() {
  try {
    const saved = localStorage.getItem('his_config');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return {
    apiUrl: 'https://his.example.com/api',
    appId: 'demo-app-id',
    appSecret: 'demo-app-secret',
    token: 'demo-token',
    timeoutMs: 8000,
    retry: 1,
  };
}

/**
 * 生成请求签名（示例版）。
 * @param {string} appSecret
 * @param {object} payload
 * @returns {string}
 */
function sign(appSecret, payload) {
  const raw = appSecret + JSON.stringify(payload);
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `demo-${Math.abs(hash)}`;
}

/**
 * 统一请求方法
 * @param {string} path
 * @param {object} payload
 * @param {RequestInit} init
 */
async function request(path, payload = {}, init = {}) {
  const cfg = readConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), cfg.timeoutMs || 8000);

  const body = {
    appId: cfg.appId,
    token: cfg.token,
    timestamp: Date.now(),
    data: payload,
  };
  body.signature = sign(cfg.appSecret, body);

  const doFetch = async () => {
    const res = await fetch(`${cfg.apiUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      ...init,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json().catch(() => ({}));
    return json;
  };

  try {
    let lastErr;
    const retry = Number(cfg.retry || 0);
    for (let i = 0; i <= retry; i += 1) {
      try {
        const data = await doFetch();
        return { ok: true, data };
      } catch (err) {
        lastErr = err;
        if (i === retry) break;
      }
    }
    return { ok: false, error: normalizeError(lastErr) };
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeError(err) {
  if (err?.name === 'AbortError') return { code: 'TIMEOUT', message: '请求超时' };
  return { code: 'NETWORK', message: err?.message || '网络错误' };
}

// 示例 API
export const hisClient = {
  /** 健康检查 */
  async health() {
    // 演示：真实对接请替换为实际健康检查地址
    // 这里模拟一个成功响应
    try {
      // 可替换为：return request('/health', {});
      await new Promise((r) => setTimeout(r, 300));
      return { ok: true, data: { status: 'UP', time: Date.now() } };
    } catch (e) {
      return { ok: false, error: normalizeError(e) };
    }
  },

  /** 刷新 Token（示例） */
  async refreshToken() {
    // 可替换为真实接口
    const cfg = readConfig();
    const newToken = `demo-${Math.random().toString(36).slice(2, 10)}`;
    try {
      const merged = { ...cfg, token: newToken };
      localStorage.setItem('his_config', JSON.stringify(merged));
      return { ok: true, data: { token: newToken } };
    } catch (e) {
      return { ok: false, error: normalizeError(e) };
    }
  },

  /** 示例：同步患者 */
  async syncPatients(params) {
    // 演示：直接返回模拟数据
    await new Promise((r) => setTimeout(r, 400));
    return {
      ok: true,
      data: {
        total: 3,
        items: [
          { id: 'P001', name: '赵凌', gender: '男', age: 30 },
          { id: 'P002', name: '李宽', gender: '女', age: 28 },
          { id: 'P003', name: '王立松', gender: '男', age: 45 },
        ],
        echo: params || null,
      },
    };
  },
};

export default hisClient;


