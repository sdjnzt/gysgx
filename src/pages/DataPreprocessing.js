import React, { useMemo, useState } from 'react';
import { Typography, Card, Upload, Table, Space, Button, Select, Divider, Switch, Row, Col, message, Tooltip, Tag, Statistic, Steps, Progress } from 'antd';
import { InboxOutlined, DownloadOutlined, UploadOutlined, PlayCircleOutlined, ExperimentOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { srmClient } from '../services/srmClient';

/**
 * 数据预处理页面
 * @component DataPreprocessing
 * @description 支持导入模板校验、编码规范化、去重合并、黑白名单校验等操作。
 */
function DataPreprocessing() {
  const systemFields = useMemo(
    () => [
      { label: '供应商名称', value: 'supplierName' },
      { label: '统一社会信用代码', value: 'socialCreditCode' },
      { label: '联系人姓名', value: 'contactName' },
      { label: '联系人手机', value: 'contactPhone' },
      { label: '联系人邮箱', value: 'contactEmail' },
      { label: '开户银行', value: 'bankName' },
      { label: '开户支行', value: 'bankBranch' },
      { label: '账户名称', value: 'bankAccountName' },
      { label: '银行账号', value: 'bankAccountNo' },
      { label: '发票抬头', value: 'invoiceTitle' },
    ],
    []
  );

  const [rawRows, setRawRows] = useState([]);
  const [rawColumns, setRawColumns] = useState([]); // array of header names
  const [mapping, setMapping] = useState({}); // header -> systemField
  const [options, setOptions] = useState({
    trimAll: true,
    uppercaseCredit: true,
    normalizePhone: true,
    removeDuplicates: true,
    dedupKey: 'socialCreditCode',
    validateEmail: false,
  });
  const [previewRows, setPreviewRows] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({ rawCount: 0, mappedFields: 0, previewCount: 0, dedupRemoved: 0 });
  const mappedProgress = useMemo(() => {
    if (!rawColumns.length) return 0;
    return Math.round(((stats.mappedFields || 0) / rawColumns.length) * 100);
  }, [stats.mappedFields, rawColumns.length]);

  /**
   * 解析上传文件为 JSON 行
   * @param {File} file
   */
  async function parseFile(file) {
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
      const headers = XLSX.utils.sheet_to_json(ws, { header: 1 })[0] || [];
      if (!json.length) {
        message.warning('未解析到数据');
        return;
      }
      setRawRows(json);
      setRawColumns(headers);
      // 简单自动映射：按包含关系进行匹配
      const auto = {};
      headers.forEach((h) => {
        const name = String(h || '').toLowerCase();
        if (name.includes('名称')) auto[h] = 'supplierName';
        else if (name.includes('信用') || name.includes('统一') || name.includes('税号')) auto[h] = 'socialCreditCode';
        else if (name.includes('联系人') && name.includes('手')) auto[h] = 'contactPhone';
        else if (name.includes('联系人') && name.includes('邮')) auto[h] = 'contactEmail';
        else if (name.includes('联系人')) auto[h] = 'contactName';
        else if (name.includes('开户行') && name.includes('支')) auto[h] = 'bankBranch';
        else if (name.includes('开户行') || name.includes('银行')) auto[h] = 'bankName';
        else if (name.includes('账户名')) auto[h] = 'bankAccountName';
        else if (name.includes('账号')) auto[h] = 'bankAccountNo';
        else if (name.includes('发票') || name.includes('抬头')) auto[h] = 'invoiceTitle';
      });
      setMapping(auto);
      message.success(`解析成功，共 ${json.length} 行`);
    } catch (e) {
      message.error('文件解析失败');
    }
  }

  /**
   * 根据映射与清洗选项生成预览
   */
  function generatePreview() {
    if (!rawRows.length) {
      message.info('请先导入数据');
      return;
    }
    const mapped = rawRows.map((row) => {
      const obj = {};
      Object.keys(mapping).forEach((header) => {
        const field = mapping[header];
        if (!field) return;
        obj[field] = row[header];
      });
      return obj;
    });
    // 清洗
    const cleaned = mapped.map((r) => {
      const next = { ...r };
      if (options.trimAll) {
        Object.keys(next).forEach((k) => {
          if (typeof next[k] === 'string') next[k] = next[k].trim();
        });
      }
      if (options.uppercaseCredit && next.socialCreditCode) {
        next.socialCreditCode = String(next.socialCreditCode).toUpperCase();
      }
      if (options.normalizePhone && next.contactPhone) {
        next.contactPhone = String(next.contactPhone).replace(/\D+/g, '').slice(0, 11);
      }
      return next;
    });
    // 去重
    let result = cleaned;
    let removed = 0;
    if (options.removeDuplicates && options.dedupKey) {
      const seen = new Set();
      result = cleaned.filter((r) => {
        const key = r[options.dedupKey] || '';
        if (!key) return true;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      removed = cleaned.length - result.length;
    }
    setPreviewRows(result);
    setStats((s) => ({ ...s, rawCount: rawRows.length, previewCount: result.length, mappedFields: Object.values(mapping).filter(Boolean).length, dedupRemoved: removed }));
    message.success(`预览生成：${result.length} 行（原始 ${rawRows.length}，去重 ${removed}）`);
  }

  /**
   * 导出预览结果为 Excel
   */
  function exportPreview() {
    if (!previewRows.length) {
      message.info('无可导出的预览数据');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(previewRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '预处理结果');
    XLSX.writeFile(wb, '预处理结果.xlsx');
  }

  /** 下载导入模板 */
  function downloadTemplate() {
    const headers = ['供应商名称', '统一社会信用代码', '联系人姓名', '联系人手机', '联系人邮箱', '开户银行', '开户支行', '账户名称', '银行账号', '发票抬头'];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '模板');
    XLSX.writeFile(wb, '供应商数据导入模板.xlsx');
  }

  /** 提交到后端（示例） */
  async function handleSubmit() {
    if (!previewRows.length) {
      message.info('请先生成预览');
      return;
    }
    setSubmitting(true);
    try {
      const res = await srmClient.preprocessData({ mapping, options, rows: previewRows });
      if (res.ok) {
        message.success('预处理提交成功');
      } else {
        message.error(res.error?.message || '提交失败');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const uploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: '.xlsx,.xls,.csv',
    beforeUpload: () => false,
    onChange(info) {
      const f = info.file.originFileObj;
      if (f) parseFile(f);
    },
  };

  function generateDemoData() {
    const headers = ['供应商名称','统一社会信用代码','联系人姓名','联系人手机','联系人邮箱','开户银行','开户支行','账户名称','银行账号','发票抬头'];
    const banks = ['中国银行','工商银行','建设银行','农业银行','交通银行','招商银行'];
    const cities = ['济南','青岛','烟台','潍坊','淄博','泰安','临沂','德州','威海','日照'];
    const rows = Array.from({ length: 300 }).map((_, i) => {
      const n = i + 1;
      const name = `${cities[i % cities.length]}${['康泽','益安','泉泰','泰宁','广济','华康'][i % 6]}医药有限公司`;
      const credit = `9137${String(100000000000000000 + n).slice(-14)}${String.fromCharCode(65 + (n % 26))}`.toLowerCase();
      const phone = `13${(i % 9) + 1}${String(10000000 + n).slice(-8)}`;
      const email = `sales${n}@example.com`;
      const bank = banks[i % banks.length];
      const branch = `${cities[i % cities.length]}分行营业部`;
      const acct = `${6216 + (i % 9)}${String(1000000000000000 + n).slice(-16)}`;
      return {
        '供应商名称': `${name}  `,
        '统一社会信用代码': credit,
        '联系人姓名': `张${['伟','磊','敏','静','丽','军'][i % 6]}`,
        '联系人手机': phone,
        '联系人邮箱': email,
        '开户银行': bank,
        '开户支行': branch,
        '账户名称': name,
        '银行账号': acct,
        '发票抬头': name,
      };
    });
    setRawColumns(headers);
    setRawRows(rows);
    const auto = {};
    headers.forEach((h) => {
      const name = String(h).toLowerCase();
      if (name.includes('名称') && !name.includes('账户')) auto[h] = 'supplierName';
      else if (name.includes('信用') || name.includes('统一') || name.includes('税号')) auto[h] = 'socialCreditCode';
      else if (name.includes('联系人') && name.includes('手')) auto[h] = 'contactPhone';
      else if (name.includes('联系人') && name.includes('邮')) auto[h] = 'contactEmail';
      else if (name.includes('联系人')) auto[h] = 'contactName';
      else if (name.includes('开户行') && name.includes('支')) auto[h] = 'bankBranch';
      else if (name.includes('开户行') || name.includes('银行')) auto[h] = 'bankName';
      else if (name.includes('账户名')) auto[h] = 'bankAccountName';
      else if (name.includes('银行账号') || name.includes('账号')) auto[h] = 'bankAccountNo';
      else if (name.includes('发票') || name.includes('抬头')) auto[h] = 'invoiceTitle';
    });
    setMapping(auto);
    setStats((s) => ({ ...s, rawCount: rows.length, mappedFields: Object.values(auto).filter(Boolean).length }));
    message.success(`已生成示例数据：${rows.length} 行`);
  }

  return (
    <div>
      <Typography.Title level={3}>数据预处理</Typography.Title>
      
      {/* 进度步骤 */}
      <Card bodyStyle={{ padding: '16px 24px' }} style={{ marginBottom: 16 }}>
        <Steps 
          size="small" 
          current={!rawRows.length ? 0 : Object.values(mapping).filter(Boolean).length === 0 ? 1 : 2} 
          items={[
            { title: '1 上传/生成' }, 
            { title: '2 字段映射' }, 
            { title: '3 清洗与预览' }
          ]} 
          style={{ marginBottom: 16 }} 
        />
        
        {/* 统计卡片 - 更紧凑的布局 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic title="原始行数" value={stats.rawCount} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic title="映射字段数" value={stats.mappedFields} />
              <Progress percent={mappedProgress} size="small" showInfo={false} style={{ marginTop: 8 }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic title="预览行数" value={stats.previewCount} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic title="去重移除" value={stats.dedupRemoved} />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <Card bodyStyle={{ padding: '16px 24px' }}>
        <Space align="start" style={{ width: '100%' }} direction="vertical" size="large">
          
          {/* 第一步：上传/生成 */}
          <div>
            <Typography.Title level={5} style={{ marginBottom: 16 }}>1 上传/生成</Typography.Title>
            <Row gutter={16}>
              <Col span={10}>
                <Upload.Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">(xlsx/csv) 仅处理首个工作表;第一行为表头</p>
                </Upload.Dragger>
                <Space style={{ marginTop: 12 }}>
                  <Button icon={<ExperimentOutlined />} onClick={generateDemoData}>
                    生成默认数据
                  </Button>
                </Space>
              </Col>
              
              {/* 第二步：字段映射 */}
              <Col span={14}>
                <Typography.Title level={5} style={{ marginBottom: 16 }}>2 字段映射</Typography.Title>
                <Space style={{ marginBottom: 12 }}>
                  <Button onClick={() => {
                    const auto = {};
                    rawColumns.forEach((h) => {
                      const name = String(h || '').toLowerCase();
                      if (name.includes('名称') && !name.includes('账户')) auto[h] = 'supplierName';
                      else if (name.includes('信用') || name.includes('统一') || name.includes('税号')) auto[h] = 'socialCreditCode';
                      else if (name.includes('联系人') && name.includes('手')) auto[h] = 'contactPhone';
                      else if (name.includes('联系人') && name.includes('邮')) auto[h] = 'contactEmail';
                      else if (name.includes('联系人')) auto[h] = 'contactName';
                      else if (name.includes('开户行') && name.includes('支')) auto[h] = 'bankBranch';
                      else if (name.includes('开户行') || name.includes('银行')) auto[h] = 'bankName';
                      else if (name.includes('账户名')) auto[h] = 'bankAccountName';
                      else if (name.includes('银行账号') || name.includes('账号')) auto[h] = 'bankAccountNo';
                      else if (name.includes('发票') || name.includes('抬头')) auto[h] = 'invoiceTitle';
                    });
                    setMapping(auto);
                    setStats((s) => ({ ...s, mappedFields: Object.values(auto).filter(Boolean).length }));
                    message.success('已自动映射');
                  }}>自动映射</Button>
                  <Button onClick={() => { setMapping({}); setStats((s)=>({ ...s, mappedFields: 0 })); }}>清空映射</Button>
                </Space>
                {rawColumns.length ? (
                  <Table
                    size="small"
                    pagination={false}
                    scroll={{ y: 200 }}
                    rowKey={(r) => r.source || r.key}
                    columns={[
                      { title: '源字段', dataIndex: 'source', width: 200, render: (v) => <Tag color="blue">{v || '(空列名)'}</Tag> },
                      { title: '映射到', dataIndex: 'target', render: (_, r) => (
                        <Select
                          allowClear
                          placeholder="选择系统字段"
                          style={{ width: '100%' }}
                          options={systemFields}
                          value={mapping[r.source]}
                          onChange={(val) => setMapping((m) => ({ ...m, [r.source]: val }))}
                        />
                      ) },
                    ]}
                    dataSource={rawColumns.map((col, idx) => ({ key: idx, source: col, target: mapping[col] }))}
                  />
                ) : (
                  <div style={{ 
                    border: '1px dashed #d9d9d9', 
                    borderRadius: '6px', 
                    padding: '40px', 
                    textAlign: 'center',
                    backgroundColor: '#fafafa',
                    color: '#999'
                  }}>
                    请先上传文件以识别表头
                  </div>
                )}
              </Col>
            </Row>
          </div>

          {/* 第三步：清洗与去重 */}
          <div>
            <Typography.Title level={5} style={{ marginBottom: 16 }}>3 清洗与去重</Typography.Title>
            <Row gutter={[16, 12]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Space>
                  <span>去除重复</span>
                  <Switch checked={options.removeDuplicates} onChange={(v) => setOptions((o) => ({ ...o, removeDuplicates: v }))} />
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Space>
                  <span>依据</span>
                  <Select
                    value={options.dedupKey}
                    onChange={(v) => setOptions((o) => ({ ...o, dedupKey: v }))}
                    options={systemFields}
                    style={{ width: 120 }}
                  />
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Space>
                  <span>去除首尾空格</span>
                  <Switch checked={options.trimAll} onChange={(v) => setOptions((o) => ({ ...o, trimAll: v }))} />
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Space>
                  <span>信用代码大写</span>
                  <Switch checked={options.uppercaseCredit} onChange={(v) => setOptions((o) => ({ ...o, uppercaseCredit: v }))} />
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Space>
                  <span>手机号格式化</span>
                  <Switch checked={options.normalizePhone} onChange={(v) => setOptions((o) => ({ ...o, normalizePhone: v }))} />
                </Space>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Space>
                  <span>校验邮箱</span>
                  <Switch checked={options.validateEmail} onChange={(v) => setOptions((o) => ({ ...o, validateEmail: v }))} />
                </Space>
              </Col>
            </Row>
          </div>

          {/* 操作按钮 */}
          <Space>
            <Button icon={<PlayCircleOutlined />} type="primary" onClick={generatePreview}>
              生成预览
            </Button>
            <Button icon={<DownloadOutlined />} onClick={exportPreview}>
              导出预览结果
            </Button>
            <Button icon={<UploadOutlined />} type="dashed" loading={submitting} onClick={handleSubmit}>
              提交预处理
            </Button>
            <Tooltip title="下载空白模板">
              <Button onClick={downloadTemplate}>下载模板</Button>
            </Tooltip>
          </Space>

          {/* 预览结果 */}
          {previewRows.length > 0 && (
            <div>
              <Typography.Title level={5} style={{ marginBottom: 16 }}>预览结果</Typography.Title>
              <Table
                size="middle"
                bordered
                rowKey={(r, idx) => idx}
                scroll={{ x: true }}
                columns={systemFields.map((f) => ({ title: f.label, dataIndex: f.value }))}
                dataSource={previewRows}
                pagination={{ pageSize: 15, showSizeChanger: true }}
              />
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
}

export default DataPreprocessing;


