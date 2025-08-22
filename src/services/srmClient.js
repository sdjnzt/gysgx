/**
 * SRM 接口客户端（localStorage 模拟后端）
 * @module srmClient
 * @description 使用浏览器 localStorage 持久化，模拟真实后端读写，页面刷新后数据仍在。
 */

/**
 * 读取 SRM 配置
 * @returns {{ apiUrl: string, timeoutMs: number, retry: number }}
 */
function readSrmConfig() {
  try {
    const saved = localStorage.getItem('srm_config');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return {
    apiUrl: 'https://srm.example.com/api',
    timeoutMs: 8000,
    retry: 0,
  };
}

/** 稳定哈希函数 */
function hashInt(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

/** 安全读取 JSON */
function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

/** 安全写入 JSON */
function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * 统一请求（可替换为真实后端）
 * @param {string} path
 * @param {object} payload
 * @returns {Promise<{ ok: boolean, data?: any, error?: { code: string, message: string } }>} 
 */
async function request(path, payload) {
  // 这里保留占位，真实项目可替换为 fetch；当前由具体 API 直接操作 localStorage
  await new Promise((r) => setTimeout(r, 120));
  return { ok: true, data: { echo: { path, payload }, time: Date.now() } };
}

/**
 * 统一错误
 * @param {any} err
 * @returns {{ code: string, message: string }}
 */
function normalizeError(err) {
  return { code: 'NETWORK', message: err?.message || '网络错误' };
}

/**
 * SRM 领域 API
 */
export const srmClient = {
  /**
   * 列出供应商（支持搜索与分页）
   * @param {{ keyword?: string, page?: number, pageSize?: number }} query
   */
  async listSuppliers(query = {}) {
    const list = readJson('srm_suppliers', []);
    const keyword = (query.keyword || '').trim().toLowerCase();
    const type = query.type || '';
    const active = query.active;
    const filtered = list.filter((x) => {
      // 首先过滤掉山东康源堂药业股份有限公司
      if (x.supplierName && (x.supplierName.includes('康源堂') || x.supplierName === '山东康源堂药业股份有限公司')) {
        return false;
      }
      
      const matchKeyword = keyword
        ? [x.supplierName, x.socialCreditCode, x.contactName, x.contactPhone]
            .filter(Boolean)
            .some((f) => String(f).toLowerCase().includes(keyword))
        : true;
      const matchType = type ? x.supplierType === type : true;
      const matchActive = typeof active === 'boolean' ? x.isActive === active : true;
      return matchKeyword && matchType && matchActive;
    });
    const page = Number(query.page || 1);
    const pageSize = Number(query.pageSize || 10);
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return { ok: true, data: { items, total: filtered.length, page, pageSize } };
  },

  /** 下拉选项（id/name） */
  async listSupplierOptions() {
    const list = readJson('srm_suppliers', []);
    // 过滤掉山东康源堂药业股份有限公司
    const filtered = list.filter((x) => 
      !x.supplierName.includes('康源堂') && 
      x.supplierName !== '山东康源堂药业股份有限公司'
    );
    return { ok: true, data: filtered.map((x) => ({ label: x.supplierName, value: x.id })) };
  },

  /**
   * 新增或更新供应商
   * @param {object} supplier
   */
  async upsertSupplier(supplier) {
    const list = readJson('srm_suppliers', []);
    const id = supplier.id || `S-${Date.now()}`;
    const next = (() => {
      const exists = list.some((x) => x.id === id);
      const payload = { ...supplier, id };
      return exists ? list.map((x) => (x.id === id ? { ...x, ...payload } : x)) : [payload, ...list];
    })();
    writeJson('srm_suppliers', next);
    return { ok: true, data: { id } };
  },

  /** 删除供应商 */
  async deleteSupplier(id) {
    const list = readJson('srm_suppliers', []);
    writeJson('srm_suppliers', list.filter((x) => x.id !== id));
    return { ok: true, data: { deleted: true } };
  },

  /**
   * 读取供应商基本信息（单体示例）
   */
  async getSupplierBaseInfo() {
    const data = readJson('srm_supplier_base', null);
    return { ok: true, data };
  },

  /**
   * 提交或更新供应商基本信息
   * @param {object} form
   */
  async upsertSupplierBaseInfo(form) {
    writeJson('srm_supplier_base', form || {});
    return { ok: true, data: { saved: true } };
  },

  /**
   * 预处理数据（导入/清洗）
   * @param {{ fileId?: string, mapping?: object }} params
   */
  async preprocessData(params) {
    writeJson('srm_preprocess_last', params || {});
    return { ok: true, data: { saved: true } };
  },

  /**
   * 资质上传与管理
   * @param {{ supplierId: string, items: Array<object> }} params
   */
  async manageQualifications(params) {
    const key = `srm_qualifications_${params?.supplierId || 'DEFAULT'}`;
    writeJson(key, { items: Array.isArray(params?.items) ? params.items : [] });
    return { ok: true, data: { saved: true } };
  },

  /** 获取资质清单 */
  async getQualifications(supplierId) {
    const key = `srm_qualifications_${supplierId || 'DEFAULT'}`;
    const data = readJson(key, { items: [] });
    return { ok: true, data };
  },

  /** 为指定供应商生成示例资质数据并追加 */
  async generateQualifications(supplierId, count = 50) {
    const key = `srm_qualifications_${supplierId || 'DEFAULT'}`;
    const existing = readJson(key, { items: [] });
    const now = Date.now();
    const types = ['营业执照', '药品经营许可证', '医疗器械经营许可证', 'GSP认证', '开户许可证', '一般纳税人资格'];
    const startIdx = existing.items.length;
    function rand01(seedStr, k) {
      let h = 0;
      const s = `${seedStr}-${k}`;
      for (let i = 0; i < s.length; i += 1) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
      return (Math.abs(h) % 1000) / 1000; // 0~0.999
    }
    function sampleOffset(seedStr, k) {
      const r = rand01(seedStr, k);
      // 分布：15% 已过期(1~30天前)，20% 即将到期(1~30天内)，65% 有效(31~365天后)
      if (r < 0.15) return -1 - Math.floor(rand01(seedStr, k + 7) * 30);
      if (r < 0.35) return 1 + Math.floor(rand01(seedStr, k + 19) * 30);
      return 31 + Math.floor(rand01(seedStr, k + 37) * 335);
    }
    const more = Array.from({ length: count }).map((_, i) => {
      const n = startIdx + i + 1;
      const offset = sampleOffset(String(supplierId), n);
      return {
        id: `Q-${supplierId}-${now}-${i}`,
        type: types[(i + n) % types.length],
        number: `NO-${String(100000 + n)}`,
        issueDate: now - 86400000 * (365 + (n % 500)),
        expiryDate: now + 86400000 * offset,
        issuer: '市场监管局',
        attachments: [],
        remark: n % 11 === 0 ? '年审资料不全' : '',
      };
    });
    const next = { items: [...more, ...(existing.items || [])] };
    writeJson(key, next);
    return { ok: true, data: { added: more.length } };
  },

  /**
   * 分类与分级规则保存
   * @param {{ rules: Array<object> }} body
   */
  async saveCategoryGradingRules(body) {
    writeJson('srm_category_rules', body || {});
    return { ok: true, data: { saved: true } };
  },

  /** 读取分类与分级规则 */
  async getCategoryGradingRules() {
    const data = readJson('srm_category_rules', null);
    return { ok: true, data };
  },

  /**
   * 采购订单增删改查
   * @param {object} query
   */
  async listPurchaseOrders(query) {
    const list = readJson('srm_pos', []);
    return { ok: true, data: { items: list } };
  },

  /**
   * 新增采购订单
   * @param {object} body
   */
  async createPurchaseOrder(body) {
    const list = readJson('srm_pos', []);
    const next = [body, ...list];
    writeJson('srm_pos', next);
    return { ok: true, data: { created: true } };
  },

  /**
   * 更新采购订单
   * @param {object} body
   */
  async updatePurchaseOrder(body) {
    const list = readJson('srm_pos', []);
    const next = list.map((r) => (r.poNo === body.poNo ? { ...r, ...body } : r));
    writeJson('srm_pos', next);
    return { ok: true, data: { updated: true } };
  },

  /**
   * 订单状态流转
   * @param {{ poNo: string, action: 'submit'|'receive'|'reconcile' }} body
   */
  async transitionPurchaseOrder(body) {
    const list = readJson('srm_pos', []);
    const next = list.map((r) => {
      if (r.poNo !== body.poNo) return r;
      if (body.action === 'submit') return { ...r, status: 'submitted' };
      if (body.action === 'receive') return { ...r, status: 'received' };
      if (body.action === 'reconcile') return { ...r, status: 'reconciled' };
      return r;
    });
    writeJson('srm_pos', next);
    return { ok: true, data: { transitioned: true } };
  },

  /** 获取采购订单详情 */
  async getPurchaseOrder(poNo) {
    const list = readJson('srm_pos', []);
    const order = list.find(r => r.poNo === poNo);
    if (!order) {
      return { ok: false, error: { code: 'NOT_FOUND', message: '订单不存在' } };
    }
    // 如果订单没有明细行，生成一些示例明细
    if (!order.items?.length) {
      const itemCount = 1 + Math.floor(Math.abs(hashInt(poNo)) % 5); // 1~5 行
      order.items = Array.from({ length: itemCount }).map((_, i) => {
        const n = i + 1;
        // 单价在 5000~100000 之间浮动
        const price = Math.round((5000 + (hashInt(`${poNo}-${n}-price`) % 951) * 100) * 100) / 100;
        // 数量在 50~500 之间浮动
        const qty = 50 + (hashInt(`${poNo}-${n}-qty`) % 451);
        // 真实的药品名称库
        const drugNames = [
          '注射用头孢曲松钠 1g*10支/盒',
          '阿莫西林胶囊 0.25g*24粒/盒',
          '甲硝唑注射液 100ml*10支/盒',
          '复方丹参滴丸 27mg*180丸/瓶',
          '板蓝根颗粒 10g*20袋/盒',
          '氨茶碱注射液 250mg*10支/盒',
          '维生素C注射液 500mg*10支/盒',
          '生理氯化钠注射液 500ml*20袋/箱',
          '葡萄糖注射液 250ml*20袋/箱',
          '碘伏消毒液 500ml*12瓶/箱',
          '一次性注射器 5ml*100支/盒',
          '医用口罩 50个/盒',
          '红霉素软膏 10g*10支/盒',
          '布洛芬缓释胶囊 0.3g*20粒/盒',
          '奥美拉唑肠溶胶囊 20mg*14粒/盒',
          '硝苯地平缓释片 30mg*7片/盒',
          '阿司匹林肠溶片 25mg*30片/盒',
          '胰岛素注射液 300IU*3ml/支',
          '肝素钠注射液 12500IU*2ml/支',
          '地塞米松注射液 5mg*10支/盒'
        ];
        
        return {
          sku: `SKU${String(10000 + hashInt(poNo + n)).slice(-5)}`,
          name: drugNames[hashInt(`${poNo}-${n}-name`) % drugNames.length],
          qty,
          price,
        };
      });
    }
    return { ok: true, data: order };
  },

  /** 删除采购订单 */
  async deletePurchaseOrder(poNo) {
    const list = readJson('srm_pos', []);
    writeJson('srm_pos', list.filter((r) => r.poNo !== poNo));
    return { ok: true, data: { deleted: true } };
  },
};

// 一次性种子数据（仅首次）
(function ensureSeed() {
  // 使用新版本号，便于覆盖旧的少量数据
  const seeded = readJson('srm_seeded_v6', false);
  if (seeded) return;
  const now = Date.now();

  // 1) 供应商列表（生成 80 家）
  const supplierTypes = ['生产厂家', '经销商', '服务商'];
  const provinces = ['山东省'];
  const cities = ['济南市','青岛市','烟台市','潍坊市','淄博市','泰安市','临沂市','德州市','威海市','日照市','枣庄市','聊城市','滨州市','菏泽市'];
  const namePartA = ['益安','泉泰','泰宁','新济','惠民','德康','鲁信','泉成','安泰','和康','博济','盛泉','远景','恒瑞','广济','瑞宁','华康','安成','京鲁','康泽'];
  const suffixes = ['医药有限公司','医药贸易有限公司','药业有限公司','医疗器械有限公司','生物科技有限公司'];

  function buildSupplierName(i) {
    if (i === 0) return '枣庄和康医药有限公司';
    const city = cities[i % cities.length].replace('市','');
    let a = namePartA[i % namePartA.length];
    const s = suffixes[i % suffixes.length];
    
    // 确保不生成山东康源堂药业股份有限公司或类似名称
    // 避免使用可能与康源堂相似的名称部分
    if (a.includes('康源') || a.includes('源堂')) {
      a = namePartA[(i + 3) % namePartA.length]; // 跳过更多位置避免冲突
    }
    
    const name = `${city}${a}${s}`;
    
    // 双重检查，确保生成的名称不包含敏感词汇
    if (name.includes('康源堂') || name.includes('股份') || name === '山东康源堂药业股份有限公司') {
      // 使用安全的替代名称
      const safeA = namePartA[(i + 5) % namePartA.length];
      return `${city}${safeA}${s}`;
    }
    
    return name;
  }

  // 更真实的中文联系人姓名与岗位
  const surnames = ['王','李','张','刘','陈','杨','赵','黄','周','吴','徐','孙','马','朱','胡','郭','何','高','林','罗'];
  const givenA = ['伟','磊','敏','静','婷','秀','强','丽','军','芳','勇','杰','娜','艳','超','明','霞','平','刚','玲'];
  const givenB = ['华','娟','峰','丹','楠','梅','琳','波','琪','莹','龙','凯','瑞','倩','旭','博','鑫','宇','晨'];
  const titles = ['采购经理','商务经理','销售代表','渠道经理','客户经理'];

  function buildCnName(seed) {
    const s = surnames[seed % surnames.length];
    const a = givenA[seed % givenA.length];
    const b = seed % 3 === 0 ? '' : givenB[seed % givenB.length];
    return `${s}${a}${b}`;
  }

  // 号段库 & 生成函数（更真实且可复现）
  const cmcc = ['134','135','136','137','138','139','147','148','150','151','152','157','158','159','172','178','182','183','184','187','188','198'];
  const cucc = ['130','131','132','145','146','155','156','166','175','176','185','186'];
  const ctc  = ['133','149','153','173','174','177','180','181','189','199'];
  // 已移至顶部
  function lcg(seed) {
    let x = seed % 2147483647; if (x <= 0) x += 2147483646; return () => (x = (x * 48271) % 2147483647);
  }
  const cityAreaCode = {
    '济南市': '0531','青岛市': '0532','烟台市': '0535','潍坊市': '0536','淄博市': '0533','泰安市': '0538','临沂市': '0539','德州市': '0534','威海市': '0631','日照市': '0633','枣庄市': '0632','聊城市': '0635','滨州市': '0543','菏泽市': '0530'
  };
  function genPhone(seed, city) {
    // 80% 移动手机，20% 座机（带区号）
    const rnd = (hashInt(`${seed}-${city}`) % 100) / 100;
    if (rnd < 0.8) {
      const pools = [cmcc, cucc, ctc];
      const pool = pools[hashInt(`${seed}`) % pools.length];
      const prefix = pool[hashInt(`${seed}-${city}`) % pool.length];
      const rng = lcg(hashInt(`${prefix}-${seed}`));
      const num = Array.from({ length: 8 }).map(() => String(rng() % 10)).join('');
      return `${prefix}${num}`; // 11位
    }
    const code = cityAreaCode[city] || '0531';
    const rng2 = lcg(hashInt(`${seed}-land-${city}`));
    const len = 7 + (rng2() % 2); // 7或8位
    const tail = Array.from({ length: len }).map(() => String(rng2() % 10)).join('');
    return `${code}-${tail}`;
  }

  // 银行卡/对公账户生成（更真实的号段+Luhn）
  const bankBins = {
    '中国银行': ['621661', '621660', '621663'],
    '工商银行': ['622202', '622208', '621226'],
    '建设银行': ['621700', '621284', '623668'],
    '农业银行': ['622848', '621282', '621336'],
    '交通银行': ['622260', '621069'],
    '招商银行': ['622588', '621486'],
    '中信银行': ['622696', '622690'],
    '光大银行': ['622666', '621003'],
    '民生银行': ['622622', '622600'],
    '浦发银行': ['622521', '621792'],
  };
  const bankNames = Object.keys(bankBins);
  function luhnChecksum(numStr) {
    const arr = numStr.split('').reverse().map((d) => parseInt(d, 10));
    let sum = 0;
    for (let i = 0; i < arr.length; i += 1) {
      let n = arr[i];
      if (i % 2 === 0) sum += n; else { n *= 2; if (n > 9) n -= 9; sum += n; }
    }
    return sum % 10;
  }
  function luhnComplete(numWithoutCheck) {
    for (let d = 0; d <= 9; d += 1) {
      const s = `${numWithoutCheck}${d}`;
      if (luhnChecksum(s) === 0) return s;
    }
    return `${numWithoutCheck}0`;
  }
  /**
   * 生成真实的统一社会信用代码
   * @param {number} seed - 随机种子
   * @param {string} city - 城市名称
   * @returns {string} 18位统一社会信用代码
   */
  function genSocialCreditCode(seed, city) {
    try {
      const rng = (salt = '') => hashInt(`${seed}-${salt}`) % 100;
      
      // 登记管理部门代码：9-市场监督管理部门
      const regCode = '9';
      
      // 机构类别代码：1-企业，2-个体工商户，3-农民专业合作社，9-其他
      const orgType = '1'; // 企业
      
      // 登记管理机关行政区划码（6位）
      const areaCodes = {
        '济南市': '370100',
        '青岛市': '370200', 
        '淄博市': '370300',
        '枣庄市': '370400',
        '东营市': '370500',
        '烟台市': '370600',
        '潍坊市': '370700',
        '济宁市': '370800',
        '泰安市': '370900',
        '威海市': '371000',
        '日照市': '371100',
        '临沂市': '371300',
        '德州市': '371400',
        '聊城市': '371500',
        '滨州市': '371600',
        '菏泽市': '371700'
      };
      
      const areaCode = areaCodes[city] || '370100';
      
      // 主体标识码（8位）- 使用种子生成
      let mainCode = '';
      for (let i = 0; i < 8; i++) {
        const val = rng(`main-${i}`) % 36;
        if (val < 10) {
          mainCode += String(val);
        } else {
          mainCode += String.fromCharCode(65 + (val - 10)); // A-Z
        }
      }
      
      // 确保mainCode长度为8位
      if (mainCode.length !== 8) {
        console.error('Invalid mainCode length:', mainCode.length, 'Expected 8, got:', mainCode);
        mainCode = 'MA3K2B4C'; // 使用默认值
      }
      
      // 前17位
      const code17 = regCode + orgType + areaCode + mainCode;
      
      // 确保code17长度为17位
      if (code17.length !== 17) {
        console.error('Invalid code17 length:', code17.length, 'Expected 17, got:', code17);
        // 如果长度不对，返回一个默认的有效代码
        return '91370100MA3K2B4C5D';
      }
      
      // 计算校验码（第18位）
      const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
      const chars = '0123456789ABCDEFGHJKLMNPQRTUWXY';
      
      let sum = 0;
      for (let i = 0; i < 17; i++) {
        const char = code17.charAt(i);
        if (!char) {
          console.error('Invalid character at position', i, 'in code17:', code17);
          continue;
        }
        
        let value;
        if (char >= '0' && char <= '9') {
          value = parseInt(char);
        } else {
          value = char.charCodeAt(0) - 65 + 10;
        }
        sum += value * weights[i];
      }
      
      const checkCode = chars[31 - (sum % 31)];
      
      // 最终验证
      const finalCode = code17 + checkCode;
      if (finalCode.length !== 18) {
        console.error('Final code length error:', finalCode.length, 'Expected 18, got:', finalCode);
        return '91370100MA3K2B4C5D'; // 返回默认有效代码
      }
      
      return finalCode;
    } catch (error) {
      console.error('Error generating social credit code:', error);
      return '91370100MA3K2B4C5D'; // 返回默认有效代码
    }
  }

  function genBankAccount(seed, city) {
    const rnd = (hashInt(`bank-${seed}-${city}`) % 100) / 100;
    const bank = bankNames[hashInt(`bankName-${seed}`) % bankNames.length];
    // 70% 生成银行卡号（16或19位，Luhn合法）
    if (rnd < 0.7) {
      const bins = bankBins[bank];
      const bin = bins[hashInt(`bin-${seed}`) % bins.length];
      const len = 16 + (hashInt(`len-${seed}`) % 2) * 3; // 16或19
      const rng = lcg(hashInt(`acct-${seed}`));
      let body = bin;
      while (body.length < len - 1) { body += String(rng() % 10); }
      const full = luhnComplete(body);
      return { bankName: bank, accountNo: full };
    }
    // 30% 生成对公账号（12~16位随机）
    const rng2 = lcg(hashInt(`corp-${seed}`));
    const len = 12 + (rng2() % 5); // 12~16
    let num = '';
    for (let i = 0; i < len; i += 1) num += String(rng2() % 10);
    return { bankName: bank, accountNo: num };
  }

  const suppliers = Array.from({ length: 80 }).map((_, i) => {
    const n = i + 1;
    const id = `S-${1000 + n}`;
    const name = buildSupplierName(i);
    const type = supplierTypes[n % supplierTypes.length];
    const contactName = buildCnName(n * 7 + i);
    const bankInfo = genBankAccount(n * 31 + i, cities[i % cities.length]);
    return {
      id,
      supplierName: name,
      socialCreditCode: genSocialCreditCode(n * 123 + i, cities[i % cities.length]),
      supplierType: type,
      province: provinces[0],
      city: cities[i % cities.length],
      registeredAddress: `${provinces[0]}${cities[i % cities.length]}历下区示例路${n}号`,
      isActive: n % 7 !== 0,
      legalPerson: buildCnName(n * 13 + 5),
      registeredCapital: 1000 + (n % 50) * 100,
      businessScope: '药品、医疗器械批发；消杀用品；中成药、化学药制剂',
      contactName,
      contactTitle: titles[(n + i) % titles.length],
      contactPhone: genPhone(n * 17 + i, cities[i % cities.length]),
      contactEmail: `contact${n}@corp.local`,
      bankName: bankInfo.bankName,
      bankBranch: `${cities[i % cities.length]}分行营业部`,
      bankAccountName: name,
      bankAccountNo: bankInfo.accountNo,
      invoiceTitle: name,
      invoiceType: n % 3 === 0 ? '普通发票' : '专用发票',
      taxRate: n % 4 === 0 ? 6 : 13,
      establishedDate: now - 86400000 * 365 * ((n % 10) + 1),
      ratingScore: 60 + (n % 40),
    };
  });
  
  // 过滤掉任何可能包含山东康源堂药业股份有限公司的数据
  const filteredSuppliers = suppliers.filter(supplier => 
    !supplier.supplierName.includes('康源堂') && 
    supplier.supplierName !== '山东康源堂药业股份有限公司'
  );
  
  // 清理可能存在的旧数据
  const existingData = readJson('srm_suppliers', []);
  const cleanedExistingData = existingData.filter(supplier => 
    !supplier.supplierName.includes('康源堂') && 
    supplier.supplierName !== '山东康源堂药业股份有限公司'
  );
  
  writeJson('srm_suppliers', filteredSuppliers);

  // 2) 单体基础信息（保留）
  writeJson('srm_supplier_base', {
    supplierName: '枣庄和康医药有限公司',
    socialCreditCode: genSocialCreditCode(999, '枣庄市'),
    supplierType: '经销商',
    registeredAddress: '山东省济南市历下区示例路100号',
    isActive: true,
  });

  // 3) 资质台账（每个供应商 10~16 条，分布：15%过期、20%即将到期、65%有效）
  const qualTypes = ['营业执照', '药品经营许可证', '医疗器械经营许可证', 'GSP认证', '开户许可证', '一般纳税人资格'];
  function rand01(seedStr, k) {
    let h = 0; const s = `${seedStr}-${k}`; for (let i = 0; i < s.length; i += 1) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
    return (Math.abs(h) % 1000) / 1000;
  }
  function sampleOffset(seedStr, k) {
    const r = rand01(seedStr, k);
    if (r < 0.15) return -1 - Math.floor(rand01(seedStr, k + 7) * 30);
    if (r < 0.35) return 1 + Math.floor(rand01(seedStr, k + 19) * 30);
    return 31 + Math.floor(rand01(seedStr, k + 37) * 335);
  }
  suppliers.slice(0, 60).forEach((sp, idx) => {
    const count = 10 + (idx % 7); // 10~16
    const items = Array.from({ length: count }).map((_, i) => {
      const n = idx * 11 + i + 1;
      const type = qualTypes[n % qualTypes.length];
      const offset = sampleOffset(sp.id, n);
      return {
        id: `Q-${sp.id}-${i+1}`,
        type,
        number: `NO-${String(100000 + n)}`,
        issueDate: now - 86400000 * (365 + (n % 500)),
        expiryDate: now + 86400000 * offset,
        issuer: '市场监管局',
        attachments: [],
        remark: n % 11 === 0 ? '年审待提交' : '',
      };
    });
    writeJson(`srm_qualifications_${sp.id}`, { items });
  });
  // DEFAULT 也给一些示例，避免空白
  writeJson('srm_qualifications_DEFAULT', { items: Array.from({ length: 20 }).map((_, i) => ({
    id: `Q-DEFAULT-${i+1}`,
    type: qualTypes[i % qualTypes.length],
    number: `NO-${String(900000 + i)}`,
    issueDate: now - 86400000 * (365 + (i % 400)),
    expiryDate: now + 86400000 * sampleOffset('DEFAULT', i + 1),
    issuer: '市场监管局',
    attachments: [],
    remark: i % 7 === 0 ? '资料变更' : '',
  })) });

  // 4) 分级规则（沿用默认）
  writeJson('srm_category_rules', {
    categories: [
      { key: 'A', name: 'A级', minScore: 85 },
      { key: 'B', name: 'B级', minScore: 70 },
      { key: 'C', name: 'C级', minScore: 0 },
    ],
    metrics: [
      { key: 'deliveryOnTime', name: '按时交付', weight: 40 },
      { key: 'qualityScore', name: '质量评分', weight: 40 },
      { key: 'complianceScore', name: '合规评分', weight: 20 },
    ],
  });

  // 5) 采购订单（生成 120 条、状态分布）
  const poStatuses = ['draft', 'submitted', 'received', 'reconciled'];
  const pos = Array.from({ length: 120 }).map((_, i) => {
    const n = i + 1;
    const sp = suppliers[n % suppliers.length];
    return {
      poNo: `PO2025${String(10000 + n)}`,
      supplierId: sp.id,
      supplierName: sp.supplierName,
      poDate: now - 86400000 * n,
      currency: 'CNY',
      amount: Math.round((200000 + (n % 300) * 28888 + (hashInt(String(n)) % 100) * 10000) * 100) / 100,
      status: poStatuses[n % poStatuses.length],
      items: [],
    };
  });
  writeJson('srm_pos', pos);

  writeJson('srm_seeded_v6', true);
})();

export default srmClient;


