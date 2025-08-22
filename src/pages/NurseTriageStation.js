import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Typography,
  Statistic,
  Tabs,
  Descriptions,
  Avatar,
  Timeline,
  Progress,
  Badge,
  Alert,
  Space,
  Divider,
  List,
  Tooltip,
  Drawer,
  Steps,
  Result,
  Image,
  Rate,
  Collapse
} from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SoundOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  FireOutlined,
  TrophyOutlined,
  HeartOutlined,
  ExclamationCircleOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;
const { Panel } = Collapse;

const initialPatients = [
  {
    id: 1,
    name: '陈伟',
    gender: '男',
    age: 36,
    status: '待分诊',
    queueNo: 'A101',
    assignedDoctor: '',
    triageTime: '',
    area: '内科',
    priority: 'normal',
    symptoms: '咳嗽、发烧',
    waitTime: 40,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    history: [],
    contact: '13800138001',
    emergency: false
  },
  {
    id: 2,
    name: '王芳',
    gender: '女',
    age: 29,
    status: '待分诊',
    queueNo: 'A102',
    assignedDoctor: '',
    triageTime: '',
    area: '外科',
    priority: 'high',
    symptoms: '手臂骨折',
    waitTime: 10,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    history: [],
    contact: '13800138002',
    emergency: true
  },
  {
    id: 3,
    name: '李娜',
    gender: '女',
    age: 41,
    status: '已分诊',
    queueNo: 'B201',
    assignedDoctor: '陈医生',
    triageTime: '09:15',
    area: '儿科',
    priority: 'normal',
    symptoms: '儿童发烧',
    waitTime: 0,
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    history: ['分诊于09:15'],
    contact: '13800138003',
    emergency: false
  },
  {
    id: 4,
    name: '刘洋',
    gender: '男',
    age: 52,
    status: '叫号中',
    queueNo: 'C301',
    assignedDoctor: '王医生',
    triageTime: '09:20',
    area: '内科',
    priority: 'high',
    symptoms: '胸痛、呼吸困难',
    waitTime: 0,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    history: ['分诊于09:20', '叫号于09:25'],
    contact: '13800138004',
    emergency: true
  },
  {
    id: 5,
    name: '张敏',
    gender: '女',
    age: 61,
    status: '待分诊',
    queueNo: 'A103',
    assignedDoctor: '',
    triageTime: '',
    area: '外科',
    priority: 'normal',
    symptoms: '膝关节疼痛',
    waitTime: 5,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    history: [],
    contact: '13800138005',
    emergency: false
  }
];

const initialAreas = [
  {
    id: 1,
    name: '内科区',
    description: '内科疾病诊疗区域',
    doctors: 8,
    patients: 25,
    status: 'busy',
    waitTime: 35
  },
  {
    id: 2,
    name: '外科区',
    description: '外科手术及创伤救治区域',
    doctors: 6,
    patients: 18,
    status: 'normal',
    waitTime: 20
  },
  {
    id: 3,
    name: '儿科区',
    description: '儿童疾病诊疗区域',
    doctors: 4,
    patients: 32,
    status: 'crowded',
    waitTime: 45
  },
  {
    id: 4,
    name: '妇产科区',
    description: '妇科及产科诊疗区域',
    doctors: 5,
    patients: 15,
    status: 'normal',
    waitTime: 25
  },
  {
    id: 5,
    name: '急诊区',
    description: '24小时急诊救治区域',
    doctors: 12,
    patients: 8,
    status: 'normal',
    waitTime: 15
  }
];

// 统计数据
const statistics = {
  totalPatients: 156,
  waitingPatients: 89,
  triagedPatients: 45,
  calledPatients: 22,
  totalDoctors: 35,
  activeDoctors: 28,
  averageWaitTime: 25,
  satisfactionRate: 94.5,
  todayTriage: 67,
  emergencyCases: 12
};

// 科室工作量统计
const departmentStats = [
  { name: '内科', patients: 45, doctors: 8, waitTime: 35, status: 'busy' },
  { name: '外科', patients: 28, doctors: 6, waitTime: 20, status: 'normal' },
  { name: '儿科', patients: 38, doctors: 4, waitTime: 45, status: 'crowded' },
  { name: '妇产科', patients: 22, doctors: 5, waitTime: 25, status: 'normal' },
  { name: '急诊科', patients: 15, doctors: 12, waitTime: 15, status: 'normal' }
];

