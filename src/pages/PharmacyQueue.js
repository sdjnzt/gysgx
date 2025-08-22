import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Row, 
  Col, 
  Select, 
  Tag, 
  Modal, 
  Descriptions, 
  Pagination, 
  Empty, 
  Button, 
  Statistic, 
  Form, 
  Input, 
  message,
  Tabs,
  Timeline,
  List,
  Avatar,
  Badge,
  Alert,
  Divider,
  Tooltip,
  Drawer,
  Steps,
  Result,
  Collapse,
  Rate,
  Image,
  Progress,
  Space,
  Typography
} from 'antd';
import { 
  RedoOutlined, 
  SoundOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined, 
  UserOutlined, 
  MedicineBoxOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  HeartOutlined,
  EyeOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  FastForwardOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const windows = ['1号窗口', '2号窗口', '3号窗口', '4号窗口'];
const pharmacists = [
  { name: '赵药师', dept: '药房', title: '主管药师', avatar: '🧑‍🔬', status: '工作中', patients: 89, rating: 4.8 },
  { name: '钱药师', dept: '药房', title: '药师', avatar: '👩‍🔬', status: '工作中', patients: 76, rating: 4.7 },
  { name: '孙药师', dept: '药房', title: '药师', avatar: '🧑‍⚕️', status: '工作中', patients: 67, rating: 4.6 },
  { name: '李药师', dept: '药房', title: '药师', avatar: '👩‍⚕️', status: '工作中', patients: 82, rating: 4.8 }
];

// 新增药品明细字段
const initialQueue = [
  { id: 1, queueNo: 'P001', name: '陈伟', gender: '男', age: 36, window: '1号窗口', status: '待叫号', pharmacist: '赵药师', medicine: '阿莫西林胶囊x2盒', priority: 'normal', waitTime: 15, contact: '13800138001' },
  { id: 2, queueNo: 'P002', name: '王芳', gender: '女', age: 29, window: '1号窗口', status: '待叫号', pharmacist: '赵药师', medicine: '感冒灵颗粒x1盒', priority: 'high', waitTime: 8, contact: '13800138002' },
  { id: 3, queueNo: 'P003', name: '张敏', gender: '女', age: 61, window: '2号窗口', status: '已叫号', pharmacist: '钱药师', medicine: '头孢克肟片x1盒', priority: 'normal', waitTime: 0, contact: '13800138003' },
  { id: 4, queueNo: 'P004', name: '吴静', gender: '女', age: 56, window: '2号窗口', status: '待叫号', pharmacist: '钱药师', medicine: '维生素C片x2瓶', priority: 'low', waitTime: 22, contact: '13800138004' },
  { id: 5, queueNo: 'P005', name: '马丽', gender: '女', age: 38, window: '3号窗口', status: '待叫号', pharmacist: '孙药师', medicine: '布洛芬缓释胶囊x1盒', priority: 'normal', waitTime: 18, contact: '13800138005' },
  { id: 6, queueNo: 'P006', name: '刘洋', gender: '男', age: 52, window: '3号窗口', status: '待叫号', pharmacist: '孙药师', medicine: '氯雷他定片x1盒', priority: 'high', waitTime: 12, contact: '13800138006' },
  { id: 7, queueNo: 'P007', name: '李娜', gender: '女', age: 41, window: '4号窗口', status: '待叫号', pharmacist: '李药师', medicine: '葡萄糖酸钙口服液x2盒', priority: 'normal', waitTime: 20, contact: '13800138007' },
  { id: 8, queueNo: 'P008', name: '周杰', gender: '男', age: 34, window: '4号窗口', status: '待叫号', pharmacist: '李药师', medicine: '复方甘草片x1瓶', priority: 'low', waitTime: 25, contact: '13800138008' },
  { id: 9, queueNo: 'P009', name: '许静', gender: '女', age: 27, window: '1号窗口', status: '已取药', pharmacist: '赵药师', medicine: '阿莫西林胶囊x2盒', priority: 'normal', waitTime: 0, contact: '13800138009' },
  { id: 10, queueNo: 'P010', name: '宋佳', gender: '女', age: 26, window: '2号窗口', status: '已过号', pharmacist: '钱药师', medicine: '头孢克肟片x1盒', priority: 'normal', waitTime: 0, contact: '13800138010' }
];

// 统计数据
const statistics = {
  totalPatients: 156,
  waitingPatients: 89,
  calledPatients: 45,
  finishedPatients: 22,
  averageWaitTime: 18,
  satisfactionRate: 4.7,
  todayCalls: 67,
  emergencyCalls: 8
};

// 窗口工作量统计
const windowStats = [
  { name: '1号窗口', patients: 45, pharmacist: '赵药师', avgWaitTime: 20, status: '繁忙', color: '#1890ff' },
  { name: '2号窗口', patients: 38, pharmacist: '钱药师', avgWaitTime: 18, status: '正常', color: '#52c41a' },
  { name: '3号窗口', patients: 42, pharmacist: '孙药师', avgWaitTime: 22, status: '繁忙', color: '#faad14' },
  { name: '4号窗口', patients: 31, pharmacist: '李药师', avgWaitTime: 16, status: '正常', color: '#eb2f96' }
];

// 优先级分布
const priorityStats = [
  { priority: '紧急', count: 8, percentage: 9.0, color: '#f5222d' },
  { priority: '高', count: 23, percentage: 25.8, color: '#fa541c' },
  { priority: '中', count: 42, percentage: 47.2, color: '#faad14' },
  { priority: '低', count: 16, percentage: 18.0, color: '#52c41a' }
];

// 最近活动
const recentActivities = [
  { user: '赵药师', action: '叫号患者陈伟', time: '2分钟前', type: 'call' },
  { user: '钱药师', action: '暂停叫号', time: '5分钟前', type: 'pause' },
  { user: '系统', action: '自动叫号提醒', time: '8分钟前', type: 'system' },
  { user: '孙药师', action: '跳过患者马丽', time: '12分钟前', type: 'skip' },
  { user: '李药师', action: '恢复叫号', time: '15分钟前', type: 'resume' },
  { user: '导医台', action: '新增患者登记', time: '18分钟前', type: 'add' }
];

export default function PharmacyQueue() {
  const allWindows = ['全部窗口', ...windows];
  const allPharmacists = ['全部药师', ...pharmacists.map(p => p.name)];
  
  const [selectedWindow, setSelectedWindow] = useState('全部窗口');
  const [selectedPharmacist, setSelectedPharmacist] = useState('全部药师');
  const [queueState, setQueueState] = useState(initialQueue);
  const [detailPatient, setDetailPatient] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [tablePage, setTablePage] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [detailDrawer, setDetailDrawer] = useState(null);
  const tablePageSize = 5;

  // 队列筛选
  const filteredQueue = queueState.filter(q =>
    (selectedWindow === '全部窗口' || q.window === selectedWindow) &&
    (selectedPharmacist === '全部药师' || q.pharmacist === selectedPharmacist)
  );
  
  // 分组
  const groupedQueue = {};
  filteredQueue.forEach(q => {
    if (!groupedQueue[q.window]) groupedQueue[q.window] = {};
    if (!groupedQueue[q.window][q.pharmacist]) groupedQueue[q.window][q.pharmacist] = [];
    groupedQueue[q.window][q.pharmacist].push(q);
  });
  
  // 统计
  const total = filteredQueue.length;
  const waiting = filteredQueue.filter(q => q.status === '待叫号').length;
  const called = filteredQueue.filter(q => q.status === '已叫号').length;
  const finished = filteredQueue.filter(q => q.status === '已取药').length;
  const skipped = filteredQueue.filter(q => q.status === '已过号').length;
  
  // 当前叫号
  const allCurrentCalled = queueState.filter(q => q.status === '已叫号').slice(-5).reverse();

  // 计算每个窗口的最新叫号
  const currentCalledByWindow = windows.map(window => {
    const called = queueState.filter(q => q.window === window && q.status === '已叫号');
    return { window, patient: called.length > 0 ? called[called.length - 1] : null };
  });

  // 操作
  const handleCall = (record) => {
    setQueueState(qs => qs.map(q => q.id === record.id ? { ...q, status: '已叫号' } : q));
    message.success(`已叫号：${record.name} (${record.queueNo})`);
  };
  
  const handleSkip = (record) => {
    setQueueState(qs => qs.map(q => q.id === record.id ? { ...q, status: '已过号' } : q));
    message.success(`已跳过：${record.name} (${record.queueNo})`);
  };
  
  const handleFinish = (record) => {
    setQueueState(qs => qs.map(q => q.id === record.id ? { ...q, status: '已取药' } : q));
    message.success(`已完成：${record.name} (${record.queueNo})`);
  };
  
  const handleDelete = (record) => {
    setQueueState(qs => qs.filter(q => q.id !== record.id));
    message.success(`已删除：${record.name} (${record.queueNo})`);
  };
  
  const handleEdit = (record) => {
    setEditPatient(record);
    setEditModalOpen(true);
  };
  
  const handleExport = () => {
    const data = queueState.map(q => ({
      队列号: q.queueNo, 
      姓名: q.name, 
      性别: q.gender, 
      年龄: q.age, 
      窗口: q.window, 
      主药师: q.pharmacist, 
      状态: q.status
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '药房队列');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '药房队列.xlsx');
  };

  const columns = [
    {
      title: '队列号',
      dataIndex: 'queueNo',
      key: 'queueNo',
      width: 100,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 16 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.priority === 'emergency' && <Tag color="red" size="small">紧急</Tag>}
            {record.priority === 'high' && <Tag color="orange" size="small">高</Tag>}
            {record.priority === 'low' && <Tag color="green" size="small">低</Tag>}
          </div>
        </div>
      )
    },
    {
      title: '患者信息',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.gender} | {record.age}岁
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {record.contact}
          </div>
        </div>
      )
    },
    {
      title: '药品信息',
      dataIndex: 'medicine',
      key: 'medicine',
      width: 180,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            <MedicineBoxOutlined /> 药品明细
          </div>
        </div>
      )
    },
    {
      title: '窗口/药师',
      dataIndex: 'window',
      key: 'window',
      width: 120,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.pharmacist}
          </div>
        </div>
      )
    },
    {
      title: '等待时间',
      dataIndex: 'waitTime',
      key: 'waitTime',
      width: 120,
      render: (text, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: text > 30 ? '#f5222d' : text > 20 ? '#fa8c16' : '#52c41a' }}>
            {text}分钟
          </div>
          <Progress 
            percent={Math.min((text / 30) * 100, 100)} 
            size="small" 
            showInfo={false}
            strokeColor={text > 30 ? '#f5222d' : text > 20 ? '#fa8c16' : '#52c41a'}
          />
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={
          status === '待叫号' ? 'blue' : 
          status === '已叫号' ? 'green' : 
          status === '已取药' ? 'purple' :
          status === '已过号' ? 'red' : 'default'
        }>
          {status}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<SoundOutlined />}
            onClick={() => handleCall(record)}
            disabled={record.status !== '待叫号'}
            style={{ width: '100%' }}
          >
            叫号
          </Button>
          <Button 
            size="small" 
            icon={<FastForwardOutlined />}
            onClick={() => handleSkip(record)}
            disabled={record.status !== '待叫号'}
            style={{ width: '100%' }}
          >
            跳过
          </Button>
          <Button 
            size="small" 
            icon={<CheckCircleOutlined />}
            onClick={() => handleFinish(record)}
            disabled={record.status !== '已叫号'}
            style={{ width: '100%' }}
          >
            完成
          </Button>
        </Space>
      )
    }
  ];

  const tabs = [
    {
      key: 'overview',
      label: (
        <span>
          <BarChartOutlined />
          总览
        </span>
      ),
      children: (
        <div>
          {/* 统计数据 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Statistic 
                  title="总患者数" 
                  value={statistics.totalPatients} 
                  valueStyle={{ color: 'white' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Statistic 
                  title="等待叫号" 
                  value={statistics.waitingPatients} 
                  valueStyle={{ color: 'white' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <Statistic 
                  title="今日叫号" 
                  value={statistics.todayCalls} 
                  valueStyle={{ color: 'white' }}
                  prefix={<SoundOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                <Statistic 
                  title="满意度" 
                  value={statistics.satisfactionRate} 
                  valueStyle={{ color: 'white' }}
                  prefix={<StarOutlined />}
                  suffix="/5"
                />
              </Card>
            </Col>
          </Row>

          {/* 窗口工作量和优先级分布 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <MedicineBoxOutlined style={{ color: '#1890ff' }} />
                    窗口工作量统计
                  </Space>
                }
                bordered={false}
                style={{ borderRadius: 16 }}
              >
                {windowStats.map((window, index) => (
                  <div key={window.name} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text strong>{window.name}</Text>
                      <Space>
                        <Text type="secondary">{window.patients}人</Text>
                        <Tag color={window.status === '繁忙' ? 'red' : 'blue'}>{window.status}</Tag>
                      </Space>
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                      药师：{window.pharmacist} | 平均等待：{window.avgWaitTime}分钟
                    </div>
                    <Progress 
                      percent={Math.min((window.patients / 50) * 100, 100)} 
                      showInfo={false}
                      strokeColor={window.color}
                    />
                  </div>
                ))}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <PieChartOutlined style={{ color: '#faad14' }} />
                    优先级分布
                  </Space>
                }
                bordered={false}
                style={{ borderRadius: 16 }}
              >
                {priorityStats.map((item, index) => (
                  <div key={item.priority} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text strong>{item.priority}</Text>
                      <Space>
                        <Text type="secondary">{item.count}人</Text>
                        <Tag color="blue">{item.percentage}%</Tag>
                      </Space>
                    </div>
                    <Progress 
                      percent={item.percentage} 
                      showInfo={false}
                      strokeColor={item.color}
                    />
                  </div>
                ))}
              </Card>
            </Col>
          </Row>

          {/* 最近活动 */}
          <Card 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#faad14' }} />
                最近活动
              </Space>
            }
            bordered={false}
            style={{ borderRadius: 16 }}
          >
            <Timeline>
              {recentActivities.map((activity, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    activity.type === 'call' ? <SoundOutlined style={{ color: '#52c41a' }} /> :
                    activity.type === 'pause' ? <PauseCircleOutlined style={{ color: '#faad14' }} /> :
                    activity.type === 'system' ? <ThunderboltOutlined style={{ color: '#1890ff' }} /> :
                    activity.type === 'skip' ? <FastForwardOutlined style={{ color: '#f5222d' }} /> :
                    activity.type === 'add' ? <PlusOutlined style={{ color: '#13c2c2' }} /> :
                    <UserOutlined style={{ color: '#666' }} />
                  }
                >
                  <div>
                    <Text strong>{activity.user}</Text>
                    <Text type="secondary"> {activity.action}</Text>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                      {activity.time}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </div>
      )
    },
    {
      key: 'queue',
      label: (
        <span>
          <UserOutlined />
          队列管理
        </span>
      ),
      children: (
        <div>
          <Card 
            title={
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                药房队列管理
              </Space>
            }
            extra={
              <Space>
                <Select
                  value={selectedWindow}
                  onChange={setSelectedWindow}
                  style={{ width: 120 }}
                  options={allWindows.map(window => ({ label: window, value: window }))}
                />
                <Select
                  value={selectedPharmacist}
                  onChange={setSelectedPharmacist}
                  style={{ width: 150 }}
                  options={allPharmacists.map(pharmacist => ({ label: pharmacist, value: pharmacist }))}
                />
                <Button icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
                  新增患者
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExport}>
                  导出数据
                </Button>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: 16 }}
          >
            <Table
              columns={columns}
              dataSource={filteredQueue}
              rowKey="id"
              pagination={{ 
                pageSize: tablePageSize,
                current: tablePage[selectedWindow] || 1,
                onChange: (page) => setTablePage(prev => ({ ...prev, [selectedWindow]: page })),
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              scroll={{ x: 1200 }}
              size="middle"
            />
          </Card>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      {/* 页面标题 */}
      <Card 
        bordered={false} 
        style={{ 
          marginBottom: 24, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
        bodyStyle={{ padding: '32px 24px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <MedicineBoxOutlined style={{ marginRight: 12 }} />
              药房排队叫号
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: '8px 0 0 0' }}>
              智能排队 · 叫号管理 · 药品分发 · 药师协调
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Statistic 
                title="等待人数" 
                value={waiting} 
                valueStyle={{ color: 'white' }}
                prefix={<ClockCircleOutlined />}
              />
              <Statistic 
                title="已叫号" 
                value={called} 
                valueStyle={{ color: 'white' }}
                prefix={<SoundOutlined />}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={tabs}
        size="large"
        style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      />

      {/* 当前叫号状态 */}
      <Card 
        title={
          <Space>
            <SoundOutlined style={{ color: '#1890ff' }} />
            当前叫号状态
          </Space>
        }
        bordered={false}
        style={{ marginTop: 24, borderRadius: 16 }}
      >
        <Row gutter={[16, 16]}>
          {allCurrentCalled.map((patient, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={patient.id}>
              <Card 
                size="small" 
                style={{ 
                  border: '2px solid #52c41a',
                  background: '#f6ffed'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                    {patient.queueNo}
                  </div>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>
                    {patient.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    {patient.window} | {patient.pharmacist}
                  </div>
                  <Tag color="green">正在叫号</Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 窗口状态概览 */}
      <Card 
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: '#1890ff' }} />
            窗口状态概览
          </Space>
        }
        bordered={false}
        style={{ marginTop: 24, borderRadius: 16 }}
      >
        <Row gutter={[16, 16]}>
          {currentCalledByWindow.map((item, index) => (
            <Col xs={24} sm={12} md={6} key={item.window}>
              <Card 
                size="small" 
                style={{ 
                  border: item.patient ? '2px solid #52c41a' : '1px solid #d9d9d9',
                  background: item.patient ? '#f6ffed' : '#fafafa'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                    {item.window}
                  </div>
                  {item.patient ? (
                    <>
                      <div style={{ fontSize: 14, marginBottom: 4 }}>
                        {item.patient.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                        {item.patient.queueNo}
                      </div>
                      <Tag color="green">工作中</Tag>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
                        暂无叫号
                      </div>
                      <Tag color="default">空闲</Tag>
                    </>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
} 