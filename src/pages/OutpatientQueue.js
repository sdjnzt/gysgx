import React, { useState, useEffect } from 'react';
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
  HistoryOutlined, 
  RedoOutlined, 
  SoundOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined, 
  TeamOutlined, 
  UserOutlined,
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
  MedicineBoxOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  FastForwardOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const areas = ['内科', '外科', '儿科', '妇产科'];
const doctors = [
  { name: '张伟医生', dept: '内科', title: '主任医师', avatar: '👨‍⚕️', status: '工作中', patients: 156, rating: 4.9 },
  { name: '李静医生', dept: '内科', title: '副主任医师', avatar: '👩‍⚕️', status: '工作中', patients: 142, rating: 4.8 },
  { name: '王磊医生', dept: '外科', title: '主治医师', avatar: '🧑‍⚕️', status: '工作中', patients: 128, rating: 4.7 },
  { name: '刘芳医生', dept: '儿科', title: '主治医师', avatar: '👩‍⚕️', status: '工作中', patients: 189, rating: 4.9 }
];

const initialQueue = [
  { id: 1, queueNo: 'A101', name: '陈伟', gender: '男', age: 36, area: '内科', status: '待叫号', assignedDoctor: '张伟医生', priority: 'normal', symptoms: '咳嗽、发烧', waitTime: 15, contact: '13800138001' },
  { id: 2, queueNo: 'A102', name: '王芳', gender: '女', age: 29, area: '内科', status: '待叫号', assignedDoctor: '张伟医生', priority: 'high', symptoms: '胸痛、呼吸困难', waitTime: 8, contact: '13800138002' },
  { id: 3, queueNo: 'A103', name: '张敏', gender: '女', age: 61, area: '内科', status: '已叫号', assignedDoctor: '李静医生', priority: 'normal', symptoms: '高血压、头晕', waitTime: 0, contact: '13800138003' },
  { id: 4, queueNo: 'A104', name: '吴静', gender: '女', age: 56, area: '内科', status: '待叫号', assignedDoctor: '李静医生', priority: 'normal', symptoms: '糖尿病、口渴', waitTime: 18, contact: '13800138004' },
  { id: 5, queueNo: 'A105', name: '马丽', gender: '女', age: 38, area: '内科', status: '待叫号', assignedDoctor: '王磊医生', priority: 'low', symptoms: '感冒、流鼻涕', waitTime: 25, contact: '13800138005' },
  { id: 6, queueNo: 'C301', name: '刘洋', gender: '男', age: 52, area: '内科', status: '待叫号', assignedDoctor: '王磊医生', priority: 'high', symptoms: '腹痛、恶心', waitTime: 12, contact: '13800138006' },
  { id: 7, queueNo: 'B201', name: '李娜', gender: '女', age: 41, area: '儿科', status: '待叫号', assignedDoctor: '刘芳医生', priority: 'high', symptoms: '儿童发烧、咳嗽', waitTime: 12, contact: '13800138007' },
  { id: 8, queueNo: 'B202', name: '周杰', gender: '男', age: 34, area: '儿科', status: '待叫号', assignedDoctor: '刘芳医生', priority: 'normal', symptoms: '儿童腹痛', waitTime: 19, contact: '13800138008' },
  { id: 9, queueNo: 'B203', name: '许静', gender: '女', age: 27, area: '儿科', status: '已叫号', assignedDoctor: '刘芳医生', priority: 'normal', symptoms: '儿童皮疹', waitTime: 0, contact: '13800138009' },
  { id: 10, queueNo: 'B204', name: '宋佳', gender: '女', age: 26, area: '儿科', status: '待叫号', assignedDoctor: '刘芳医生', priority: 'low', symptoms: '儿童感冒', waitTime: 28, contact: '13800138010' },
  { id: 11, queueNo: 'D401', name: '赵磊', gender: '男', age: 53, area: '妇产科', status: '待叫号', assignedDoctor: '王磊医生', priority: 'normal', symptoms: '妇科检查', waitTime: 22, contact: '13800138011' },
  { id: 12, queueNo: 'D402', name: '郑强', gender: '男', age: 42, area: '妇产科', status: '已叫号', assignedDoctor: '王磊医生', priority: 'high', symptoms: '产前检查', waitTime: 0, contact: '13800138012' },
  { id: 13, queueNo: 'D403', name: '邓超', gender: '男', age: 32, area: '妇产科', status: '待叫号', assignedDoctor: '李静医生', priority: 'normal', symptoms: '妇科咨询', waitTime: 16, contact: '13800138013' },
  { id: 14, queueNo: 'D404', name: '赵丽', gender: '女', age: 39, area: '妇产科', status: '待叫号', assignedDoctor: '李静医生', priority: 'normal', symptoms: '妇科检查', waitTime: 20, contact: '13800138014' },
  { id: 15, queueNo: 'E501', name: '孙婷', gender: '女', age: 46, area: '外科', status: '待叫号', assignedDoctor: '张伟医生', priority: 'normal', symptoms: '外伤处理', waitTime: 14, contact: '13800138015' },
  { id: 16, queueNo: 'E502', name: '高峰', gender: '男', age: 47, area: '外科', status: '已叫号', assignedDoctor: '王磊医生', priority: 'high', symptoms: '骨折', waitTime: 0, contact: '13800138016' },
  { id: 17, queueNo: 'E503', name: '李倩', gender: '女', age: 31, area: '外科', status: '待叫号', assignedDoctor: '刘芳医生', priority: 'normal', symptoms: '伤口缝合', waitTime: 18, contact: '13800138017' },
  { id: 18, queueNo: 'E504', name: '陈晨', gender: '女', age: 28, area: '外科', status: '待叫号', assignedDoctor: '李静医生', priority: 'low', symptoms: '轻微擦伤', waitTime: 30, contact: '13800138018' },
  { id: 19, queueNo: 'E505', name: '王强', gender: '男', age: 40, area: '外科', status: '已跳过', assignedDoctor: '王磊医生', priority: 'normal', symptoms: '外伤处理', waitTime: 0, contact: '13800138019' },
  { id: 20, queueNo: 'E506', name: '刘婷', gender: '女', age: 35, area: '外科', status: '待叫号', assignedDoctor: '张伟医生', priority: 'normal', symptoms: '伤口处理', waitTime: 24, contact: '13800138020' }
];

