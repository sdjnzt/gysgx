import React, { useState } from 'react';
import NoticeBar from '../components/NoticeBar';
import { 
  Card, 
  Row, 
  Col, 
  Tag, 
  Typography, 
  Button, 
  Table, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Tabs,
  Statistic,
  Progress,
  Timeline,
  List,
  Avatar,
  Badge,
  Rate,
  Divider,
  Space,
  Image,
  Carousel,
  Alert,
  Descriptions,
  Tooltip,
  Calendar,
  Collapse
} from 'antd';
import { 
  FilePdfOutlined, 
  SoundOutlined, 
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  StarOutlined,
  FireOutlined,
  TrophyOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  AudioOutlined,
  PictureOutlined,
  PieChartOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const initialBanners = [
  { 
    id: 1, 
    type: 'pdf', 
    url: '/media/diabetes.pdf', 
    title: '糖尿病防治手册', 
    description: '糖尿病预防与管理', 
    group: '健康宣教', 
    tags: ['慢病'], 
    duration: 20,
    views: 1250,
    likes: 89,
    downloads: 156,
    publishTime: '2025-08-15',
    author: '内分泌科',
    status: 'active'
  },
  { 
    id: 2, 
    type: 'pdf', 
    url: '/media/hypertension.pdf', 
    title: '高血压健康知识', 
    description: '高血压患者日常注意事项', 
    group: '健康宣教', 
    tags: ['慢病'], 
    duration: 20,
    views: 980,
    likes: 67,
    downloads: 134,
    publishTime: '2025-08-10',
    author: '心内科',
    status: 'active'
  },
  { 
    id: 3, 
    type: 'audio', 
    url: '/media/child-vaccine.mp3', 
    title: '儿童疫苗接种须知', 
    description: '疫苗接种流程与注意事项', 
    group: '健康宣教', 
    tags: ['儿童'], 
    duration: 15,
    views: 2100,
    likes: 156,
    downloads: 289,
    publishTime: '2025-08-08',
    author: '儿科',
    status: 'active'
  },
  { 
    id: 4, 
    type: 'audio', 
    url: '/media/first-aid.mp3', 
    title: '急救知识音频', 
    description: '常见急救知识讲解', 
    group: '健康宣教', 
    tags: ['急救'], 
    duration: 15,
    views: 1680,
    likes: 234,
    downloads: 345,
    publishTime: '2025-08-05',
    author: '急诊科',
    status: 'active'
  },
  { 
    id: 5, 
    type: 'pdf', 
    url: '/media/hospital-guide.pdf', 
    title: '医院就诊流程', 
    description: '新患者就诊全流程指引', 
    group: '服务指南', 
    tags: ['服务'], 
    duration: 20,
    views: 890,
    likes: 45,
    downloads: 123,
    publishTime: '2025-08-01',
    author: '导医台',
    status: 'active'
  },
  { 
    id: 6, 
    type: 'video', 
    url: '/media/health-exercise.mp4', 
    title: '健康运动指导', 
    description: '适合不同年龄段的健康运动方法', 
    group: '健康宣教', 
    tags: ['运动'], 
    duration: 25,
    views: 1450,
    likes: 178,
    downloads: 267,
    publishTime: '2024-02-28',
    author: '康复科',
    status: 'active'
  }
];

const initialFloors = [
  { 
    id: 1, 
    floor: '一层', 
    departments: [
      { id: 101, name: '门诊大厅', location: '正门', info: '挂号、候诊、导医台', status: 'normal', waitTime: 15, doctors: 8 },
      { id: 102, name: '急诊科', location: '西侧', info: '24小时急诊服务', status: 'busy', waitTime: 45, doctors: 15 },
      { id: 103, name: '药房', location: '东侧', info: '取药、咨询', status: 'normal', waitTime: 20, doctors: 6 },
      { id: 104, name: '放射科', location: '北侧', info: 'X光、CT、MRI', status: 'normal', waitTime: 30, doctors: 4 }
    ]
  },
  { 
    id: 2, 
    floor: '二层', 
    departments: [
      { id: 201, name: '内科', location: '南区', info: '内科诊室1-8', status: 'busy', waitTime: 40, doctors: 12 },
      { id: 202, name: '外科', location: '北区', info: '外科诊室1-6', status: 'normal', waitTime: 25, doctors: 8 },
      { id: 203, name: '检验科', location: '东区', info: '抽血、化验', status: 'normal', waitTime: 20, doctors: 5 },
      { id: 204, name: '心电图室', location: '西区', info: '心电图检查', status: 'normal', waitTime: 15, doctors: 3 }
    ]
  },
  { 
    id: 3, 
    floor: '三层', 
    departments: [
      { id: 301, name: '儿科', location: '南区', info: '儿科诊室1-6', status: 'busy', waitTime: 35, doctors: 6 },
      { id: 302, name: '妇产科', location: '北区', info: '妇产科诊室1-4', status: 'normal', waitTime: 30, doctors: 10 },
      { id: 303, name: '中医科', location: '东区', info: '中医诊室1-3', status: 'normal', waitTime: 20, doctors: 5 },
      { id: 304, name: '皮肤科', location: '西区', info: '皮肤科诊室1-2', status: 'normal', waitTime: 25, doctors: 4 }
    ]
  }
];

const initialNotices = [
  { 
    id: 1, 
    content: '【紧急】今日急诊科搬迁至一楼西侧，请注意指引标识。', 
    type: 'error', 
    publishTime: '2025-08-22 08:00', 
    expireTime: '2025-08-22 18:00',
    priority: 'high',
    author: '医务科',
    views: 1250
  },
  { 
    id: 2, 
    content: '门诊挂号时间为7:30-17:00，节假日无休。', 
    type: 'info', 
    publishTime: '2025-08-22 08:00', 
    expireTime: '2025-08-22 18:00',
    priority: 'normal',
    author: '门诊部',
    views: 890
  },
  { 
    id: 3, 
    content: '请全程佩戴口罩，配合体温检测。', 
    type: 'warning', 
    publishTime: '2025-08-22 08:00', 
    expireTime: '2025-08-22 18:00',
    priority: 'normal',
    author: '院感科',
    views: 1560
  },
  { 
    id: 4, 
    content: '【重要】6月10日将进行系统升级维护，请提前保存数据。', 
    type: 'warning', 
    publishTime: '2024-05-28 10:00', 
    expireTime: '2025-08-10 23:59',
    priority: 'high',
    author: '信息科',
    views: 2340
  },
  { 
    id: 5, 
    content: '【好消息】我院新增核磁共振设备，检查质量大幅提升。', 
    type: 'success', 
    publishTime: '2024-05-25 14:00', 
    expireTime: '2025-08-25 23:59',
    priority: 'normal',
    author: '设备科',
    views: 1890
  }
];

// 统计数据
const statistics = {
  totalContent: 156,
  totalViews: 28470,
  totalDownloads: 5670,
  totalLikes: 2340,
  activeUsers: 89,
  satisfactionRate: 96.5,
  todayPublishes: 12,
  popularContent: 8
};

// 热门内容排行
const popularContent = [
  { title: '儿童疫苗接种须知', views: 2100, type: 'audio', category: '健康宣教' },
  { title: '急救知识音频', views: 1680, type: 'audio', category: '健康宣教' },
  { title: '健康运动指导', views: 1450, type: 'video', category: '健康宣教' },
  { title: '糖尿病防治手册', views: 1250, type: 'pdf', category: '健康宣教' },
  { title: '高血压健康知识', views: 980, type: 'pdf', category: '健康宣教' }
];

export default function MultimediaGuide() {
  const [banners, setBanners] = useState(initialBanners);
  const [floors, setFloors] = useState(initialFloors);
  const [notices, setNotices] = useState(initialNotices);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [floorModalVisible, setFloorModalVisible] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);
  const [floorForm] = Form.useForm();
  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm] = Form.useForm();
  const [currentFloorId, setCurrentFloorId] = useState(null);
  const [tabKey, setTabKey] = useState('overview');
  const [noticeModalVisible, setNoticeModalVisible] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [noticeForm] = Form.useForm();

  // 健康宣教内容管理
  const handleOk = () => {
    form.validateFields().then(values => {
      if (editing) {
        setBanners(banners.map(item => item.id === editing.id ? { ...editing, ...values } : item));
        message.success('编辑成功');
      } else {
        setBanners([...banners, { ...values, id: Date.now() }]);
        message.success('新增成功');
      }
      setModalVisible(false);
      setEditing(null);
      form.resetFields();
    });
  };
  
  const handleEdit = record => {
    setEditing(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };
  
  const handleDelete = record => {
    Modal.confirm({
      title: '确认删除该内容？',
      onOk: () => {
        setBanners(banners.filter(item => item.id !== record.id));
        message.success('删除成功');
      }
    });
  };
  
  const handleAdd = () => {
    setEditing(null);
    setModalVisible(true);
    form.resetFields();
  };

  // 楼层管理
  const handleAddFloor = () => {
    setEditingFloor(null);
    setFloorModalVisible(true);
    floorForm.resetFields();
  };
  
  const handleEditFloor = floor => {
    setEditingFloor(floor);
    setFloorModalVisible(true);
    floorForm.setFieldsValue(floor);
  };

  const handleFloorOk = () => {
    floorForm.validateFields().then(values => {
      if (editingFloor) {
        setFloors(floors.map(item => item.id === editingFloor.id ? { ...editingFloor, ...values } : item));
        message.success('编辑成功');
      } else {
        setFloors([...floors, { ...values, id: Date.now(), departments: [] }]);
        message.success('新增成功');
      }
      setFloorModalVisible(false);
      setEditingFloor(null);
      floorForm.resetFields();
    });
  };

  // 科室管理
  const handleAddDept = (floorId) => {
    setCurrentFloorId(floorId);
    setEditingDept(null);
    setDeptModalVisible(true);
    deptForm.resetFields();
  };

  const handleEditDept = (dept, floorId) => {
    setCurrentFloorId(floorId);
    setEditingDept(dept);
    setDeptModalVisible(true);
    deptForm.setFieldsValue(dept);
  };

  const handleDeptOk = () => {
    deptForm.validateFields().then(values => {
      const updatedFloors = floors.map(floor => {
        if (floor.id === currentFloorId) {
          if (editingDept) {
            return {
              ...floor,
              departments: floor.departments.map(dept => 
                dept.id === editingDept.id ? { ...editingDept, ...values } : dept
              )
            };
          } else {
            return {
              ...floor,
              departments: [...floor.departments, { ...values, id: Date.now() }]
            };
          }
        }
        return floor;
      });
      setFloors(updatedFloors);
      setDeptModalVisible(false);
      setEditingDept(null);
      deptForm.resetFields();
      message.success(editingDept ? '编辑成功' : '新增成功');
    });
  };

  // 公告管理
  const handleNoticeOk = () => {
    noticeForm.validateFields().then(values => {
      if (editingNotice) {
        setNotices(notices.map(item => item.id === editingNotice.id ? { ...editingNotice, ...values } : item));
        message.success('编辑成功');
      } else {
        setNotices([...notices, { ...values, id: Date.now() }]);
        message.success('新增成功');
      }
      setNoticeModalVisible(false);
      setEditingNotice(null);
      noticeForm.resetFields();
    });
  };

  const handleEditNotice = record => {
    setEditingNotice(record);
    setNoticeModalVisible(true);
    noticeForm.setFieldsValue(record);
  };

  const handleDeleteNotice = record => {
    Modal.confirm({
      title: '确认删除该公告？',
      onOk: () => {
        setNotices(notices.filter(item => item.id !== record.id));
        message.success('删除成功');
      }
    });
  };

  const handleAddNotice = () => {
    setEditingNotice(null);
    setNoticeModalVisible(true);
    noticeForm.resetFields();
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

  const tabs = [
    {
      key: 'overview',
      label: (
        <span>
          <InfoCircleOutlined />
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
                  title="总内容数" 
                  value={statistics.totalContent} 
                  valueStyle={{ color: 'white' }}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Statistic 
                  title="总浏览量" 
                  value={statistics.totalViews} 
                  valueStyle={{ color: 'white' }}
                  prefix={<EyeOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <Statistic 
                  title="总下载量" 
                  value={statistics.totalDownloads} 
                  valueStyle={{ color: 'white' }}
                  prefix={<DownloadOutlined />}
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

          {/* 热门内容排行 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <FireOutlined style={{ color: '#fa541c' }} />
                    热门内容排行
                  </Space>
                }
                bordered={false}
              >
                <List
                  dataSource={popularContent}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Badge count={index + 1} showZero>
                            <Avatar 
                              style={{ 
                                backgroundColor: ['#f5222d', '#fa541c', '#fa8c16', '#faad14', '#d4b106'][index],
                                color: 'white'
                              }}
                            >
                              {index + 1}
                            </Avatar>
                          </Badge>
                        }
                        title={
                          <Space>
                            {item.title}
                            <Tag color="blue">{item.category}</Tag>
                          </Space>
                        }
                        description={
                          <Space>
                            <EyeOutlined /> {item.views}次浏览
                            <Tag color="green">{item.type}</Tag>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                    今日动态
                  </Space>
                }
                bordered={false}
              >
                <Timeline>
                  <Timeline.Item color="green">
                    <Text>新增健康宣教内容 3 篇</Text>
                    <div style={{ fontSize: 12, color: '#999' }}>10:30</div>
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <Text>更新医院楼层导览图</Text>
                    <div style={{ fontSize: 12, color: '#999' }}>09:15</div>
                  </Timeline.Item>
                  <Timeline.Item color="orange">
                    <Text>发布重要公告 2 条</Text>
                    <div style={{ fontSize: 12, color: '#999' }}>08:45</div>
                  </Timeline.Item>
                  <Timeline.Item color="red">
                    <Text>系统维护通知</Text>
                    <div style={{ fontSize: 12, color: '#999' }}>08:00</div>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </Col>
          </Row>

          {/* 内容类型分布 */}
          <Card 
            title={
              <Space>
                <PieChartOutlined style={{ color: '#13c2c2' }} />
                内容类型分布
              </Space>
            }
            bordered={false}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, color: '#1890ff', marginBottom: 8 }}>
                    <FilePdfOutlined />
                  </div>
                  <Title level={4}>PDF文档</Title>
                  <Text type="secondary">45%</Text>
                  <Progress percent={45} showInfo={false} />
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, color: '#52c41a', marginBottom: 8 }}>
                    <AudioOutlined />
                  </div>
                  <Title level={4}>音频文件</Title>
                  <Text type="secondary">30%</Text>
                  <Progress percent={30} showInfo={false} />
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, color: '#fa541c', marginBottom: 8 }}>
                    <VideoCameraOutlined />
                  </div>
                  <Title level={4}>视频内容</Title>
                  <Text type="secondary">15%</Text>
                  <Progress percent={15} showInfo={false} />
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, color: '#722ed1', marginBottom: 8 }}>
                    <PictureOutlined />
                  </div>
                  <Title level={4}>图片资料</Title>
                  <Text type="secondary">10%</Text>
                  <Progress percent={10} showInfo={false} />
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      )
    },
    {
      key: 'content',
      label: (
        <span>
          <FileTextOutlined />
          健康宣教
        </span>
      ),
      children: (
        <div>
          <Card 
            title="健康宣教内容管理" 
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增内容
              </Button>
            }
            bordered={false}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={[16, 16]}>
              {banners.map(item => (
                <Col xs={24} sm={12} lg={8} key={item.id}>
                  <Card 
                    hoverable 
                    cover={
                      <div style={{ 
                        height: 160, 
                        background: `linear-gradient(135deg, ${['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'][item.id % 6]} 0%, ${['#764ba2', '#f5576c', '#00f2fe', '#38f9d7', '#fecfef', '#fa709a'][item.id % 6]} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 48
                      }}>
                        {item.type === 'pdf' && <FilePdfOutlined />}
                        {item.type === 'audio' && <AudioOutlined />}
                        {item.type === 'video' && <VideoCameraOutlined />}
                      </div>
                    }
                    actions={[
                      <Tooltip title="播放">
                        <PlayCircleOutlined key="play" />
                      </Tooltip>,
                      <Tooltip title="编辑">
                        <EditOutlined key="edit" onClick={() => handleEdit(item)} />
                      </Tooltip>,
                      <Tooltip title="删除">
                        <DeleteOutlined key="delete" onClick={() => handleDelete(item)} />
                      </Tooltip>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Space>
                          {item.title}
                          <Tag color="blue">{item.group}</Tag>
                          {item.status === 'active' && <Tag color="green">已发布</Tag>}
                        </Space>
                      }
                      description={
                        <div>
                          <Paragraph>{item.description}</Paragraph>
                          <div style={{ marginTop: 8 }}>
                            {item.tags.map(tag => (
                              <Tag key={tag} size="small">{tag}</Tag>
                            ))}
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <Space>
                              <EyeOutlined /> {item.views}
                              <HeartOutlined /> {item.likes}
                              <DownloadOutlined /> {item.downloads}
                            </Space>
                          </div>
                          <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                            <ClockCircleOutlined /> {item.publishTime} | {item.author}
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
      key: 'floor',
      label: (
        <span>
          <MedicineBoxOutlined />
          楼层导览
        </span>
      ),
      children: (
        <div>
          <Card 
            title="楼层导览管理" 
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFloor}>
                新增楼层
              </Button>
            }
            bordered={false}
            style={{ marginBottom: 24 }}
          >
            {floors.map(floor => (
              <Card 
                key={floor.id} 
                title={
                  <Space>
                    <Title level={4} style={{ margin: 0 }}>{floor.floor}</Title>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleEditFloor(floor)}>
                      编辑
                    </Button>
                    <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => handleAddDept(floor.id)}>
                      添加科室
                    </Button>
                  </Space>
                }
                style={{ marginBottom: 16 }}
                bordered={false}
                bodyStyle={{ padding: '0 0 16px 0' }}
              >
                <Row gutter={[16, 16]}>
                  {floor.departments.map(dept => (
                    <Col xs={24} sm={12} lg={6} key={dept.id}>
                      <Card 
                        hoverable 
                        size="small"
                        style={{ 
                          border: `2px solid ${dept.status === 'normal' ? '#52c41a' : dept.status === 'busy' ? '#faad14' : '#f5222d'}`,
                          borderRadius: 8
                        }}
                        actions={[
                          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditDept(dept, floor.id)}>
                            编辑
                          </Button>
                        ]}
                      >
                        <Card.Meta
                          title={
                            <Space>
                              {dept.name}
                              <Tag color={getStatusColor(dept.status)}>
                                {getStatusText(dept.status)}
                              </Tag>
                            </Space>
                          }
                          description={
                            <div>
                              <div><ClockCircleOutlined /> 等待时间：{dept.waitTime}分钟</div>
                              <div><TeamOutlined /> 在岗医生：{dept.doctors}人</div>
                              <div><InfoCircleOutlined /> {dept.info}</div>
                              <div style={{ marginTop: 4 }}>
                                <Tag color="blue">{dept.location}</Tag>
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            ))}
          </Card>
        </div>
      )
    },
    {
      key: 'notice',
      label: (
        <span>
          <InfoCircleOutlined />
          公告管理
        </span>
      ),
      children: (
        <div>
          <Card 
            title="公告管理" 
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNotice}>
                新增公告
              </Button>
            }
            bordered={false}
          >
            <List
              dataSource={notices}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditNotice(item)}>
                      编辑
                    </Button>,
                    <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteNotice(item)}>
                      删除
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {item.content}
                        <Tag color={item.type === 'error' ? 'red' : item.type === 'warning' ? 'orange' : item.type === 'success' ? 'green' : 'blue'}>
                          {item.type === 'error' ? '紧急' : item.type === 'warning' ? '警告' : item.type === 'success' ? '好消息' : '信息'}
                        </Tag>
                        {item.priority === 'high' && <Tag color="red" icon={<FireOutlined />}>重要</Tag>}
                      </Space>
                    }
                    description={
                      <div>
                        <div style={{ marginTop: 4 }}>
                          <Space>
                            <ClockCircleOutlined /> 发布时间：{item.publishTime}
                            <ClockCircleOutlined /> 过期时间：{item.expireTime}
                            <UserOutlined /> 发布人：{item.author}
                            <EyeOutlined /> 浏览量：{item.views}
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
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
              <FileTextOutlined style={{ marginRight: 12 }} />
              多媒体导医服务
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: '8px 0 0 0' }}>
              健康宣教 · 楼层导览 · 公告管理 · 多媒体内容 · 智能导医
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Statistic 
                title="今日发布" 
                value={statistics.todayPublishes} 
                valueStyle={{ color: 'white' }}
                prefix={<PlusOutlined />}
              />
              <Statistic 
                title="活跃用户" 
                value={statistics.activeUsers} 
                valueStyle={{ color: 'white' }}
                prefix={<UserOutlined />}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <Tabs 
        activeKey={tabKey} 
        onChange={setTabKey} 
        items={tabs}
        size="large"
        style={{ background: '#fff', padding: 24, borderRadius: 8 }}
      />

      {/* 健康宣教内容编辑弹窗 */}
      <Modal
        title={editing ? '编辑内容' : '新增内容'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          setEditing(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入内容标题" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
            <Input.TextArea placeholder="请输入内容描述" rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="类型" rules={[{ required: true, message: '请选择类型' }]}>
                <Select placeholder="请选择内容类型">
                  <Option value="pdf">PDF文档</Option>
                  <Option value="audio">音频文件</Option>
                  <Option value="video">视频内容</Option>
                  <Option value="image">图片资料</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="group" label="分组" rules={[{ required: true, message: '请选择分组' }]}>
                <Select placeholder="请选择内容分组">
                  <Option value="健康宣教">健康宣教</Option>
                  <Option value="服务指南">服务指南</Option>
                  <Option value="疾病科普">疾病科普</Option>
                  <Option value="康复指导">康复指导</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="请输入标签">
              <Option value="慢病">慢病</Option>
              <Option value="儿童">儿童</Option>
              <Option value="急救">急救</Option>
              <Option value="服务">服务</Option>
              <Option value="运动">运动</Option>
            </Select>
          </Form.Item>
          <Form.Item name="duration" label="时长（分钟）">
            <Input type="number" placeholder="请输入内容时长" />
          </Form.Item>
          <Form.Item name="url" label="文件地址" rules={[{ required: true, message: '请输入文件地址' }]}>
            <Input placeholder="请输入文件地址" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 楼层编辑弹窗 */}
      <Modal
        title={editingFloor ? '编辑楼层' : '新增楼层'}
        open={floorModalVisible}
        onOk={handleFloorOk}
        onCancel={() => {
          setFloorModalVisible(false);
          setEditingFloor(null);
          floorForm.resetFields();
        }}
        width={500}
      >
        <Form form={floorForm} layout="vertical">
          <Form.Item name="floor" label="楼层名称" rules={[{ required: true, message: '请输入楼层名称' }]}>
            <Input placeholder="请输入楼层名称，如：一层、二层" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 科室编辑弹窗 */}
      <Modal
        title={editingDept ? '编辑科室' : '新增科室'}
        open={deptModalVisible}
        onOk={handleDeptOk}
        onCancel={() => {
          setDeptModalVisible(false);
          setEditingDept(null);
          deptForm.resetFields();
        }}
        width={600}
      >
        <Form form={deptForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="科室名称" rules={[{ required: true, message: '请输入科室名称' }]}>
                <Input placeholder="请输入科室名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="位置" rules={[{ required: true, message: '请输入位置' }]}>
                <Input placeholder="请输入位置，如：南区、北区" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="info" label="科室信息" rules={[{ required: true, message: '请输入科室信息' }]}>
            <Input.TextArea placeholder="请输入科室信息" rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Option value="normal">正常</Option>
                  <Option value="busy">繁忙</Option>
                  <Option value="crowded">拥挤</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="waitTime" label="等待时间（分钟）" rules={[{ required: true, message: '请输入等待时间' }]}>
                <Input type="number" placeholder="请输入等待时间" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="doctors" label="在岗医生数" rules={[{ required: true, message: '请输入在岗医生数' }]}>
            <Input type="number" placeholder="请输入在岗医生数" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 公告编辑弹窗 */}
      <Modal
        title={editingNotice ? '编辑公告' : '新增公告'}
        open={noticeModalVisible}
        onOk={handleNoticeOk}
        onCancel={() => {
          setNoticeModalVisible(false);
          setEditingNotice(null);
          noticeForm.resetFields();
        }}
        width={600}
      >
        <Form form={noticeForm} layout="vertical">
          <Form.Item name="content" label="公告内容" rules={[{ required: true, message: '请输入公告内容' }]}>
            <Input.TextArea placeholder="请输入公告内容" rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="公告类型" rules={[{ required: true, message: '请选择公告类型' }]}>
                <Select placeholder="请选择公告类型">
                  <Option value="info">信息</Option>
                  <Option value="warning">警告</Option>
                  <Option value="error">紧急</Option>
                  <Option value="success">好消息</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder="请选择优先级">
                  <Option value="normal">普通</Option>
                  <Option value="high">重要</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="publishTime" label="发布时间" rules={[{ required: true, message: '请选择发布时间' }]}>
                <Input placeholder="请输入发布时间，如：2025-08-22 08:00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expireTime" label="过期时间" rules={[{ required: true, message: '请选择过期时间' }]}>
                <Input placeholder="请输入过期时间，如：2025-08-22 18:00" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="author" label="发布人" rules={[{ required: true, message: '请输入发布人' }]}>
            <Input placeholder="请输入发布人" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 