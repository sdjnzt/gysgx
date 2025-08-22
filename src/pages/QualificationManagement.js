import React, { useMemo, useState } from 'react';
import { Typography, Card, Table, Button, Space, Modal, Form, Input, DatePicker, Upload, Tag, Select, Popconfirm, message, Segmented } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, ExportOutlined, SendOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { srmClient } from '../services/srmClient';

/**
 * 资质认证管理页面
 * @component QualificationManagement
 * @description 管理供应商各类证照的录入、到期提醒、年审与变更记录。
 */
function QualificationManagement() {
  const [records, setRecords] = useState([]);
  const [supplierId, setSupplierId] = useState('DEFAULT');
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  /**
   * 资质类型枚举
   */
  const typeOptions = useMemo(
    () => [
      { label: '营业执照', value: '营业执照' },
      { label: '药品经营许可证', value: '药品经营许可证' },
      { label: '医疗器械经营许可证', value: '医疗器械经营许可证' },
      { label: 'GSP 认证', value: 'GSP认证' },
      { label: '开户许可证', value: '开户许可证' },
      { label: '一般纳税人资格', value: '一般纳税人资格' },
    ],
    []
  );

  /**
   * 计算到期状态
   * @param {dayjs.Dayjs | number | string} expiry
   * @returns {{ status: 'valid'|'expiring'|'expired', daysLeft: number }}
   */
  function calcExpiryStatus(expiry) {
    const exp = dayjs(expiry);
    const today = dayjs();
    const days = exp.startOf('day').diff(today.startOf('day'), 'day');
    if (days < 0) return { status: 'expired', daysLeft: days };
    if (days <= 30) return { status: 'expiring', daysLeft: days };
    return { status: 'valid', daysLeft: days };
  }

  /**
   * 打开新增对话框
   */
  function openAddModal() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  /**
   * 打开编辑对话框
   * @param {object} row
   */
  function openEditModal(row) {
    setEditing(row);
    form.setFieldsValue({
      ...row,
      issueDate: row.issueDate ? dayjs(row.issueDate) : null,
      expiryDate: row.expiryDate ? dayjs(row.expiryDate) : null,
    });
    setModalOpen(true);
  }

  /**
   * 删除记录
   * @param {string} id
   */
  function deleteRecord(id) {
    setRecords((arr) => arr.filter((r) => r.id !== id));
    message.success('已删除');
  }

  /**
   * 保存（新增/编辑）
   */
  async function handleSave() {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        id: editing?.id || `Q-${Date.now()}`,
        issueDate: values.issueDate ? values.issueDate.valueOf() : null,
        expiryDate: values.expiryDate ? values.expiryDate.valueOf() : null,
      };
      setRecords((arr) => {
        const exists = arr.some((r) => r.id === payload.id);
        return exists ? arr.map((r) => (r.id === payload.id ? { ...r, ...payload } : r)) : [payload, ...arr];
      });
      setModalOpen(false);
      message.success(editing ? '已更新' : '已新增');
    } catch (_) {
      // ignore
    }
  }

  /**
   * 当前过滤后的数据
   */
  const filtered = useMemo(() => {
    if (filterStatus === 'all') return records;
    return records.filter((r) => calcExpiryStatus(r.expiryDate).status === filterStatus);
  }, [records, filterStatus]);

  /**
   * 导出 Excel
   */
  function exportExcel() {
    if (!filtered.length) {
      message.info('无可导出的数据');
      return;
    }
    const rows = filtered.map((r) => {
      const { status, daysLeft } = calcExpiryStatus(r.expiryDate);
      return {
        资质类型: r.type,
        证照编号: r.number,
        发证日期: r.issueDate ? dayjs(r.issueDate).format('YYYY-MM-DD') : '',
        到期日期: r.expiryDate ? dayjs(r.expiryDate).format('YYYY-MM-DD') : '',
        发证机关: r.issuer || '',
        状态: status === 'valid' ? '有效' : status === 'expiring' ? '即将到期' : '已过期',
        剩余天数: daysLeft,
        附件数量: Array.isArray(r.attachments) ? r.attachments.length : 0,
        备注: r.remark || '',
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '资质台账');
    XLSX.writeFile(wb, '资质台账.xlsx');
  }

  /**
   * 提交到后端
   */
  async function handleSubmitAll() {
    if (!records.length) {
      message.info('请先新增资质记录');
      return;
    }
    setSubmitting(true);
    try {
      const items = records.map((r) => ({
        ...r,
        attachments: (r.attachments || []).map((f) => ({ name: f.name, uid: f.uid })),
      }));
      const res = await srmClient.manageQualifications({ supplierId: 'TEMP', items });
      if (res.ok) message.success('提交成功');
      else message.error(res.error?.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { title: '资质类型', dataIndex: 'type', width: 180 },
    { title: '证照编号', dataIndex: 'number', width: 200 },
    { title: '发证日期', dataIndex: 'issueDate', width: 140, render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : '-') },
    { title: '到期日期', dataIndex: 'expiryDate', width: 140, render: (v) => (v ? dayjs(v).format('YYYY-MM-DD') : '-') },
    {
      title: '状态',
      width: 140,
      render: (_, row) => {
        const { status, daysLeft } = calcExpiryStatus(row.expiryDate);
        const map = {
          valid: { color: 'green', text: '有效' },
          expiring: { color: 'orange', text: `即将到期(${daysLeft}天)` },
          expired: { color: 'red', text: `已过期(${Math.abs(daysLeft)}天)` },
        };
        const s = map[status];
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    { title: '发证机关', dataIndex: 'issuer', width: 200 },
    {
      title: '附件',
      dataIndex: 'attachments',
      width: 200,
      render: (files) => (Array.isArray(files) && files.length ? files.map((f) => <Tag key={f.uid}>{f.name}</Tag>) : <span>-</span>),
    },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '操作',
      fixed: 'right',
      width: 140,
      render: (_, row) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(row)}>编辑</Button>
          <Popconfirm title="确认删除该记录？" onConfirm={() => deleteRecord(row.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    beforeUpload: () => false,
    onRemove: (file) => {
      const list = form.getFieldValue('attachments') || [];
      form.setFieldsValue({ attachments: list.filter((f) => f.uid !== file.uid) });
    },
    onChange: ({ file, fileList }) => {
      form.setFieldsValue({ attachments: fileList });
    },
  };

  React.useEffect(() => {
    (async () => {
      const opts = await srmClient.listSupplierOptions();
      if (opts.ok) setSupplierOptions([{ label: '（默认）', value: 'DEFAULT' }, ...opts.data]);
      const res = await srmClient.getQualifications(supplierId);
      if (res.ok && res.data?.items) setRecords(res.data.items);
    })();
  }, [supplierId]);

  async function addMoreData() {
    const sid = supplierId || 'DEFAULT';
    const res = await srmClient.generateQualifications(sid, 80);
    if (res.ok) {
      const latest = await srmClient.getQualifications(sid);
      if (latest.ok) setRecords(latest.data.items || []);
      message.success(`已追加 ${res.data.added} 条资质数据`);
    }
  }

  return (
    <div>
      <Typography.Title level={3}>资质认证管理</Typography.Title>
      <Card bodyStyle={{ paddingTop: 12 }}>
        <Space style={{ marginBottom: 12 }} wrap>
          <Select
            showSearch
            style={{ minWidth: 260 }}
            placeholder="选择供应商"
            options={supplierOptions}
            value={supplierId}
            onChange={setSupplierId}
            optionFilterProp="label"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>新增资质</Button>
          <Button icon={<ExportOutlined />} onClick={exportExcel}>导出Excel</Button>
          <Button icon={<SendOutlined />} loading={submitting} onClick={handleSubmitAll}>提交</Button>
          {/*<Button onClick={addMoreData}>追加80条示例数据</Button>*/}
          <Segmented
            options={[
              { label: '全部', value: 'all' },
              { label: '有效', value: 'valid' },
              { label: '即将到期', value: 'expiring' },
              { label: '已过期', value: 'expired' },
            ]}
            value={filterStatus}
            onChange={setFilterStatus}
          />
        </Space>

        <Table
          size="middle"
          bordered
          rowKey={(r) => r.id}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editing ? '编辑资质' : '新增资质'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="保存"
      >
        <Form layout="vertical" form={form} initialValues={{ type: '营业执照', attachments: [] }}>
          <Form.Item label="资质类型" name="type" rules={[{ required: true, message: '请选择资质类型' }]}>
            <Select options={typeOptions} />
          </Form.Item>
          <Form.Item label="证照编号" name="number" rules={[{ required: true, message: '请输入证照编号' }]}>
            <Input allowClear />
          </Form.Item>
          <Space size="middle" style={{ width: '100%' }}>
            <Form.Item style={{ flex: 1 }} label="发证日期" name="issueDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item style={{ flex: 1 }} label="到期日期" name="expiryDate" rules={[{ required: true, message: '请选择到期日期' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Form.Item label="发证机关" name="issuer">
            <Input allowClear />
          </Form.Item>
          <Form.Item label="附件" name="attachments" valuePropName="fileList" getValueFromEvent={() => form.getFieldValue('attachments')}>
            <Upload {...uploadProps} listType="text">
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default QualificationManagement;


