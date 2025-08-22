import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Row, 
  Col, 
  Select, 
  Typography, 
  Statistic, 
  Tag, 
  Tabs, 
  message, 
  Avatar, 
  Timeline, 
  Modal, 
  Descriptions, 
  Input, 
  Space, 
  Dropdown, 
  Menu,
  Progress,
  List,
  Badge,
  Alert,
  Divider,
  Tooltip,
  Drawer,
  Steps,
  Result,
  Collapse,
  Rate,
  Image
} from 'antd';
import { 
  UserOutlined, 
  SoundOutlined, 
  RedoOutlined, 
  FastForwardOutlined, 
  HistoryOutlined, 
  PauseCircleOutlined, 
  PlayCircleOutlined, 
  ExportOutlined, 
  InfoCircleOutlined, 
  DownOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
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
  MedicineBoxOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const doctors = [
  { name: '张伟医生', dept: '内科', title: '主任医师', avatar: '👨‍⚕️', status: '工作中', patients: 156, rating: 4.9 },
  { name: '李静医生', dept: '内科', title: '副主任医师', avatar: '👩‍⚕️', status: '工作中', patients: 142, rating: 4.8 },
  { name: '王磊医生', dept: '外科', title: '主治医师', avatar: '🧑‍⚕️', status: '工作中', patients: 128, rating: 4.7 },
  { name: '刘芳医生', dept: '儿科', title: '主治医师', avatar: '👩‍⚕️', status: '工作中', patients: 189, rating: 4.9 },
  { name: '陈强医生', dept: '儿科', title: '医师', avatar: '🧑‍⚕️', status: '工作中', patients: 98, rating: 4.6 },
  { name: '赵敏医生', dept: '内科', title: '副主任医师', avatar: '👩‍⚕️', status: '工作中', patients: 167, rating: 4.8 },
  { name: '孙涛医生', dept: '内科', title: '主治医师', avatar: '🧑‍⚕️', status: '工作中', patients: 134, rating: 4.7 },
  { name: '周丽医生', dept: '内科', title: '医师', avatar: '👩‍⚕️', status: '工作中', patients: 89, rating: 4.5 },
  { name: '马俊医生', dept: '内科', title: '主治医师', avatar: '🧑‍⚕️', status: '工作中', patients: 112, rating: 4.6 }
];

const areas = ['内科', '外科', '儿科', '妇产科'];

const initialQueue = [
  { id: 1, queueNo: 'A101', name: '陈伟', gender: '男', age: 36, area: '内科', status: '待叫号', assignedDoctor: '张伟医生', priority: 'normal', symptoms: '咳嗽、发烧', waitTime: 15, contact: '13800138001' },
  { id: 2, queueNo: 'A102', name: '王芳', gender: '女', age: 29, area: '内科', status: '待叫号', assignedDoctor: '张伟医生', priority: 'high', symptoms: '胸痛、呼吸困难', waitTime: 8, contact: '13800138002' },
  { id: 3, queueNo: 'A103', name: '张敏', gender: '女', age: 61, area: '内科', status: '待叫号', assignedDoctor: '李静医生', priority: 'normal', symptoms: '高血压、头晕', waitTime: 22, contact: '13800138003' },
  { id: 4, queueNo: 'A104', name: '吴静', gender: '女', age: 56, area: '内科', status: '待叫号', assignedDoctor: '李静医生', priority: 'normal', symptoms: '糖尿病、口渴', waitTime: 18, contact: '13800138004' },
  { id: 5, queueNo: 'A105', name: '马丽', gender: '女', age: 38, area: '内科', status: '待叫号', assignedDoctor: '王磊医生', priority: 'low', symptoms: '感冒、流鼻涕', waitTime: 25, contact: '13800138005' },
  { id: 6, queueNo: 'C301', name: '刘洋', gender: '男', age: 52, area: '内科', status: '已叫号', assignedDoctor: '王磊医生', priority: 'high', symptoms: '腹痛、恶心', waitTime: 0, contact: '13800138006' },
  { id: 7, queueNo: 'B201', name: '李娜', gender: '女', age: 41, area: '儿科', status: '待叫号', assignedDoctor: '刘芳医生', priority: 'high', symptoms: '儿童发烧、咳嗽', waitTime: 12, contact: '13800138007' },
  { id: 8, queueNo: 'B202', name: '周杰', gender: '男', age: 34, area: '儿科', status: '待叫号', assignedDoctor: '刘芳医生', priority: 'normal', symptoms: '儿童腹痛', waitTime: 19, contact: '13800138008' },
  { id: 9, queueNo: 'B203', name: '许静', gender: '女', age: 27, area: '儿科', status: '待叫号', assignedDoctor: '陈强医生', priority: 'normal', symptoms: '儿童皮疹', waitTime: 16, contact: '13800138009' },
  { id: 10, queueNo: 'B204', name: '宋佳', gender: '女', age: 26, area: '儿科', status: '待叫号', assignedDoctor: '陈强医生', priority: 'low', symptoms: '儿童感冒', waitTime: 28, contact: '13800138010' }
];

// 统计数据
const statistics = {
  totalPatients: 156,
  waitingPatients: 89,
  calledPatients: 45,
  skippedPatients: 22,
  averageWaitTime: 18,
  satisfactionRate: 4.6,
  todayCalls: 67,
  emergencyCalls: 12
};

// 科室工作量统计
const departmentStats = [
  { name: '内科', patients: 89, doctors: 6, avgWaitTime: 22, status: '繁忙' },
  { name: '外科', patients: 45, doctors: 3, avgWaitTime: 18, status: '正常' },
  { name: '儿科', patients: 67, doctors: 4, avgWaitTime: 15, status: '繁忙' },
  { name: '妇产科', patients: 34, doctors: 2, avgWaitTime: 25, status: '正常' }
];

// 优先级分布
const priorityStats = [
  { priority: '紧急', count: 12, percentage: 13.5, color: '#f5222d' },
  { priority: '高', count: 28, percentage: 31.5, color: '#fa541c' },
  { priority: '中', count: 35, percentage: 39.3, color: '#faad14' },
  { priority: '低', count: 14, percentage: 15.7, color: '#52c41a' }
];

// 最近活动
const recentActivities = [
  { user: '张伟医生', action: '叫号患者陈伟', time: '2分钟前', type: 'call' },
  { user: '李静医生', action: '暂停叫号', time: '5分钟前', type: 'pause' },
  { user: '系统', action: '自动叫号提醒', time: '8分钟前', type: 'system' },
  { user: '王磊医生', action: '跳过患者马丽', time: '12分钟前', type: 'skip' },
  { user: '刘芳医生', action: '恢复叫号', time: '15分钟前', type: 'resume' }
];

export default function DoctorCallStation() {
  const [selectedArea, setSelectedArea] = useState('内科');
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0].name);
  const [queue, setQueue] = useState(initialQueue);
  const [current, setCurrent] = useState(queue.find(q => q.status === '已叫号') || null);
  const [history, setHistory] = useState([
    { queueNo: 'A101', name: '陈伟', gender: '男', age: 36, area: '内科', time: '09:01:12', skipped: false, manual: false, assignedDoctor: '张伟医生' },
    { queueNo: 'A102', name: '王芳', gender: '女', age: 29, area: '内科', time: '09:03:25', skipped: false, manual: true, assignedDoctor: '张伟医生' },
    { queueNo: 'A103', name: '张敏', gender: '女', age: 61, area: '内科', time: '09:05:40', skipped: true, manual: false, assignedDoctor: '李静医生' },
    { queueNo: 'A104', name: '吴静', gender: '女', age: 56, area: '内科', time: '09:08:10', skipped: false, manual: false, assignedDoctor: '李静医生' },
    { queueNo: 'A105', name: '马丽', gender: '女', age: 38, area: '内科', time: '09:10:55', skipped: false, manual: false, assignedDoctor: '王磊医生' }
  ]);
  const [doctorStatus, setDoctorStatus] = useState('工作中');
  const [sortKey, setSortKey] = useState('queueNo');
  const [sortOrder, setSortOrder] = useState('asc');
  const [detailPatient, setDetailPatient] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [manualQueueNo, setManualQueueNo] = useState('');
  const [queuePage, setQueuePage] = useState(1);
  const [queuePageSize, setQueuePageSize] = useState(10);
  const [activeTab, setActiveTab] = useState('overview');
  const [detailDrawer, setDetailDrawer] = useState(null);

  // 统计卡片数据
  const total = queue.filter(q => q.area === selectedArea && q.assignedDoctor === selectedDoctor).length;
  const waiting = queue.filter(q => q.area === selectedArea && q.status === '待叫号' && q.assignedDoctor === selectedDoctor).length;
  const called = queue.filter(q => q.area === selectedArea && q.status === '已叫号' && q.assignedDoctor === selectedDoctor).length;
  const skipped = queue.filter(q => q.area === selectedArea && q.status === '已跳过' && q.assignedDoctor === selectedDoctor).length;

  // 队列排序
  const sortedQueue = [...queue]
    .filter(q => q.area === selectedArea && q.status === '待叫号' && q.assignedDoctor === selectedDoctor)
    .sort((a, b) => {
      if (sortKey === 'queueNo') {
        return sortOrder === 'asc' ? a.queueNo.localeCompare(b.queueNo) : b.queueNo.localeCompare(a.queueNo);
      } else if (sortKey === 'age') {
        return sortOrder === 'asc' ? a.age - b.age : b.age - a.age;
      } else if (sortKey === 'priority') {
        const priorityOrder = { 'emergency': 4, 'high': 3, 'normal': 2, 'low': 1 };
        return sortOrder === 'asc' ? priorityOrder[a.priority] - priorityOrder[b.priority] : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  // 叫号操作
  const handleCallNext = () => {
    if (doctorStatus === '暂停中') {
      message.warning('医生状态为暂停中，无法叫号');
      return;
    }
    
    const nextPatient = sortedQueue[0];
    if (!nextPatient) {
      message.info('当前队列已空');
      return;
    }

    setQueue(prev => prev.map(q => 
      q.id === nextPatient.id ? { ...q, status: '已叫号' } : q
    ));
    
    setCurrent(nextPatient);
    setHistory(prev => [{
      ...nextPatient,
      time: new Date().toLocaleTimeString(),
      skipped: false,
      manual: false
    }, ...prev]);
    
    message.success(`已叫号：${nextPatient.name} (${nextPatient.queueNo})`);
  };

  const handleSkip = (patient) => {
    setQueue(prev => prev.map(q => 
      q.id === patient.id ? { ...q, status: '已跳过' } : q
    ));
    
    setHistory(prev => [{
      ...patient,
      time: new Date().toLocaleTimeString(),
      skipped: true,
      manual: false
    }, ...prev]);
    
    message.success(`已跳过：${patient.name} (${patient.queueNo})`);
  };

  const handleManualCall = () => {
    if (!manualQueueNo.trim()) {
      message.warning('请输入队列号');
      return;
    }
    
    const patient = queue.find(q => q.queueNo === manualQueueNo.trim());
    if (!patient) {
      message.error('未找到该队列号的患者');
      return;
    }
    
    if (patient.status !== '待叫号') {
      message.warning('该患者状态不是待叫号');
      return;
    }
    
    setQueue(prev => prev.map(q => 
      q.id === patient.id ? { ...q, status: '已叫号' } : q
    ));
    
    setCurrent(patient);
    setHistory(prev => [{
      ...patient,
      time: new Date().toLocaleTimeString(),
      skipped: false,
      manual: true
    }, ...prev]);
    
    setManualQueueNo('');
    message.success(`手动叫号：${patient.name} (${patient.queueNo})`);
  };

  const handleExport = () => {
    const data = queue.map(q => ({
      队列号: q.queueNo,
      姓名: q.name,
      性别: q.gender,
      年龄: q.age,
      科室: q.area,
      状态: q.status,
      主治医生: q.assignedDoctor
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '医生叫号队列');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '医生叫号队列.xlsx');
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
            {record.symptoms}
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
          status === '已跳过' ? 'red' : 'default'
        }>
          {status}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<SoundOutlined />}
            onClick={() => handleCallNext()}
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

          {/* 科室工作量和优先级分布 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <TeamOutlined style={{ color: '#1890ff' }} />
                    科室工作量统计
                  </Space>
                }
                bordered={false}
                style={{ borderRadius: 16 }}
              >
                {departmentStats.map((dept, index) => (
                  <div key={dept.name} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text strong>{dept.name}</Text>
                      <Space>
                        <Text type="secondary">{dept.patients}人</Text>
                        <Tag color={dept.status === '繁忙' ? 'red' : 'blue'}>{dept.status}</Tag>
                      </Space>
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                      医生：{dept.doctors}人 | 平均等待：{dept.avgWaitTime}分钟
                    </div>
                    <Progress 
                      percent={Math.min((dept.patients / 100) * 100, 100)} 
                      showInfo={false}
                      strokeColor={dept.status === '繁忙' ? '#f5222d' : '#1890ff'}
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
                患者队列管理
              </Space>
            }
            extra={
              <Space>
                <Select
                  value={selectedArea}
                  onChange={setSelectedArea}
                  style={{ width: 120 }}
                  options={areas.map(area => ({ label: area, value: area }))}
                />
                <Select
                  value={selectedDoctor}
                  onChange={setSelectedDoctor}
                  style={{ width: 150 }}
                  options={doctors.map(doctor => ({ label: doctor.name, value: doctor.name }))}
                />
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
              dataSource={sortedQueue}
              rowKey="id"
              pagination={{ 
                pageSize: queuePageSize,
                current: queuePage,
                onChange: setQueuePage,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              scroll={{ x: 800 }}
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
              <SoundOutlined style={{ marginRight: 12 }} />
              医生虚拟叫号
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: '8px 0 0 0' }}>
              智能叫号 · 队列管理 · 患者分流 · 医生工作台
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Statistic 
                title="当前叫号" 
                value={current ? current.queueNo : '无'} 
                valueStyle={{ color: 'white' }}
                prefix={<SoundOutlined />}
              />
              <Statistic 
                title="等待人数" 
                value={waiting} 
                valueStyle={{ color: 'white' }}
                prefix={<ClockCircleOutlined />}
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

      {/* 叫号控制面板 */}
      <Card 
        title={
          <Space>
            <SoundOutlined style={{ color: '#1890ff' }} />
            叫号控制面板
          </Space>
        }
        bordered={false}
        style={{ marginTop: 24, borderRadius: 16 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                当前状态：{doctorStatus}
              </div>
              <Space>
                <Button 
                  type={doctorStatus === '工作中' ? 'default' : 'primary'}
                  icon={<PlayCircleOutlined />}
                  onClick={() => setDoctorStatus('工作中')}
                >
                  工作中
                </Button>
                <Button 
                  type={doctorStatus === '暂停中' ? 'default' : 'primary'}
                  icon={<PauseCircleOutlined />}
                  onClick={() => setDoctorStatus('暂停中')}
                >
                  暂停中
                </Button>
              </Space>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                icon={<SoundOutlined />}
                onClick={handleCallNext}
                disabled={doctorStatus === '暂停中' || waiting === 0}
                style={{ height: 60, fontSize: 18 }}
              >
                叫下一个号
              </Button>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>手动叫号</Text>
              </div>
              <Space>
                <Input 
                  placeholder="输入队列号" 
                  value={manualQueueNo}
                  onChange={(e) => setManualQueueNo(e.target.value)}
                  style={{ width: 120 }}
                />
                <Button 
                  type="primary" 
                  icon={<SoundOutlined />}
                  onClick={handleManualCall}
                  disabled={!manualQueueNo.trim()}
                >
                  叫号
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 患者详情抽屉 */}
      <Drawer
        title="患者详情"
        placement="right"
        onClose={() => setDetailDrawer(null)}
        open={!!detailDrawer}
        width={500}
      >
        {detailDrawer && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <Title level={3} style={{ marginTop: 16 }}>{detailDrawer.name}</Title>
            </div>

            <Descriptions column={1} bordered>
              <Descriptions.Item label="队列号">{detailDrawer.queueNo}</Descriptions.Item>
              <Descriptions.Item label="性别">{detailDrawer.gender}</Descriptions.Item>
              <Descriptions.Item label="年龄">{detailDrawer.age}岁</Descriptions.Item>
              <Descriptions.Item label="科室">{detailDrawer.area}</Descriptions.Item>
              <Descriptions.Item label="主治医生">{detailDrawer.assignedDoctor}</Descriptions.Item>
              <Descriptions.Item label="症状描述">{detailDrawer.symptoms || '无'}</Descriptions.Item>
              <Descriptions.Item label="等待时间">{detailDrawer.waitTime}分钟</Descriptions.Item>
              <Descriptions.Item label="联系电话">{detailDrawer.contact || '无'}</Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={
                  detailDrawer.priority === 'emergency' ? 'red' : 
                  detailDrawer.priority === 'high' ? 'orange' : 
                  detailDrawer.priority === 'low' ? 'green' : 'blue'
                }>
                  {detailDrawer.priority === 'emergency' ? '紧急' : 
                   detailDrawer.priority === 'high' ? '高' : 
                   detailDrawer.priority === 'low' ? '低' : '普通'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
} 