// 优先级统计
const priorityStats = [
  { priority: '紧急', count: 12, color: '#f5222d' },
  { priority: '高', count: 28, color: '#fa541c' },
  { priority: '中', count: 45, color: '#faad14' },
  { priority: '低', count: 71, color: '#52c41a' }
];

// 日志类型与图标/颜色映射
const logTypeMap = {
  '新增患者': { icon: <PlusCircleOutlined style={{ color: '#52c41a' }} />, color: 'green' },
  '编辑': { icon: <EditOutlined style={{ color: '#1890ff' }} />, color: 'blue' },
  '删除': { icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, color: 'red' },
  '分诊': { icon: <CheckCircleOutlined style={{ color: '#13c2c2' }} />, color: 'cyan' },
  '叫号': { icon: <SoundOutlined style={{ color: '#faad14' }} />, color: 'gold' },
  '导出Excel': { icon: <ExportOutlined style={{ color: '#722ed1' }} />, color: 'purple' },
  '新增分区': { icon: <PlusCircleOutlined style={{ color: '#2db7f5' }} />, color: 'blue' },
  '编辑分区备注': { icon: <InfoCircleOutlined style={{ color: '#faad14' }} />, color: 'gold' },
  '批量分诊': { icon: <CheckCircleOutlined style={{ color: '#13c2c2' }} />, color: 'cyan' },
  '批量叫号': { icon: <SoundOutlined style={{ color: '#faad14' }} />, color: 'gold' },
  '系统启动': { icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />, color: 'blue' },
};

