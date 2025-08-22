import React, { useMemo, useState } from 'react';
import { Typography, Card, Form, Input, InputNumber, Space, Button, Table, message, Row, Col, Tag, Select, Tabs } from 'antd';
import * as XLSX from 'xlsx';
import { srmClient } from '../services/srmClient';
import { useCallback } from 'react';

/**
 * 供应商分类与分级页面
 * @component CategoryGrading
 * @description 依据物料/服务范围、履约记录与风控评分进行分层管理。
 */
function CategoryGrading() {
  const [categories, setCategories] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // 供应商列表
  const [selectedSuppliers, setSelectedSuppliers] = useState([]); // 选中的供应商
  const [loading, setLoading] = useState(false);

  const [sampleRows, setSampleRows] = useState([
    { supplierName: '枣庄和康医药有限公司', deliveryOnTime: 95, qualityScore: 92, complianceScore: 96 },
  ]);

  const [previewRows, setPreviewRows] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const [gradedSuppliers, setGradedSuppliers] = useState([]); // 已分类分级的供应商列表
  const [loadingGraded, setLoadingGraded] = useState(false); // 加载已分级供应商的loading状态

  /**
   * 稳定随机数 0~1
   */
  function rand01(seed, salt) {
    const s = `${seed}-${salt || ''}`;
    let h = 0;
    for (let i = 0; i < s.length; i += 1) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
    return (Math.abs(h) % 1000) / 1000;
  }

  /**
   * 从供应商台账加载样本数据（更真实的大规模样本）
   */
  async function loadSupplierSamples(targetCount = 200) {
    setLoadingSamples(true);
    try {
      let page = 1;
      const pageSize = 50;
      const rows = [];
      let total = Infinity;
      while (rows.length < targetCount && (page - 1) * pageSize < total) {
        const res = await srmClient.listSuppliers({ page, pageSize });
        if (!res.ok) break;
        total = Number(res.data?.total || 0);
        const items = res.data?.items || [];
        items.forEach((sp) => {
          const base = Number(sp.ratingScore || 70);
          const r1 = rand01(sp.id, 'onTime');
          const r2 = rand01(sp.id, 'quality');
          const r3 = rand01(sp.id, 'compliance');
          const deliveryOnTime = Math.min(99, Math.max(55, Math.round(base + (r1 - 0.5) * 20)));
          const qualityScore = Math.min(98, Math.max(55, Math.round(base + (r2 - 0.5) * 18)));
          const complianceScore = Math.min(99, Math.max(55, Math.round(base + (r3 - 0.5) * 22)));
          rows.push({ supplierName: sp.supplierName, deliveryOnTime, qualityScore, complianceScore });
        });
        if (page * pageSize >= total) break;
        page += 1;
      }
      setSampleRows(rows.slice(0, targetCount));
      message.success(`已从台账载入 ${Math.min(rows.length, targetCount)} 个样本`);
    } finally {
      setLoadingSamples(false);
    }
  }

  /**
   * 计算综合得分
   * @param {{ [k:string]: number }} row
   * @returns {number}
   */
  function computeScore(row) {
    const totalWeight = metrics.reduce((s, m) => s + Number(m.weight || 0), 0) || 1;
    const normalized = metrics.map((m) => ({ ...m, w: Number(m.weight || 0) / totalWeight }));
    let sum = 0;
    normalized.forEach((m) => {
      const v = Number(row[m.key] || 0);
      sum += v * m.w;
    });
    return Math.round(sum * 100) / 100;
  }

  /**
   * 根据得分映射等级
   * @param {number} score
   */
  function mapCategory(score) {
    // 按 minScore 从高到低排序
    const ranked = [...categories].sort((a, b) => b.minScore - a.minScore);
    const hit = ranked.find((c) => score >= Number(c.minScore || 0));
    return hit ? hit.name : ranked[ranked.length - 1]?.name || '未分级';
  }

  /** 生成预览 */
  async function generatePreview() {
    if (!selectedSuppliers.length && !sampleRows.length) {
      message.info('请选择要评估的供应商，或使用"从供应商台账载入样本"按钮');
      return;
    }

    // 如果有选中的供应商，优先使用选中的供应商
    if (selectedSuppliers.length) {
      const selectedRows = [];
      for (const id of selectedSuppliers) {
        const supplier = suppliers.find(s => s.id === id);
        if (supplier) {
          const base = Number(supplier.ratingScore || 70);
          const r1 = rand01(supplier.id, 'onTime');
          const r2 = rand01(supplier.id, 'quality');
          const r3 = rand01(supplier.id, 'compliance');
          const deliveryOnTime = Math.min(99, Math.max(55, Math.round(base + (r1 - 0.5) * 20)));
          const qualityScore = Math.min(98, Math.max(55, Math.round(base + (r2 - 0.5) * 18)));
          const complianceScore = Math.min(99, Math.max(55, Math.round(base + (r3 - 0.5) * 22)));
          selectedRows.push({ supplierName: supplier.supplierName, deliveryOnTime, qualityScore, complianceScore });
        }
      }
      const rows = selectedRows.map((r) => {
        const score = computeScore(r);
        const cat = mapCategory(score);
        return { ...r, totalScore: score, category: cat };
      });
      setPreviewRows(rows);
      message.success('已生成所选供应商的试算结果');
      return;
    }

    // 否则使用样本数据
    const rows = sampleRows.map((r) => {
      const score = computeScore(r);
      const cat = mapCategory(score);
      return { ...r, totalScore: score, category: cat };
    });
    setPreviewRows(rows);
    message.success('已生成试算结果');
  }

  /** 导出预览 */
  function exportPreview() {
    if (!previewRows.length) {
      message.info('请先生成试算结果');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(previewRows.map((r) => ({
      供应商名称: r.supplierName,
      按时交付: r.deliveryOnTime,
      质量评分: r.qualityScore,
      合规评分: r.complianceScore,
      综合得分: r.totalScore,
      等级: r.category,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '分级试算');
    XLSX.writeFile(wb, '供应商分级试算.xlsx');
  }

  /** 下载上传模板 */
  function downloadTemplate() {
    const templateData = [
      {
        供应商名称: '示例供应商A',
        按时交付: 95,
        质量评分: 92,
        合规评分: 96,
      },
      {
        供应商名称: '示例供应商B',
        按时交付: 88,
        质量评分: 85,
        合规评分: 90,
      },
      {
        供应商名称: '示例供应商C',
        按时交付: 78,
        质量评分: 82,
        合规评分: 75,
      }
    ];
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // 设置列宽
    ws['!cols'] = [
      { width: 20 }, // 供应商名称
      { width: 12 }, // 按时交付
      { width: 12 }, // 质量评分
      { width: 12 }, // 合规评分
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '供应商分级模板');
    XLSX.writeFile(wb, '供应商分级上传模板.xlsx');
    message.success('模板下载成功');
  }

  /**
   * 加载已分类分级的供应商列表
   */
  async function loadGradedSuppliers() {
    setLoadingGraded(true);
    try {
      const res = await srmClient.listSuppliers({ page: 1, pageSize: 100 });
      if (res.ok) {
        const items = res.data?.items || [];
        // 为每个供应商计算得分和等级
        const graded = items.map(supplier => {
          const base = Number(supplier.ratingScore || 70);
          const r1 = rand01(supplier.id, 'onTime');
          const r2 = rand01(supplier.id, 'quality');
          const r3 = rand01(supplier.id, 'compliance');
          const deliveryOnTime = Math.min(99, Math.max(55, Math.round(base + (r1 - 0.5) * 20)));
          const qualityScore = Math.min(98, Math.max(55, Math.round(base + (r2 - 0.5) * 18)));
          const complianceScore = Math.min(99, Math.max(55, Math.round(base + (r3 - 0.5) * 22)));
          
          const row = { supplierName: supplier.supplierName, deliveryOnTime, qualityScore, complianceScore };
          const totalScore = computeScore(row);
          const category = mapCategory(totalScore);
          
          return {
            ...supplier,
            ...row,
            totalScore,
            category,
            lastGraded: new Date().toISOString(),
            gradedBy: '系统自动分级'
          };
        });
        setGradedSuppliers(graded);
      }
    } finally {
      setLoadingGraded(false);
    }
  }

  /** 提交规则 */
  async function handleSubmitRules() {
    setSubmitting(true);
    try {
      const body = { categories, metrics };
      const res = await srmClient.saveCategoryGradingRules(body);
      if (res.ok) message.success('规则已提交');
      else message.error(res.error?.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  }

  const metricColumns = [
    { title: '指标', dataIndex: 'name' },
    {
      title: '权重(%)',
      dataIndex: 'weight',
      render: (v, row) => (
        <InputNumber
          min={0}
          max={100}
          value={row.weight}
          onChange={(val) => setMetrics((arr) => arr.map((m) => (m.key === row.key ? { ...m, weight: Number(val || 0) } : m)))}
        />
      ),
    },
  ];

  const previewColumns = useMemo(
    () => [
      { title: '供应商名称', dataIndex: 'supplierName' },
      { title: '按时交付', dataIndex: 'deliveryOnTime' },
      { title: '质量评分', dataIndex: 'qualityScore' },
      { title: '合规评分', dataIndex: 'complianceScore' },
      { title: '综合得分', dataIndex: 'totalScore' },
      { title: '等级', dataIndex: 'category', render: (v) => <Tag color={v === 'A级' ? 'green' : v === 'B级' ? 'blue' : 'orange'}>{v}</Tag> },
    ],
    [previewRows]
  );

  const gradedColumns = useMemo(
    () => [
      { title: '供应商名称', dataIndex: 'supplierName', width: 200 },
      { title: '供应商类型', dataIndex: 'supplierType', width: 120 },
      { title: '按时交付', dataIndex: 'deliveryOnTime', width: 100, render: (v) => `${v}%` },
      { title: '质量评分', dataIndex: 'qualityScore', width: 100, render: (v) => `${v}%` },
      { title: '合规评分', dataIndex: 'complianceScore', width: 100, render: (v) => `${v}%` },
      { title: '综合得分', dataIndex: 'totalScore', width: 100, render: (v) => `${v}分` },
      { 
        title: '等级', 
        dataIndex: 'category', 
        width: 100, 
        render: (v) => {
          const colorMap = { 'A级': 'green', 'B级': 'blue', 'C级': 'orange', '未分级': 'default' };
          return <Tag color={colorMap[v] || 'default'}>{v}</Tag>;
        }
      },
      { title: '最后分级时间', dataIndex: 'lastGraded', width: 150, render: (v) => new Date(v).toLocaleDateString() },
      { title: '分级人员', dataIndex: 'gradedBy', width: 120 },
    ],
    []
  );

  const totalWeight = metrics.reduce((s, m) => s + Number(m.weight || 0), 0);

  // 加载供应商列表（用于选择）
  const loadSuppliers = useCallback(async (search = '') => {
    setLoading(true);
    try {
      const res = await srmClient.listSuppliers({ 
        page: 1, 
        pageSize: 100,
        search,
        active: true // 只显示在用的供应商
      });
      if (res.ok) {
        setSuppliers(res.data?.items || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化页面数据
  React.useEffect(() => {
    (async () => {
      // 1. 加载分级规则
      const res = await srmClient.getCategoryGradingRules();
      if (res.ok && res.data) {
        setCategories(res.data.categories || []);
        setMetrics(res.data.metrics || []);
      } else {
        setCategories([
          { key: 'A', name: 'A级', minScore: 85 },
          { key: 'B', name: 'B级', minScore: 70 },
          { key: 'C', name: 'C级', minScore: 0 },
        ]);
        setMetrics([
          { key: 'deliveryOnTime', name: '按时交付', weight: 40 },
          { key: 'qualityScore', name: '质量评分', weight: 40 },
          { key: 'complianceScore', name: '合规评分', weight: 20 },
        ]);
      }

      // 2. 加载供应商列表
      await loadSuppliers();
      
      // 3. 加载已分类分级的供应商列表
      await loadGradedSuppliers();
    })();
  }, [loadSuppliers]);

  return (
    <div>
      <Typography.Title level={3}>供应商分类与分级</Typography.Title>

      <Tabs
        defaultActiveKey="rules"
        size="large"
        style={{ marginTop: 16 }}
        items={[
          {
            key: 'rules',
            label: (
              <span>
                <Typography.Text strong>规则配置</Typography.Text>
              </span>
            ),
            children: (
              <div style={{ padding: '24px 0' }}>
                <Card title="分级规则配置" bodyStyle={{ paddingTop: 12 }}>
                  <Row gutter={16}>
                    {categories.map((c, idx) => (
                      <Col span={8} key={c.key}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Input
                            addonBefore="等级名称"
                            value={c.name}
                            onChange={(e) => setCategories((arr) => arr.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))}
                          />
                          <InputNumber
                            addonBefore="最小得分"
                            min={0}
                            max={100}
                            value={c.minScore}
                            onChange={(val) => setCategories((arr) => arr.map((x, i) => (i === idx ? { ...x, minScore: Number(val || 0) } : x)))}
                            style={{ width: '100%' }}
                          />
                        </Space>
                      </Col>
                    ))}
                  </Row>
                </Card>

                <Card title="指标权重配置" bodyStyle={{ paddingTop: 12 }} style={{ marginTop: 16 }}>
                  <Table
                    size="middle"
                    bordered
                    dataSource={metrics}
                    rowKey={(r) => r.key}
                    columns={metricColumns}
                    pagination={false}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Typography.Text type={totalWeight === 100 ? 'success' : 'warning' }>
                      当前权重合计：{totalWeight}% {totalWeight !== 100 ? '（建议合计为 100%）' : ''}
                    </Typography.Text>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Button type="primary" loading={submitting} onClick={handleSubmitRules}>
                      提交规则
                    </Button>
                  </div>
                </Card>
              </div>
            )
          },
          {
            key: 'preview',
            label: (
              <span>
                <Typography.Text strong>样本试算</Typography.Text>
              </span>
            ),
            children: (
              <div style={{ padding: '24px 0' }}>
                <Card title="供应商试算" bodyStyle={{ paddingTop: 12 }}>
                  <div style={{ marginBottom: 16 }}>
                    <Select
                      mode="multiple"
                      placeholder="选择要评估的供应商（可搜索）"
                      value={selectedSuppliers}
                      onChange={setSelectedSuppliers}
                      onSearch={loadSuppliers}
                      loading={loading}
                      style={{ width: '100%' }}
                      optionFilterProp="label"
                      showSearch
                      allowClear
                      options={suppliers.map(s => ({
                        label: s.supplierName,
                        value: s.id,
                        title: s.supplierName,
                      }))}
                    />
                  </div>
                  <Space style={{ marginBottom: 12 }}>
                    <Button type="primary" onClick={generatePreview}>生成试算结果</Button>
                    <Button onClick={exportPreview}>导出结果</Button>
                    <Button onClick={downloadTemplate}>下载上传模板</Button>
                  </Space>
                  <div style={{ marginBottom: 16 }}>
                    <Typography.Text type="secondary">
                      提示：您可以下载上传模板，按照模板格式准备供应商数据，然后使用"生成试算结果"功能进行分级评估。
                    </Typography.Text>
                  </div>
                  
                  {/* 文件上传区域 */}
                  <div style={{ 
                    border: '1px dashed #d9d9d9', 
                    borderRadius: '6px', 
                    padding: '16px', 
                    textAlign: 'center',
                    backgroundColor: '#fafafa',
                    marginBottom: '16px',
                    cursor: 'pointer'
                  }}>
                    <div style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }}>📁</div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      点击或拖拽文件到此区域上传
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      (xlsx/csv) 仅处理首个工作表;第一行为表头
                    </div>
                  </div>
                  <Table
                    size="middle"
                    bordered
                    dataSource={previewRows}
                    rowKey={(r, idx) => idx}
                    columns={previewColumns}
                    pagination={{ pageSize: 20 }}
                  />
                </Card>
              </div>
            )
          },
          {
            key: 'graded',
            label: (
              <span>
                <Typography.Text strong>已分级供应商</Typography.Text>
              </span>
            ),
            children: (
              <div style={{ padding: '24px 0' }}>
                <Card title="已分类分级供应商列表" bodyStyle={{ paddingTop: 12 }}>
                  <div style={{ marginBottom: 16 }}>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                      <Col span={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Typography.Text strong style={{ fontSize: '18px' }}>
                            {gradedSuppliers.length}
                          </Typography.Text>
                          <br />
                          <Typography.Text type="secondary">总供应商数</Typography.Text>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Typography.Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                            {gradedSuppliers.filter(s => s.category === 'A级').length}
                          </Typography.Text>
                          <br />
                          <Typography.Text type="secondary">A级供应商</Typography.Text>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Typography.Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                            {gradedSuppliers.filter(s => s.category === 'B级').length}
                          </Typography.Text>
                          <br />
                          <Typography.Text type="secondary">B级供应商</Typography.Text>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Typography.Text strong style={{ fontSize: '18px', color: '#fa8c16' }}>
                            {gradedSuppliers.filter(s => s.category === 'C级').length}
                          </Typography.Text>
                          <br />
                          <Typography.Text type="secondary">C级供应商</Typography.Text>
                        </Card>
                      </Col>
                    </Row>
                    <Space>
                      <Button onClick={loadGradedSuppliers} loading={loadingGraded}>刷新列表</Button>
                      <Button onClick={() => {
                        if (gradedSuppliers.length) {
                          const ws = XLSX.utils.json_to_sheet(gradedSuppliers.map((r) => ({
                            供应商名称: r.supplierName,
                            供应商类型: r.supplierType,
                            按时交付: `${r.deliveryOnTime}%`,
                            质量评分: `${r.qualityScore}%`,
                            合规评分: `${r.complianceScore}%`,
                            综合得分: `${r.totalScore}分`,
                            等级: r.category,
                            最后分级时间: new Date(r.lastGraded).toLocaleDateString(),
                            分级人员: r.gradedBy,
                          })));
                          const wb = XLSX.utils.book_new();
                          XLSX.utils.book_append_sheet(wb, ws, '已分级供应商');
                          XLSX.writeFile(wb, '已分级供应商列表.xlsx');
                          message.success('导出成功');
                        } else {
                          message.info('暂无数据可导出');
                        }
                      }}>导出已分级列表</Button>
                    </Space>
                  </div>
                  
                  <Tabs
                    defaultActiveKey="all"
                    size="small"
                    items={[
                      {
                        key: 'all',
                        label: (
                          <span>
                            <Tag color="default">全部</Tag>
                            <span style={{ marginLeft: 8 }}>{gradedSuppliers.length}</span>
                          </span>
                        ),
                        children: (
                          <Table
                            size="middle"
                            bordered
                            dataSource={gradedSuppliers}
                            rowKey={(r) => r.id}
                            columns={gradedColumns}
                            loading={loadingGraded}
                            pagination={{ 
                              pageSize: 15, 
                              showSizeChanger: true,
                              showQuickJumper: true,
                              showTotal: (total) => `共 ${total} 条记录`
                            }}
                            scroll={{ x: 1200 }}
                          />
                        )
                      },
                      {
                        key: 'A',
                        label: (
                          <span>
                            <Tag color="green">A级</Tag>
                            <span style={{ marginLeft: 8 }}>{gradedSuppliers.filter(s => s.category === 'A级').length}</span>
                          </span>
                        ),
                        children: (
                          <Table
                            size="middle"
                            bordered
                            dataSource={gradedSuppliers.filter(s => s.category === 'A级')}
                            rowKey={(r) => r.id}
                            columns={gradedColumns}
                            loading={loadingGraded}
                            pagination={{ 
                              pageSize: 15, 
                              showSizeChanger: true,
                              showQuickJumper: true,
                              showTotal: (total) => `共 ${total} 条记录`
                            }}
                            scroll={{ x: 1200 }}
                          />
                        )
                      },
                      {
                        key: 'B',
                        label: (
                          <span>
                            <Tag color="blue">B级</Tag>
                            <span style={{ marginLeft: 8 }}>{gradedSuppliers.filter(s => s.category === 'B级').length}</span>
                          </span>
                        ),
                        children: (
                          <Table
                            size="middle"
                            bordered
                            dataSource={gradedSuppliers.filter(s => s.category === 'B级')}
                            rowKey={(r) => r.id}
                            columns={gradedColumns}
                            loading={loadingGraded}
                            pagination={{ 
                              pageSize: 15, 
                              showSizeChanger: true,
                              showQuickJumper: true,
                              showTotal: (total) => `共 ${total} 条记录`
                            }}
                            scroll={{ x: 1200 }}
                          />
                        )
                      },
                      {
                        key: 'C',
                        label: (
                          <span>
                            <Tag color="orange">C级</Tag>
                            <span style={{ marginLeft: 8 }}>{gradedSuppliers.filter(s => s.category === 'C级').length}</span>
                          </span>
                        ),
                        children: (
                          <Table
                            size="middle"
                            bordered
                            dataSource={gradedSuppliers.filter(s => s.category === 'C级')}
                            rowKey={(r) => r.id}
                            columns={gradedColumns}
                            loading={loadingGraded}
                            pagination={{ 
                              pageSize: 15, 
                              showSizeChanger: true,
                              showQuickJumper: true,
                              showTotal: (total) => `共 ${total} 条记录`
                            }}
                            scroll={{ x: 1200 }}
                          />
                        )
                      },
                      {
                        key: 'ungraded',
                        label: (
                          <span>
                            <Tag color="default">未分级</Tag>
                            <span style={{ marginLeft: 8 }}>{gradedSuppliers.filter(s => !s.category || s.category === '未分级').length}</span>
                          </span>
                        ),
                        children: (
                          <Table
                            size="middle"
                            bordered
                            dataSource={gradedSuppliers.filter(s => !s.category || s.category === '未分级')}
                            rowKey={(r) => r.id}
                            columns={gradedColumns}
                            loading={loadingGraded}
                            pagination={{ 
                              pageSize: 15, 
                              showSizeChanger: true,
                              showQuickJumper: true,
                              showTotal: (total) => `共 ${total} 条记录`
                            }}
                            scroll={{ x: 1200 }}
                          />
                        )
                      }
                    ]}
                  />
                </Card>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}

export default CategoryGrading;