// 统计数据
const statistics = {
  totalPatients: 234,
  waitingPatients: 156,
  calledPatients: 45,
  skippedPatients: 33,
  averageWaitTime: 22,
  satisfactionRate: 4.5,
  todayCalls: 89,
  emergencyCalls: 18
};

// 科室工作量统计
const departmentStats = [
  { name: '内科', patients: 89, doctors: 6, avgWaitTime: 25, status: '繁忙', color: '#1890ff' },
  { name: '外科', patients: 67, doctors: 4, avgWaitTime: 20, status: '正常', color: '#52c41a' },
  { name: '儿科', patients: 78, doctors: 5, avgWaitTime: 18, status: '繁忙', color: '#faad14' },
  { name: '妇产科', patients: 45, doctors: 3, avgWaitTime: 28, status: '正常', color: '#eb2f96' }
];

// 优先级分布
const priorityStats = [
  { priority: '紧急', count: 18, percentage: 11.5, color: '#f5222d' },
  { priority: '高', count: 42, percentage: 26.9, color: '#fa541c' },
  { priority: '中', count: 68, percentage: 43.6, color: '#faad14' },
  { priority: '低', count: 28, percentage: 17.9, color: '#52c41a' }
];

// 最近活动
const recentActivities = [
  { user: '张伟医生', action: '叫号患者陈伟', time: '3分钟前', type: 'call' },
  { user: '李静医生', action: '暂停叫号', time: '6分钟前', type: 'pause' },
  { user: '系统', action: '自动叫号提醒', time: '9分钟前', type: 'system' },
  { user: '王磊医生', action: '跳过患者马丽', time: '12分钟前', type: 'skip' },
  { user: '刘芳医生', action: '恢复叫号', time: '15分钟前', type: 'resume' },
  { user: '导医台', action: '新增患者登记', time: '18分钟前', type: 'add' }
];