export default function NurseTriageStation() {
  const [patients, setPatients] = useState(initialPatients);
  const [areas, setAreas] = useState(initialAreas);
  const [areaModalVisible, setAreaModalVisible] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [areaForm] = Form.useForm();
  const [patientModalVisible, setPatientModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [patientForm] = Form.useForm();
  const [logs, setLogs] = useState([
    { time: '09:00:01', action: '系统启动', details: '' },
    { time: '09:05:12', action: '新增患者', details: '陈伟 内科' },
    { time: '09:10:23', action: '分诊', details: '李娜 儿科' },
    { time: '09:15:45', action: '叫号', details: '刘洋 内科' },
    { time: '09:20:10', action: '新增分区', details: '妇产科' },
    { time: '09:25:33', action: '批量分诊', details: '王芳、张敏 外科' },
    { time: '09:30:50', action: '批量叫号', details: '孙婷、吴静' },
    { time: '09:35:18', action: '删除患者', details: '何军 内科' },
    { time: '09:40:00', action: '导出Excel', details: '' },
    { time: '09:45:22', action: '编辑分区备注', details: '儿科' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [detailPatient, setDetailPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 分区管理
  const handleAddArea = () => {
    setEditingArea(null);
    setAreaModalVisible(true);
    areaForm.resetFields();
  };

  const handleEditArea = area => {
    setEditingArea(area);
    setAreaModalVisible(true);
    areaForm.setFieldsValue(area);
  };

  const handleDeleteArea = area => {
    Modal.confirm({
      title: '确认删除该分区？',
      onOk: () => {
        setAreas(areas.filter(a => a.id !== area.id));
        message.success('删除成功');
      }
    });
  };

  const handleAreaOk = () => {
    areaForm.validateFields().then(values => {
      if (editingArea) {
        setAreas(areas.map(item => item.id === editingArea.id ? { ...editingArea, ...values } : item));
        message.success('编辑成功');
      } else {
        setAreas([...areas, { ...values, id: Date.now() }]);
        message.success('新增成功');
      }
      setAreaModalVisible(false);
      setEditingArea(null);
      areaForm.resetFields();
    });
  };

  // 患者管理
  const handleAddPatient = () => {
    setEditingPatient(null);
    setPatientModalVisible(true);
    patientForm.resetFields();
  };

  const handleEditPatient = patient => {
    setEditingPatient(patient);
    setPatientModalVisible(true);
    patientForm.setFieldsValue(patient);
  };

  const handleDeletePatient = patient => {
    Modal.confirm({
      title: '确认删除该患者？',
      onOk: () => {
        setPatients(patients.filter(p => p.id !== patient.id));
        message.success('删除成功');
      }
    });
  };

  const handlePatientOk = () => {
    patientForm.validateFields().then(values => {
      if (editingPatient) {
        setPatients(patients.map(item => item.id === editingPatient.id ? { ...editingPatient, ...values } : item));
        message.success('编辑成功');
      } else {
        setPatients([...patients, { ...values, id: Date.now() }]);
        message.success('新增成功');
      }
      setPatientModalVisible(false);
      setEditingPatient(null);
      patientForm.resetFields();
    });
  };

  // 批量操作
  const handleBatchTriage = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要分诊的患者');
      return;
    }
    Modal.confirm({
      title: '批量分诊',
      content: `确定要为 ${selectedRowKeys.length} 名患者进行分诊吗？`,
      onOk: () => {
        setPatients(patients.map(p =>
          selectedRowKeys.includes(p.id)
            ? { ...p, status: '已分诊', triageTime: new Date().toLocaleTimeString() }
            : p
        ));
        setSelectedRowKeys([]);
        message.success('批量分诊成功');
      }
    });
  };

  const handleBatchCall = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要叫号的患者');
      return;
    }
    Modal.confirm({
      title: '批量叫号',
      content: `确定要为 ${selectedRowKeys.length} 名患者叫号吗？`,
      onOk: () => {
        setPatients(patients.map(p =>
          selectedRowKeys.includes(p.id)
            ? { ...p, status: '叫号中' }
            : p
        ));
        setSelectedRowKeys([]);
        message.success('批量叫号成功');
      }
    });
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'green';
      case 'busy': return 'orange';
      case 'crowded': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'normal': return '正常';
      case 'busy': return '繁忙';
      case 'crowded': return '拥挤';
      default: return '未知';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'red';
      case 'high': return 'orange';
      case 'normal': return 'blue';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'emergency': return '紧急';
      case 'high': return '高';
      case 'normal': return '中';
      case 'low': return '低';
      default: return '未知';
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '患者信息',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.gender} | {record.age}岁 | {record.contact}
          </div>
          {record.emergency && <Tag color="red" icon={<ExclamationCircleOutlined />}>急诊</Tag>}
        </div>
      ),
    },
    {
      title: '症状描述',
      dataIndex: 'symptoms',
      key: 'symptoms',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: '等待时间',
      dataIndex: 'waitTime',
      key: 'waitTime',
      render: (waitTime) => (
        <div>
          <div>{waitTime}分钟</div>
          <Progress
            percent={Math.min(waitTime / 60 * 100, 100)}
            size="small"
            showInfo={false}
            strokeColor={waitTime > 30 ? '#f5222d' : waitTime > 15 ? '#faad14' : '#52c41a'}
          />
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          '待分诊': { color: 'orange', icon: <ClockCircleOutlined /> },
          '已分诊': { color: 'blue', icon: <CheckCircleOutlined /> },
          '叫号中': { color: 'green', icon: <SoundOutlined /> },
          '已完成': { color: 'default', icon: <CheckCircleOutlined /> }
        };
        const config = statusConfig[status] || { color: 'default', icon: <InfoCircleOutlined /> };
        return (
          <Tag color={config.color} icon={config.icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => setDetailPatient(record)}>
            详情
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditPatient(record)}>
            编辑
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeletePatient(record)}>
            删除
          </Button>
        </Space>
      ),
    },
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
                  title="今日患者"
                  value={statistics.totalPatients}
                  valueStyle={{ color: 'white' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Statistic
                  title="等待分诊"
                  value={statistics.waitingPatients}
                  valueStyle={{ color: 'white' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <Statistic
                  title="平均等待"
                  value={statistics.averageWaitTime}
                  suffix="分钟"
                  valueStyle={{ color: 'white' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                <Statistic
                  title="满意度"
                  value={statistics.satisfactionRate}
                  suffix="%"
                  valueStyle={{ color: 'white' }}
                  prefix={<HeartOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* 科室工作量统计 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <MedicineBoxOutlined style={{ color: '#1890ff' }} />
                    科室工作量统计
                  </Space>
                }
                bordered={false}
              >
                {departmentStats.map((dept, index) => (
                  <div key={dept.name} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text strong>{dept.name}</Text>
                      <Space>
                        <Tag color={getStatusColor(dept.status)}>{getStatusText(dept.status)}</Tag>
                        <Text type="secondary">{dept.waitTime}分钟</Text>
                      </Space>
                    </div>
                    <Progress
                      percent={Math.min(dept.patients / 50 * 100, 100)}
                      showInfo={false}
                      strokeColor={dept.status === 'crowded' ? '#f5222d' : dept.status === 'busy' ? '#faad14' : '#52c41a'}
                    />
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                      {dept.patients}位患者 | {dept.doctors}位医生
                    </div>
                  </div>
                ))}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <FireOutlined style={{ color: '#fa541c' }} />
                    优先级分布
                  </Space>
                }
                bordered={false}
              >
                {priorityStats.map((item, index) => (
                  <div key={item.priority} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text strong>{item.priority}</Text>
                      <Text type="secondary">{item.count}人</Text>
                    </div>
                    <Progress
                      percent={Math.min(item.count / 100 * 100, 100)}
                      showInfo={false}
                      strokeColor={item.color}
                    />
                  </div>
                ))}
              </Card>
            </Col>
          </Row>

          {/* 实时监控 */}
          <Card
            title={
              <Space>
                <ThunderboltOutlined style={{ color: '#13c2c2' }} />
                实时监控
              </Space>
            }
            bordered={false}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Alert
                  message="急诊患者提醒"
                  description={`当前有 ${statistics.emergencyCases} 名急诊患者需要优先处理`}
                  type="error"
                  showIcon
                  icon={<ExclamationCircleOutlined />}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Alert
                  message="等待时间提醒"
                  description={`有 ${statistics.waitingPatients} 名患者等待时间超过30分钟`}
                  type="warning"
                  showIcon
                  icon={<ClockCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </div>
      )
    },
    {
      key: 'queue',
      label: (
        <span>
          <TeamOutlined />
          患者队列
        </span>
      ),
      children: (
        <div>
          <Card
            title="患者队列管理"
            extra={
              <Space>
                <Button icon={<PlusOutlined />} onClick={handleAddPatient}>
                  新增患者
                </Button>
                <Button
                  type="primary"
                  onClick={handleBatchTriage}
                  disabled={selectedRowKeys.length === 0}
                >
                  批量分诊
                </Button>
                <Button
                  type="primary"
                  onClick={handleBatchCall}
                  disabled={selectedRowKeys.length === 0}
                >
                  批量叫号
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出Excel
                </Button>
              </Space>
            }
            bordered={false}
          >
            <Table
              columns={columns}
              dataSource={patients}
              rowKey="id"
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: patients.length,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      )
    },
    {
      key: 'areas',
      label: (
        <span>
          <MedicineBoxOutlined />
          分区管理
        </span>
      ),
      children: (
        <div>
          <Card
            title="分区管理"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddArea}>
                新增分区
              </Button>
            }
            bordered={false}
          >
            <Row gutter={[16, 16]}>
              {areas.map(area => (
                <Col xs={24} sm={12} lg={8} key={area.id}>
                  <Card
                    hoverable
                    style={{
                      border: `2px solid ${getStatusColor(area.status)}`,
                      borderRadius: 8
                    }}
                    actions={[
                      <Button size="small" icon={<EditOutlined />} onClick={() => handleEditArea(area)}>
                        编辑
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Space>
                          {area.name}
                          <Tag color={getStatusColor(area.status)}>
                            {getStatusText(area.status)}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <Paragraph>{area.description}</Paragraph>
                          <div style={{ marginTop: 8 }}>
                            <Tag color="blue">{area.doctors}位医生</Tag>
                            <Tag color="green">{area.patients}位患者</Tag>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                              <ClockCircleOutlined /> 平均等待：{area.waitTime}分钟
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      )
    },
    {
      key: 'logs',
      label: (
        <span>
          <HistoryOutlined />
          操作日志
        </span>
      ),
      children: (
        <div>
          <Card title="操作日志" bordered={false}>
            <Timeline>
              {logs.map((log, index) => (
                <Timeline.Item
                  key={index}
                  dot={logTypeMap[log.action]?.icon || <InfoCircleOutlined />}
                  color={logTypeMap[log.action]?.color}
                >
                  <div>
                    <Text strong>{log.action}</Text>
                    {log.details && <Text type="secondary"> - {log.details}</Text>}
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                      {log.time}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
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
              <TeamOutlined style={{ marginRight: 12 }} />
              护士分诊台管理
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: '8px 0 0 0' }}>
              患者队列管理 · 智能分诊 · 分区管理 · 实时监控 · 操作日志
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Statistic
                title="今日分诊"
                value={statistics.todayTriage}
                valueStyle={{ color: 'white' }}
                prefix={<CheckCircleOutlined />}
              />
              <Statistic
                title="急诊患者"
                value={statistics.emergencyCases}
                valueStyle={{ color: 'white' }}
                prefix={<ExclamationCircleOutlined />}
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
        style={{ background: '#fff', padding: 24, borderRadius: 8 }}
      />

      {/* 分区编辑弹窗 */}
      <Modal
        title={editingArea ? '编辑分区' : '新增分区'}
        open={areaModalVisible}
        onOk={handleAreaOk}
        onCancel={() => {
          setAreaModalVisible(false);
          setEditingArea(null);
          areaForm.resetFields();
        }}
        width={500}
      >
        <Form form={areaForm} layout="vertical">
          <Form.Item name="name" label="分区名称" rules={[{ required: true, message: '请输入分区名称' }]}>
            <Input placeholder="请输入分区名称" />
          </Form.Item>
          <Form.Item name="description" label="分区描述" rules={[{ required: true, message: '请输入分区描述' }]}>
            <Input.TextArea placeholder="请输入分区描述" rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="doctors" label="医生数量" rules={[{ required: true, message: '请输入医生数量' }]}>
                <Input type="number" placeholder="请输入医生数量" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Option value="normal">正常</Option>
                  <Option value="busy">繁忙</Option>
                  <Option value="crowded">拥挤</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 患者编辑弹窗 */}
      <Modal
        title={editingPatient ? '编辑患者' : '新增患者'}
        open={patientModalVisible}
        onOk={handlePatientOk}
        onCancel={() => {
          setPatientModalVisible(false);
          setEditingPatient(null);
          patientForm.resetFields();
        }}
        width={600}
      >
        <Form form={patientForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="患者姓名" rules={[{ required: true, message: '请输入患者姓名' }]}>
                <Input placeholder="请输入患者姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
                <Select placeholder="请选择性别">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="age" label="年龄" rules={[{ required: true, message: '请输入年龄' }]}>
                <Input type="number" placeholder="请输入年龄" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contact" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="symptoms" label="症状描述" rules={[{ required: true, message: '请输入症状描述' }]}>
            <Input.TextArea placeholder="请输入症状描述" rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="area" label="就诊科室" rules={[{ required: true, message: '请选择就诊科室' }]}>
                <Select placeholder="请选择就诊科室">
                  <Option value="内科">内科</Option>
                  <Option value="外科">外科</Option>
                  <Option value="儿科">儿科</Option>
                  <Option value="妇产科">妇产科</Option>
                  <Option value="急诊科">急诊科</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder="请选择优先级">
                  <Option value="emergency">紧急</Option>
                  <Option value="high">高</Option>
                  <Option value="normal">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="emergency" label="是否急诊" valuePropName="checked">
            <Select placeholder="请选择是否急诊">
              <Option value={true}>是</Option>
              <Option value={false}>否</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 患者详情抽屉 */}
      <Drawer
        title="患者详细信息"
        placement="right"
        onClose={() => setDetailPatient(null)}
        open={!!detailPatient}
        width={500}
      >
        {detailPatient && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="姓名">{detailPatient.name}</Descriptions.Item>
            <Descriptions.Item label="性别">{detailPatient.gender}</Descriptions.Item>
            <Descriptions.Item label="年龄">{detailPatient.age}岁</Descriptions.Item>
            <Descriptions.Item label="联系电话">{detailPatient.contact}</Descriptions.Item>
            <Descriptions.Item label="症状描述">{detailPatient.symptoms}</Descriptions.Item>
            <Descriptions.Item label="就诊科室">{detailPatient.area}</Descriptions.Item>
            <Descriptions.Item label="优先级">
              <Tag color={getPriorityColor(detailPatient.priority)}>
                {getPriorityText(detailPatient.priority)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="当前状态">
              <Tag color={detailPatient.status === '待分诊' ? 'orange' : detailPatient.status === '已分诊' ? 'blue' : 'green'}>
                {detailPatient.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="等待时间">{detailPatient.waitTime}分钟</Descriptions.Item>
            <Descriptions.Item label="是否急诊">
              {detailPatient.emergency ? <Tag color="red">是</Tag> : <Tag color="green">否</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{new Date(detailPatient.createdAt).toLocaleString()}</Descriptions.Item>
            {detailPatient.assignedDoctor && (
              <Descriptions.Item label="分诊医生">{detailPatient.assignedDoctor}</Descriptions.Item>
            )}
            {detailPatient.triageTime && (
              <Descriptions.Item label="分诊时间">{detailPatient.triageTime}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
} 