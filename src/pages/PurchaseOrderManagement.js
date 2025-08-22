import React, { useMemo, useState, useCallback } from 'react';
import { Typography, Card, Table, Space, Button, Modal, Form, Input, DatePicker, InputNumber, Select, message, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, SendOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { srmClient } from '../services/srmClient';

/**
 * 采购订单管理页面
 * @component PurchaseOrderManagement
 * @description 涵盖订单创建、审批、跟踪、收货与对账的全流程管理。
 */
function PurchaseOrderManagement() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState([]); // 供应商列表
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);

  const statusMap = {
    draft: { color: 'default', text: '草稿' },
    submitted: { color: 'blue', text: '已提交' },
    received: { color: 'green', text: '已收货' },
    reconciled: { color: 'purple', text: '已对账' },
  };

  // 根据当前状态判断下一步可用的操作
  const availableActions = {
    draft: ['submit'],
    submitted: ['receive'],
    received: ['reconcile'],
    reconciled: [],
  };

  /** 新增 */
  function openAdd() {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      poDate: dayjs(),
      currency: 'CNY',
      items: [{ lineNo: 1, sku: '', name: '', qty: 1, price: 0 }],
    });
    setModalOpen(true);
  }

  /** 编辑/查看 */
  async function openEdit(row) {
    setEditing(row);
    try {
      // 获取订单详情（包括明细行）
      const res = await srmClient.getPurchaseOrder(row.poNo);
      if (res.ok) {
        const orderData = res.data;
        form.setFieldsValue({
          ...orderData,
          poDate: orderData.poDate ? dayjs(orderData.poDate) : null,
          items: orderData.items || [],
        });
      } else {
        message.error('获取订单详情失败');
      }
    } catch (err) {
      console.error('获取订单详情失败:', err);
      message.error('获取订单详情失败');
    }
    setModalOpen(true);
  }

  /** 删除 */
  async function removeRow(poNo) {
    await srmClient.deletePurchaseOrder(poNo);
    const res = await srmClient.listPurchaseOrders();
    if (res.ok) setRows(res.data.items || []);
    message.success('已删除');
  }

  /** 金额合计 */
  function computeAmount(items) {
    const list = Array.isArray(items) ? items : [];
    const sum = list.reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0);
    return Math.round(sum * 100) / 100;
  }

  /** 保存 */
  async function handleSave() {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        poNo: editing?.poNo || `PO${Date.now()}`,
        poDate: values.poDate ? values.poDate.valueOf() : null,
        amount: computeAmount(values.items),
        status: editing?.status || 'draft',
      };
      const exists = rows.some((r) => r.poNo === payload.poNo);
      if (exists) await srmClient.updatePurchaseOrder(payload);
      else await srmClient.createPurchaseOrder(payload);
      const res = await srmClient.listPurchaseOrders();
      if (res.ok) setRows(res.data.items || []);
      setModalOpen(false);
      message.success(editing ? '已更新订单' : '已创建订单');
    } catch (_) {
      // ignore
    }
  }

  /** 导出 */
  function exportExcel() {
    if (!rows.length) {
      message.info('无可导出的数据');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(rows.map((r) => ({
      订单号: r.poNo,
      供应商: r.supplierName,
      下单日期: r.poDate ? dayjs(r.poDate).format('YYYY-MM-DD') : '',
      币种: r.currency,
      金额: r.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      状态: statusMap[r.status]?.text || r.status,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '采购订单');
    XLSX.writeFile(wb, '采购订单.xlsx');
  }

  /** 状态流转 */
  async function flow(poNo, action) {
    setSubmitting(true);
    try {
      const res = await srmClient.transitionPurchaseOrder({ poNo, action });
      if (!res.ok) {
        message.error(res.error?.message || '操作失败');
        return;
      }
      const res2 = await srmClient.listPurchaseOrders();
      if (res2.ok) setRows(res2.data.items || []);
      message.success('操作成功');
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { title: '订单号', dataIndex: 'poNo', width: 200 },
    { title: '供应商', dataIndex: 'supplierName', width: 200 },
    { title: '下单日期', dataIndex: 'poDate', width: 140, render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : '-') },
    { title: '币种', dataIndex: 'currency', width: 100 },
    { 
      title: '金额', 
      dataIndex: 'amount', 
      width: 120,
      render: (v) => v?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      sorter: (a, b) => a.amount - b.amount,
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 120, 
      render: (v) => <Tag color={statusMap[v]?.color || 'default'}>{statusMap[v]?.text || v}</Tag>,
      filters: Object.entries(statusMap).map(([key, { text }]) => ({ text, value: key })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 280,
      render: (_, row) => {
        const actions = availableActions[row.status] || [];
        return (
          <Space>
            {row.status === 'draft' && (
              <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(row)}>编辑</Button>
            )}
            {actions.includes('submit') && (
              <Button size="small" type="primary" onClick={() => flow(row.poNo, 'submit')} loading={submitting} icon={<SendOutlined />}>
                提交审批
              </Button>
            )}
            {actions.includes('receive') && (
              <Button size="small" type="primary" onClick={() => flow(row.poNo, 'receive')} loading={submitting} icon={<CheckCircleOutlined />}>
                收货
              </Button>
            )}
            {actions.includes('reconcile') && (
              <Button size="small" type="primary" onClick={() => flow(row.poNo, 'reconcile')} loading={submitting} icon={<DollarOutlined />}>
                对账
              </Button>
            )}
            {row.status === 'draft' && (
              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeRow(row.poNo)}>删除</Button>
            )}
            {row.status !== 'draft' && (
              <Typography.Link type="secondary" onClick={() => openEdit(row)}>查看</Typography.Link>
            )}
          </Space>
        );
      },
    },
  ];

  // 加载供应商列表
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

  // 刷新订单列表
  const refreshOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await srmClient.listPurchaseOrders();
      if (res.ok) setRows(res.data.items || []);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化数据
  React.useEffect(() => {
    loadSuppliers();
    refreshOrders();
  }, [loadSuppliers, refreshOrders]);

  return (
    <div>
      <Typography.Title level={3}>采购订单管理</Typography.Title>
      <Card bodyStyle={{ paddingTop: 12 }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input.Search
              placeholder="搜索订单号/供应商"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Select
              mode="multiple"
              placeholder="按状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              allowClear
              options={Object.entries(statusMap).map(([key, { text }]) => ({
                label: text,
                value: key
              }))}
            />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>新建订单</Button>
              <Button icon={<ExportOutlined />} onClick={exportExcel}>导出Excel</Button>
            </Space>
          </Col>
        </Row>
        <Table
          size="middle"
          bordered
          rowKey={(r) => r.poNo}
          columns={columns}
          dataSource={rows.filter(row => {
            const matchSearch = !searchText || 
              row.poNo.toLowerCase().includes(searchText.toLowerCase()) ||
              row.supplierName.toLowerCase().includes(searchText.toLowerCase());
            const matchStatus = !statusFilter.length || statusFilter.includes(row.status);
            return matchSearch && matchStatus;
          })}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editing ? '编辑订单' : '新建订单'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="保存"
        width={800}
      >
        <Form layout="vertical" form={form} initialValues={{ currency: 'CNY', items: [] }}>
          <Form.Item label="供应商" name="supplierName" rules={[{ required: true, message: '请选择供应商' }]}>
            <Select
              showSearch
              placeholder="选择供应商（可搜索）"
              optionFilterProp="label"
              loading={loading}
              disabled={editing?.status !== 'draft'}
              options={suppliers.map(s => ({
                label: s.supplierName,
                value: s.supplierName,
                title: s.supplierName,
              }))}
              onSearch={loadSuppliers}
            />
          </Form.Item>
          <Space size="middle" style={{ width: '100%' }}>
            <Form.Item style={{ flex: 1 }} label="订单日期" name="poDate" rules={[{ required: true, message: '请选择订单日期' }]}>
              <DatePicker 
                style={{ width: '100%' }} 
                disabled={editing?.status !== 'draft'}
              />
            </Form.Item>
            <Form.Item style={{ width: 160 }} label="币种" name="currency">
              <Select 
                options={[{ label: '人民币 CNY', value: 'CNY' }, { label: '美元 USD', value: 'USD' }]} 
                disabled={editing?.status !== 'draft'}
              />
            </Form.Item>
          </Space>

          <Typography.Title level={5} style={{ marginTop: 8 }}>订单明细</Typography.Title>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                <Table
                  dataSource={fields}
                  pagination={false}
                  rowKey={(f) => f.key}
                  columns={[
                    { title: '行号', dataIndex: 'lineNo', width: 80, render: (_, __, i) => i + 1 },
                    {
                      title: 'SKU',
                      width: 150,
                      render: (_, field) => (
                        <Form.Item 
                          name={[field.name, 'sku']} 
                          rules={[{ required: true, message: '请输入SKU' }]}
                          style={{ margin: 0 }}
                        >
                          <Input disabled={editing?.status !== 'draft'} />
                        </Form.Item>
                      ),
                    },
                    {
                      title: '名称',
                      width: 200,
                      render: (_, field) => (
                        <Form.Item 
                          name={[field.name, 'name']} 
                          rules={[{ required: true, message: '请输入名称' }]}
                          style={{ margin: 0 }}
                        >
                          <Input disabled={editing?.status !== 'draft'} />
                        </Form.Item>
                      ),
                    },
                    {
                      title: '数量',
                      width: 120,
                      render: (_, field) => (
                        <Form.Item 
                          name={[field.name, 'qty']} 
                          rules={[{ required: true, message: '请输入数量' }]}
                          style={{ margin: 0 }}
                        >
                          <InputNumber 
                            min={1} 
                            disabled={editing?.status !== 'draft'}
                            formatter={value => value?.toLocaleString()}
                            parser={value => value?.replace(/,/g, '')}
                          />
                        </Form.Item>
                      ),
                    },
                    {
                      title: '单价',
                      width: 120,
                      render: (_, field) => (
                        <Form.Item 
                          name={[field.name, 'price']} 
                          rules={[{ required: true, message: '请输入单价' }]}
                          style={{ margin: 0 }}
                        >
                          <InputNumber 
                            min={0} 
                            disabled={editing?.status !== 'draft'}
                            formatter={value => value?.toLocaleString()}
                            parser={value => value?.replace(/,/g, '')}
                          />
                        </Form.Item>
                      ),
                    },
                    {
                      title: '金额',
                      width: 120,
                      render: (_, field) => {
                        const vals = form.getFieldValue(['items', field.name]);
                        const amount = Number(vals?.qty || 0) * Number(vals?.price || 0);
                        return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                      },
                    },
                    {
                      title: '操作',
                      width: 80,
                      render: (_, field) => editing?.status === 'draft' && (
                        <Button danger size="small" onClick={() => remove(field.name)}>删除</Button>
                      ),
                    },
                  ]}
                  scroll={{ x: 'max-content' }}
                />
                {editing?.status === 'draft' && (
                  <Button type="dashed" style={{ marginTop: 8 }} onClick={() => add({ qty: 1, price: 0 })}>
                    添加明细行
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}

export default PurchaseOrderManagement;


