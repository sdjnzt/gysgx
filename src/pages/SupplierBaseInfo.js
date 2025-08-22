import React, { useEffect, useMemo, useState } from 'react';
import { Typography, Card, Table, Button, Space, Modal, Form, Input, Select, DatePicker, Switch, InputNumber, Tag, Popconfirm, message, Tooltip, Drawer, Descriptions } from 'antd';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { srmClient } from '../services/srmClient';

/**
 * 供应商基本信息录入页面
 * @component SupplierBaseInfo
 * @description 提供供应商主体、联系人、银行与发票信息的录入与预览。
 */
function SupplierBaseInfo() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [filterType, setFilterType] = useState();
  const [filterActive, setFilterActive] = useState();
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  /**
   * 加载供应商列表
   */
  async function loadList(params = {}) {
    setLoading(true);
    try {
      const res = await srmClient.listSuppliers({ keyword, page, pageSize, type: filterType, active: filterActive, ...params });
      if (res.ok) {
        setData(res.data.items || []);
        setTotal(res.data.total || 0);
        setPage(res.data.page || 1);
        setPageSize(res.data.pageSize || 10);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, keyword]);

  const stats = useMemo(() => {
    const totalCount = total;
    const activeCount = data.filter((d) => d.isActive).length;
    const typeCountMap = data.reduce((acc, cur) => {
      acc[cur.supplierType] = (acc[cur.supplierType] || 0) + 1;
      return acc;
    }, {});
    return { totalCount, activeCount, typeCountMap };
  }, [data, total]);

  /** 打开新增 */
  function openAdd() {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ supplierType: '经销商', isActive: true, taxRate: 13, invoiceType: '专用发票' });
    setModalOpen(true);
  }

  /** 打开编辑 */
  function openEdit(row) {
    setEditing(row);
    form.setFieldsValue({
      ...row,
      establishedDate: row.establishedDate ? dayjs(row.establishedDate) : null,
    });
    setModalOpen(true);
  }

  /** 删除 */
  async function removeRow(id) {
    await srmClient.deleteSupplier(id);
    message.success('已删除');
    loadList();
  }

  /**
   * 脱敏手机号显示
   * @param {string} phone
   * @returns {string}
   */
  function maskPhone(phone) {
    const s = String(phone || '');
    if (/^1[3-9]\d{9}$/.test(s)) return `${s.slice(0,3)}****${s.slice(-4)}`;
    return s.replace(/(\d{3})\d{3,4}(\d{4})/, '$1****$2');
  }

  /** 保存 */
  async function handleSave() {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        id: editing?.id,
        establishedDate: values.establishedDate ? values.establishedDate.valueOf() : null,
      };
      await srmClient.upsertSupplier(payload);
      setModalOpen(false);
      message.success(editing ? '已更新供应商' : '已新增供应商');
      loadList();
    } catch (_) {
      // ignore
    }
  }

  /** 导出 */
  function exportExcel() {
    if (!data.length) {
      message.info('无可导出的数据');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      data.map((r) => ({
        供应商名称: r.supplierName,
        统一社会信用代码: r.socialCreditCode,
        类型: r.supplierType,
        联系人: r.contactName,
        手机: maskPhone(r.contactPhone),
        启用: r.isActive ? '是' : '否',
        省份: r.province || '',
        城市: r.city || '',
        评分: r.ratingScore ?? '',
        成立日期: r.establishedDate ? dayjs(r.establishedDate).format('YYYY-MM-DD') : '',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '供应商台账');
    XLSX.writeFile(wb, '供应商台账.xlsx');
  }

  const columns = [
    { title: '供应商名称', dataIndex: 'supplierName', width: 220, sorter: (a,b) => String(a.supplierName||'').localeCompare(String(b.supplierName||'')) },
    { title: '统一社会信用代码', dataIndex: 'socialCreditCode', width: 200 },
    { title: '类型', dataIndex: 'supplierType', width: 120, render: (v) => <Tag>{v}</Tag> },
    { title: '联系人', dataIndex: 'contactName', width: 120 },
    { title: '手机', dataIndex: 'contactPhone', width: 140, render: (v) => maskPhone(v) },
    { title: '省份', dataIndex: 'province', width: 120 },
    { title: '城市', dataIndex: 'city', width: 120 },
    {
      title: '启用',
      dataIndex: 'isActive',
      width: 100,
      render: (v) => <Tag color={v ? 'green' : 'default'}>{v ? '是' : '否'}</Tag>,
      sorter: (a,b) => Number(a.isActive) - Number(b.isActive),
    },
    { title: '评分', dataIndex: 'ratingScore', width: 100, render: (v) => <Tag color={v>=85?'green':v>=70?'blue':'orange'}>{v??'-'}</Tag>, sorter: (a,b) => Number(a.ratingScore||0) - Number(b.ratingScore||0) },
    { title: '成立日期', dataIndex: 'establishedDate', width: 140, render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : '-'), sorter: (a,b) => Number(a.establishedDate||0) - Number(b.establishedDate||0) },
    {
      title: '操作',
      fixed: 'right',
      width: 180,
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => { setDetailRow(row); setDetailOpen(true); }}>详情</Button>
          <Button size="small" onClick={() => openEdit(row)}>编辑</Button>
          <Popconfirm title="确认删除该供应商？" onConfirm={() => removeRow(row.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>供应商台账（基本信息）</Typography.Title>
      <Card bodyStyle={{ paddingTop: 12 }}>
        <Space style={{ width: '100%', marginBottom: 12 }} wrap>
          <Card size="small">
            <Space>
              <Typography.Text>供应商总数</Typography.Text>
              <Tag color="blue">{stats.totalCount}</Tag>
            </Space>
          </Card>
          <Card size="small">
            <Space>
              <Typography.Text>启用</Typography.Text>
              <Tag color="green">{stats.activeCount}</Tag>
            </Space>
          </Card>
          <Card size="small">
            <Space>
              <Typography.Text>类型分布</Typography.Text>
              {Object.keys(stats.typeCountMap).map((k) => (
                <Tag key={k}>{k}:{stats.typeCountMap[k]}</Tag>
              ))}
            </Space>
          </Card>
        </Space>
        <Space style={{ marginBottom: 12 }} wrap>
          <Input.Search allowClear placeholder="名称/信用代码/联系人/手机" onChange={(e)=>setKeyword(e.target.value)} onSearch={(v) => setKeyword(v)} style={{ width: 300 }} />
          <Select allowClear placeholder="类型" style={{ width: 140 }} value={filterType} onChange={setFilterType} options={[{label:'生产厂家',value:'生产厂家'},{label:'经销商',value:'经销商'},{label:'服务商',value:'服务商'}]} />
          <Select allowClear placeholder="启用状态" style={{ width: 140 }} value={filterActive} onChange={setFilterActive} options={[{label:'启用',value:true},{label:'停用',value:false}]} />
          <Button type="primary" onClick={openAdd}>新增供应商</Button>
          <Button onClick={() => { setKeyword(''); setFilterType(undefined); setFilterActive(undefined); setPage(1); }}>重置筛选</Button>
          <Button onClick={exportExcel}>导出Excel</Button>
        </Space>

        <Table
          size="middle"
          bordered
          rowKey={(r) => r.id}
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
            showTotal: (t) => `共 ${t} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editing ? '编辑供应商' : '新增供应商'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="保存"
        width={800}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="供应商名称" name="supplierName" rules={[{ required: true, message: '请输入供应商名称' }]}>
            <Input placeholder="如：枣庄和康医药有限公司" allowClear />
          </Form.Item>
          <Space size="middle" style={{ width: '100%' }}>
            <Form.Item style={{ flex: 1 }} label="统一社会信用代码" name="socialCreditCode" rules={[{ required: true, message: '请输入统一社会信用代码' }, { pattern: /^[0-9A-Z]{18}$/i, message: '18位数字或大写字母' }]}>
              <Input allowClear />
            </Form.Item>
            <Form.Item style={{ width: 220 }} label="供应商类型" name="supplierType">
              <Select options={[{ label: '生产厂家', value: '生产厂家' }, { label: '经销商', value: '经销商' }, { label: '服务商', value: '服务商' }]} />
            </Form.Item>
            <Form.Item style={{ width: 220 }} label="成立日期" name="establishedDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Space size="middle" style={{ width: '100%' }}>
            <Form.Item style={{ flex: 1 }} label="联系人姓名" name="contactName" rules={[{ required: true, message: '请输入联系人姓名' }]}>
              <Input allowClear />
            </Form.Item>
            <Form.Item style={{ flex: 1 }} label="联系人手机" name="contactPhone" rules={[{ required: true, message: '请输入联系人手机' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入合法的手机号' }]}>
              <Input allowClear />
            </Form.Item>
            <Form.Item style={{ flex: 1 }} label="联系人邮箱" name="contactEmail" rules={[{ type: 'email', message: '邮箱格式不正确' }]}>
              <Input allowClear />
            </Form.Item>
          </Space>

          <Form.Item label="注册地址" name="registeredAddress">
            <Input allowClear />
          </Form.Item>

          <Space size="middle" style={{ width: '100%' }}>
            <Form.Item style={{ flex: 1 }} label="开户银行" name="bankName">
              <Input allowClear />
            </Form.Item>
            <Form.Item style={{ flex: 1 }} label="开户支行" name="bankBranch">
              <Input allowClear />
            </Form.Item>
          </Space>

          <Space size="middle" style={{ width: '100%' }}>
            <Form.Item style={{ flex: 1 }} label="账户名称" name="bankAccountName">
              <Input allowClear />
            </Form.Item>
            <Form.Item style={{ flex: 1 }} label="银行账号" name="bankAccountNo" rules={[{ pattern: /^\d{8,30}$/, message: '8-30位数字' }]}>
              <Input allowClear />
            </Form.Item>
          </Space>

          <Space size="middle" style={{ width: '100%' }}>
            <Form.Item style={{ flex: 1 }} label="发票抬头" name="invoiceTitle">
              <Input allowClear />
            </Form.Item>
            <Form.Item style={{ width: 220 }} label="发票类型" name="invoiceType">
              <Select options={[{ label: '增值税专用发票', value: '专用发票' }, { label: '增值税普通发票', value: '普通发票' }]} />
            </Form.Item>
            <Form.Item style={{ width: 220 }} label="税率(%)" name="taxRate" rules={[{ type: 'number', min: 0, max: 13 }]}>
              <InputNumber min={0} max={13} style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Form.Item label="启用状态" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer title="供应商详情" open={detailOpen} onClose={() => setDetailOpen(false)} width={640}>
        {detailRow && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="名称">{detailRow.supplierName}</Descriptions.Item>
            <Descriptions.Item label="信用代码">{detailRow.socialCreditCode}</Descriptions.Item>
            <Descriptions.Item label="类型">{detailRow.supplierType}</Descriptions.Item>
            <Descriptions.Item label="启用"><Tag color={detailRow.isActive?'green':'default'}>{detailRow.isActive?'是':'否'}</Tag></Descriptions.Item>
            <Descriptions.Item label="省份">{detailRow.province||'-'}</Descriptions.Item>
            <Descriptions.Item label="城市">{detailRow.city||'-'}</Descriptions.Item>
            <Descriptions.Item label="联系人">{detailRow.contactName}</Descriptions.Item>
            <Descriptions.Item label="手机">{maskPhone(detailRow.contactPhone)}</Descriptions.Item>
            <Descriptions.Item label="邮箱" span={2}>{detailRow.contactEmail||'-'}</Descriptions.Item>
            <Descriptions.Item label="开户银行">{detailRow.bankName||'-'}</Descriptions.Item>
            <Descriptions.Item label="开户支行">{detailRow.bankBranch||'-'}</Descriptions.Item>
            <Descriptions.Item label="账户名称">{detailRow.bankAccountName||'-'}</Descriptions.Item>
            <Descriptions.Item label="银行账号">{detailRow.bankAccountNo||'-'}</Descriptions.Item>
            <Descriptions.Item label="发票抬头" span={2}>{detailRow.invoiceTitle||'-'}</Descriptions.Item>
            <Descriptions.Item label="评分"><Tag color={detailRow.ratingScore>=85?'green':detailRow.ratingScore>=70?'blue':'orange'}>{detailRow.ratingScore??'-'}</Tag></Descriptions.Item>
            <Descriptions.Item label="成立日期">{detailRow.establishedDate?dayjs(detailRow.establishedDate).format('YYYY-MM-DD'):'-'}</Descriptions.Item>
            <Descriptions.Item label="注册地址" span={2}>{detailRow.registeredAddress||'-'}</Descriptions.Item>
            <Descriptions.Item label="业务范围" span={2}>{detailRow.businessScope||'-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}

export default SupplierBaseInfo;