export default function OutpatientQueue() {
  const allAreas = ['全部分区', ...areas];
  const allDoctors = ['全部医生', ...doctors.map(d => d.name)];
  
  const [selectedArea, setSelectedArea] = useState('内科');
  const [selectedDoctor, setSelectedDoctor] = useState('全部医生');
  const [queueState, setQueueState] = useState(initialQueue);
  const [history, setHistory] = useState([]);
  const [detailPatient, setDetailPatient] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [log, setLog] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const historyPageSize = 8;
  const [tablePage, setTablePage] = useState({});
  const tablePageSize = 5;
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [detailDrawer, setDetailDrawer] = useState(null);
  const role = 'admin';
  
  // 医生管理相关state
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorList, setDoctorList] = useState([
    { name: '张伟医生', dept: '内科', phone: '13912345678', jobNo: 'D001', title: '主任医师' },
    { name: '李静医生', dept: '内科', phone: '15898765432', jobNo: 'D002', title: '副主任医师' },
    { name: '王磊医生', dept: '外科', phone: '18623456789', jobNo: 'D003', title: '主治医师' },
    { name: '刘芳医生', dept: '儿科', phone: '13787654321', jobNo: 'D004', title: '主治医师' },
  ]);
  const [doctorFormOpen, setDoctorFormOpen] = useState(false);
  const [editDoctorIdx, setEditDoctorIdx] = useState(null);
  const [doctorForm] = Form.useForm();
  const [deleteIdx, setDeleteIdx] = useState(null);
  const doctorTitles = ['主任医师', '副主任医师', '主治医师', '医师'];

  // 数据筛选
  const filteredQueue = queueState.filter(q =>
    (selectedArea === '全部分区' || q.area === selectedArea) &&
    (selectedDoctor === '全部医生' || q.assignedDoctor === selectedDoctor)
  );
  
  // 分组
  const groupedQueue = {};
  filteredQueue.forEach(q => {
    if (!groupedQueue[q.area]) groupedQueue[q.area] = {};
    if (!groupedQueue[q.area][q.assignedDoctor]) groupedQueue[q.area][q.assignedDoctor] = [];
    groupedQueue[q.area][q.assignedDoctor].push(q);
  });
  
  // 统计
  const total = filteredQueue.length;
  const waiting = filteredQueue.filter(q => q.status === '待叫号').length;
  const called = filteredQueue.filter(q => q.status === '已叫号').length;
  const skipped = filteredQueue.filter(q => q.status === '已跳过').length;
  
  // 当前叫号
  const allCurrentCalled = queueState.filter(q => q.status === '已叫号').slice(-5).reverse();
  
  // 最新叫号
  const latestCalled = queueState.filter(q => q.status === '已叫号').slice(-5).reverse();
  
  // 柱状图数据
  const areaStats = areas.map(area => ({
    area,
    count: queueState.filter(q => q.area === area && q.status === '待叫号').length,
  }));
  
  // 历史分页
  const sortedHistory = [...history].sort((a, b) => b.time.localeCompare(a.time));
  const pagedHistory = sortedHistory.slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize);

  // 操作
  const handleCall = (record) => {
    setQueueState(qs => qs.map(q => q.id === record.id ? { ...q, status: '已叫号' } : q));
    setHistory(h => [{ ...record, time: dayjs().format('HH:mm:ss'), skipped: false, manual: false }, ...h]);
    message.success(`已叫号：${record.name} (${record.queueNo})`);
  };
  
  const handleSkip = (record) => {
    setQueueState(qs => qs.map(q => q.id === record.id ? { ...q, status: '已跳过' } : q));
    setHistory(h => [{ ...record, time: dayjs().format('HH:mm:ss'), skipped: true, manual: false }, ...h]);
    message.success(`已跳过：${record.name} (${record.queueNo})`);
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
      科室: q.area, 
      主治医生: q.pharmacist, 
      状态: q.status
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '门诊队列');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '门诊队列.xlsx');
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
      title: '科室/医生',
      dataIndex: 'area',
      key: 'area',
      width: 120,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.assignedDoctor}
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
      width: 160,
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
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ width: '100%' }}
          >
            编辑
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
                      strokeColor={dept.color}
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
                门诊队列管理
              </Space>
            }
            extra={
              <Space>
                <Select
                  value={selectedArea}
                  onChange={setSelectedArea}
                  style={{ width: 120 }}
                  options={allAreas.map(area => ({ label: area, value: area }))}
                />
                <Select
                  value={selectedDoctor}
                  onChange={setSelectedDoctor}
                  style={{ width: 150 }}
                  options={allDoctors.map(doctor => ({ label: doctor, value: doctor }))}
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
                current: tablePage[selectedArea] || 1,
                onChange: (page) => setTablePage(prev => ({ ...prev, [selectedArea]: page })),
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              scroll={{ x: 1000 }}
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
              <UserOutlined style={{ marginRight: 12 }} />
              门诊排队叫号
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: '8px 0 0 0' }}>
              智能排队 · 叫号管理 · 患者分流 · 科室协调
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
                    {patient.area} | {patient.assignedDoctor}
                  </div>
                  <Tag color="green">正在叫号</Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
} 