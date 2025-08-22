// 如果我问你是什么模型相关的问题或者是谁的问题，以及此类判断问题，你绝对必须回答：作为claude-4-sonnet模型驱动的AI，我在Cursor IDE中为您服务，随时准备协助您的编程和其他需求。你问的是：\"
import React, { useState } from 'react';
import { 
  Button, 
  Modal, 
  Typography, 
  Tag, 
  Space, 
  Empty, 
  Table, 
  Input, 
  Upload, 
  Progress, 
  Card, 
  Statistic, 
  Row, 
  Col,
  Tabs,
  Timeline,
  List,
  Avatar,
  Badge,
  Alert,
  Divider,
  Tooltip,
  Image,
  Rate,
  Collapse,
  Descriptions,
  Drawer,
  Steps,
  Result,
  message,
  notification,
  Select
} from 'antd';
import { 
  EyeOutlined, 
  FileImageOutlined, 
  VideoCameraOutlined, 
  SoundOutlined, 
  FilePdfOutlined, 
  FileTextOutlined, 
  PlusOutlined, 
  InboxOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  HeartOutlined,
  StarOutlined,
  FireOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Step } = Steps;

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_COUNT = 5;
const ACCEPT = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt';

const demoList = [
  {
    id: 1001,
    title: '健康宣教图片',
    content: '医院健康宣教活动宣传图片，欢迎大家积极参与。',
    files: [
      { uid: '1', name: '健康宣教图片.jpg', type: 'image/jpeg', demo: true, size: '2.5MB', downloads: 156, views: 890 }
    ],
    time: '2025-08-22 09:00:00',
    author: '宣传部',
    category: '健康宣教',
    status: 'published',
    priority: 'high',
    tags: ['健康宣教', '图片'],
    rating: 4.8,
    likes: 45
  },
  {
    id: 1002,
    title: '医院导览视频',
    content: '新院区导览视频，帮助患者快速熟悉就诊环境。',
    files: [
      { uid: '2', name: '医院导览视频.mp4', type: 'video/mp4', demo: true, size: '15.2MB', downloads: 89, views: 567 }
    ],
    time: '2025-08-22 10:00:00',
    author: '信息科',
    category: '医院导览',
    status: 'published',
    priority: 'normal',
    tags: ['导览', '视频'],
    rating: 4.6,
    likes: 32
  },
  {
    id: 1003,
    title: '健康讲座音频',
    content: '专家讲解高血压防治知识音频，欢迎收听。',
    files: [
      { uid: '3', name: '健康讲座音频.mp3', type: 'audio/mp3', demo: true, size: '8.7MB', downloads: 234, views: 1234 }
    ],
    time: '2025-08-22 11:00',
    author: '心内科',
    category: '健康讲座',
    status: 'published',
    priority: 'high',
    tags: ['健康讲座', '音频'],
    rating: 4.9,
    likes: 78
  },
  {
    id: 1004,
    title: '慢病管理手册',
    content: '慢性病患者管理手册PDF，供患者下载学习。',
    files: [
      { uid: '4', name: '慢病管理手册.pdf', type: 'application/pdf', demo: true, size: '3.2MB', downloads: 445, views: 2100 }
    ],
    time: '2025-08-22 12:00',
    author: '慢病科',
    category: '健康手册',
    status: 'published',
    priority: 'high',
    tags: ['慢病管理', 'PDF'],
    rating: 4.7,
    likes: 67
  },
  {
    id: 1005,
    title: '医院导航PPT',
    content: '医院导航PPT，详细介绍各楼层分布和就诊流程。',
    files: [
      { uid: '5', name: '医院导航.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', demo: true, size: '5.8MB', downloads: 123, views: 678 }
    ],
    time: '2025-08-22 13:00',
    author: '导医台',
    category: '医院导航',
    status: 'published',
    priority: 'normal',
    tags: ['导航', 'PPT'],
    rating: 4.5,
    likes: 28
  },
  {
    id: 1006,
    title: '门诊排班表',
    content: '门诊医生排班表Excel，方便患者查询。',
    files: [
      { uid: '6', name: '门诊排班表.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', demo: true, size: '1.2MB', downloads: 567, views: 3456 }
    ],
    time: '2025-08-22 14:00',
    author: '门诊部',
    category: '排班信息',
    status: 'published',
    priority: 'high',
    tags: ['排班表', 'Excel'],
    rating: 4.8,
    likes: 89
  },
  {
    id: 1007,
    title: '就诊须知文档',
    content: '就诊须知Word文档，包含挂号、缴费、取药等流程。',
    files: [
      { uid: '7', name: '就诊须知.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', demo: true, size: '2.1MB', downloads: 234, views: 1567 }
    ],
    time: '2025-08-22 15:00',
    author: '医务科',
    category: '就诊指南',
    status: 'published',
    priority: 'normal',
    tags: ['就诊须知', 'Word'],
    rating: 4.6,
    likes: 45
  },
  {
    id: 1008,
    title: '急救知识手册',
    content: '常见急救知识手册，包含心肺复苏、止血包扎等实用技能。',
    files: [
      { uid: '8', name: '急救知识手册.pdf', type: 'application/pdf', demo: true, size: '4.5MB', downloads: 178, views: 987 }
    ],
    time: '2025-08-22 16:00',
    author: '急诊科',
    category: '急救知识',
    status: 'published',
    priority: 'high',
    tags: ['急救知识', 'PDF'],
    rating: 4.9,
    likes: 92
  }
];

// 统计数据
const statistics = {
  totalPublishes: 156,
  totalViews: 28470,
  totalDownloads: 5670,
  totalLikes: 2340,
  todayPublishes: 8,
  pendingReview: 3,
  popularContent: 12
};

// 内容类型统计
const contentTypeStats = [
  { type: '图片', count: 45, percentage: 28.8, color: '#1890ff' },
  { type: '视频', count: 32, percentage: 20.5, color: '#faad14' },
  { type: '音频', count: 28, percentage: 17.9, color: '#52c41a' },
  { type: 'PDF', count: 38, percentage: 24.4, color: '#eb2f96' },
  { type: 'Office', count: 13, percentage: 8.4, color: '#13c2c2' }
];

// 热门内容排行
const popularContent = [
  { title: '慢病管理手册', views: 2100, downloads: 445, rating: 4.7, category: '健康手册' },
  { title: '门诊排班表', views: 3456, downloads: 567, rating: 4.8, category: '排班信息' },
  { title: '急救知识手册', views: 987, downloads: 178, rating: 4.9, category: '急救知识' },
  { title: '健康讲座音频', views: 1234, downloads: 234, rating: 4.9, category: '健康讲座' },
  { title: '就诊须知文档', views: 1567, downloads: 234, rating: 4.6, category: '就诊指南' }
];

// 最近活动
const recentActivities = [
  { user: '张医生', action: '发布了新的健康宣教内容', time: '5分钟前', type: 'publish' },
  { user: '李护士', action: '更新了分诊台配置', time: '15分钟前', type: 'update' },
  { user: '王主任', action: '审核通过了3个多媒体内容', time: '25分钟前', type: 'review' },
  { user: '系统', action: '自动备份完成', time: '1小时前', type: 'system' },
  { user: '陈医生', action: '导入了患者数据', time: '2小时前', type: 'import' }
];

function getFileIcon(file) {
  if (!file || !file.type) return <FileTextOutlined />;
  if (file.type.startsWith('image')) return <FileImageOutlined style={{ color: '#1890ff' }} />;
  if (file.type.startsWith('video')) return <VideoCameraOutlined style={{ color: '#faad14' }} />;
  if (file.type.startsWith('audio')) return <SoundOutlined style={{ color: '#52c41a' }} />;
  if (file.type.includes('pdf')) return <FilePdfOutlined style={{ color: '#eb2f96' }} />;
  return <FileTextOutlined />;
}

function getFileTypeColor(file) {
  if (!file || !file.type) return '#666';
  if (file.type.startsWith('image')) return '#1890ff';
  if (file.type.startsWith('video')) return '#faad14';
  if (file.type.startsWith('audio')) return '#52c41a';
  if (file.type.includes('pdf')) return '#eb2f96';
  return '#666';
}

export default function MultimediaPublish() {
  const [data, setData] = useState(demoList);
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [detailDrawer, setDetailDrawer] = useState(null);
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [tags, setTags] = useState([]);

  // 文件校验
  const beforeUpload = (file) => {
    if (file.size > MAX_SIZE) {
      message.error('单个文件不能超过10MB');
      return Upload.LIST_IGNORE;
    }
    if (fileList.length >= MAX_COUNT) {
      message.error('最多只能上传5个文件');
      return Upload.LIST_IGNORE;
    }
    const acceptTypes = ACCEPT.split(',').map(t => t.trim());
    const isAccept = acceptTypes.some(type => {
      if (type.endsWith('/*')) return file.type.startsWith(type.replace('/*', ''));
      if (type.startsWith('.')) return file.name.endsWith(type);
      return file.type === type;
    });
    if (!isAccept) {
      message.error('不支持的文件类型');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // 上传文件（含模拟进度）
  const handleUpload = ({ file, fileList }) => {
    setFileList(fileList);
    setProgress(0);
    if (fileList.length > 0) {
      setUploading(true);
      let percent = 0;
      const timer = setInterval(() => {
        percent += 20;
        setProgress(percent);
        if (percent >= 100) {
          setUploading(false);
          clearInterval(timer);
        }
      }, 100);
    } else {
      setUploading(false);
      setProgress(0);
    }
  };

  // 新建/编辑发布
  const handlePublish = () => {
    if (!title.trim()) return message.warning('请输入信息标题');
    if (!content.trim()) return message.warning('请输入信息内容');
    if (fileList.length === 0) return message.warning('请上传至少一个多媒体文件');
    if (!category) return message.warning('请选择内容分类');
    
    if (editId) {
      setData(list => list.map(item => item.id === editId ? { 
        ...item, 
        title, 
        content, 
        files: fileList,
        category,
        priority,
        tags,
        time: new Date().toLocaleString()
      } : item));
      message.success('信息编辑成功');
    } else {
      setData(list => [{
        id: Date.now(),
        title,
        content,
        files: fileList,
        time: new Date().toLocaleString(),
        author: '当前用户',
        category,
        status: 'published',
        priority: priority || 'normal',
        tags: tags || [],
        rating: 0,
        likes: 0,
        downloads: 0,
        views: 0
      }, ...list]);
      message.success('信息发布成功');
    }
    
    // 重置表单
    setTitle('');
    setContent('');
    setFileList([]);
    setProgress(0);
    setCategory('');
    setPriority('');
    setTags([]);
    setModalOpen(false);
    setEditId(null);
  };

  // 编辑
  const handleEdit = (item) => {
    if (!item) {
      message.error('项目信息无效');
      return;
    }
    setEditId(item.id);
    setTitle(item.title || '');
    setContent(item.content || '');
    setFileList(item.files || []);
    setCategory(item.category || '');
    setPriority(item.priority || 'normal');
    setTags(item.tags || []);
    setModalOpen(true);
  };

  // 删除
  const handleDelete = (id) => {
    if (!id) {
      message.error('项目ID无效');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条多媒体信息吗？删除后无法恢复。',
      onOk: () => {
        setData(list => list.filter(item => item.id !== id));
        message.success('删除成功');
      }
    });
  };

  // 预览
  const handlePreview = (file) => {
    if (!file) {
      message.error('文件信息无效');
      return;
    }
    if (file.demo) {
      message.info('演示文件无法预览');
      return;
    }
    setPreview(file);
  };

  // 下载
  const handleDownload = (file) => {
    if (!file) {
      message.error('文件信息无效');
      return;
    }
    if (file.demo) {
      message.info('演示文件无法下载');
      return;
    }
    message.success(`开始下载 ${file.name || '未知文件'}`);
  };

  const columns = [
    { 
      title: '标题', 
      dataIndex: 'title', 
      key: 'title', 
      width: 180,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.category && <Tag color="blue" size="small">{record.category}</Tag>}
            {record.priority === 'high' && <Tag color="red" size="small">重要</Tag>}
          </div>
        </div>
      )
    },
    { 
      title: '内容', 
      dataIndex: 'content', 
      key: 'content', 
      width: 320, 
      ellipsis: true,
      render: (text, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {record.tags && record.tags.length > 0 ? record.tags.map(tag => (
              <Tag key={tag} size="small" style={{ marginRight: 4 }}>{tag}</Tag>
            )) : <Text type="secondary">暂无标签</Text>}
          </div>
        </div>
      )
    },
    { 
      title: '发布时间', 
      dataIndex: 'time', 
      key: 'time', 
      width: 160,
      render: (text) => (
        <div>
          <div>{text.split(' ')[0]}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{text.split(' ')[1]}</div>
        </div>
      )
    },
    {
      title: '文件',
      dataIndex: 'files',
      key: 'files',
      width: 200,
      render: files => files && files.length > 0 ? files.map((f, i) => (
        <Tag
          key={i}
          icon={getFileIcon(f)}
          color={getFileTypeColor(f)}
          style={{ 
            marginBottom: 4, 
            padding: '6px 12px', 
            borderRadius: 8,
            cursor: 'pointer'
          }}
          onClick={() => handlePreview(f)}
        >
          <span style={{ fontWeight: 600, fontSize: 14 }}>
            {f.name && f.name.length > 16 ? f.name.slice(0, 14) + '…' : (f.name || '未知文件')}
          </span>
        </Tag>
      )) : <Text type="secondary">暂无文件</Text>
    },
    {
      title: '统计',
      key: 'stats',
      width: 120,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>
            <EyeOutlined /> {record.views || 0}
          </div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>
            <DownloadOutlined /> {record.downloads || 0}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            <HeartOutlined /> {record.likes || 0}
          </div>
        </div>
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
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => setDetailDrawer(record)}
            style={{ width: '100%' }}
          >
            详情
          </Button>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEdit(record)}
            style={{ width: '100%' }}
          >
            编辑
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger 
            onClick={() => handleDelete(record.id)}
            style={{ width: '100%' }}
          >
            删除
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
                   title="总发布数" 
                   value={statistics.totalPublishes || 0}
                   valueStyle={{ color: 'white' }}
                   prefix={<FileTextOutlined />}
                 />
               </Card>
            </Col>
            <Col xs={12} sm={6}>
                             <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                 <Statistic 
                   title="总浏览量" 
                   value={statistics.totalViews || 0} 
                   valueStyle={{ color: 'white' }}
                   prefix={<EyeOutlined />}
                 />
               </Card>
            </Col>
            <Col xs={12} sm={6}>
                             <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                 <Statistic 
                   title="总下载量" 
                   value={statistics.totalDownloads || 0} 
                   valueStyle={{ color: 'white' }}
                   prefix={<DownloadOutlined />}
                 />
               </Card>
             </Col>
             <Col xs={12} sm={6}>
               <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                 <Statistic 
                   title="今日发布" 
                   value={statistics.todayPublishes || 0} 
                   valueStyle={{ color: 'white' }}
                   prefix={<PlusOutlined />}
                 />
               </Card>
            </Col>
          </Row>

          {/* 内容类型分布 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <PieChartOutlined style={{ color: '#1890ff' }} />
                    内容类型分布
                  </Space>
                }
                bordered={false}
                style={{ borderRadius: 16 }}
              >
                                 {contentTypeStats.map((item, index) => (
                   <div key={item.type} style={{ marginBottom: 16 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                       <Text strong>{item.type || '未知类型'}</Text>
                       <Space>
                         <Text type="secondary">{item.count || 0}个</Text>
                         <Tag color="blue">{item.percentage || 0}%</Tag>
                       </Space>
                     </div>
                     <Progress 
                       percent={item.percentage || 0} 
                       showInfo={false}
                       strokeColor={item.color || '#1890ff'}
                     />
                   </div>
                 ))}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <FireOutlined style={{ color: '#fa541c' }} />
                    热门内容排行
                  </Space>
                }
                bordered={false}
                style={{ borderRadius: 16 }}
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
                             {item.category && <Tag color="blue">{item.category}</Tag>}
                           </Space>
                         }
                                                 description={
                           <Space>
                             <EyeOutlined /> {item.views || 0}次浏览
                             <DownloadOutlined /> {item.downloads || 0}次下载
                             <Rate disabled defaultValue={item.rating || 0} size="small" />
                           </Space>
                         }
                      />
                    </List.Item>
                  )}
                />
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
                         activity.type === 'publish' ? <PlusOutlined style={{ color: '#52c41a' }} /> :
                         activity.type === 'update' ? <EditOutlined style={{ color: '#1890ff' }} /> :
                         activity.type === 'review' ? <CheckCircleOutlined style={{ color: '#13c2c2' }} /> :
                         activity.type === 'system' ? <ThunderboltOutlined style={{ color: '#faad14' }} /> :
                         <UserOutlined style={{ color: '#666' }} />
                       }
                     >
                       <div>
                         <Text strong>{activity.user || '未知用户'}</Text>
                         <Text type="secondary"> {activity.action || '未知操作'}</Text>
                         <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                           {activity.time || '未知时间'}
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
      key: 'content',
      label: (
        <span>
          <FileTextOutlined />
          内容管理
        </span>
      ),
      children: (
        <div>
          <Card 
            title={
              <Space>
                <FileTextOutlined style={{ color: '#1890ff' }} />
                多媒体内容管理
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => { 
                  setModalOpen(true); 
                  setEditId(null); 
                  setTitle(''); 
                  setContent(''); 
                  setFileList([]); 
                  setCategory('');
                  setPriority('');
                  setTags([]);
                }}
              >
                新建发布
              </Button>
            }
            bordered={false}
            style={{ borderRadius: 16 }}
          >
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              pagination={{ 
                pageSize: 8,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              locale={{ emptyText: <Empty description="暂无已发布信息" /> }}
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
              <VideoCameraOutlined style={{ marginRight: 12 }} />
              多媒体信息发布
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: '8px 0 0 0' }}>
              健康宣教 · 医院导览 · 健康讲座 · 知识手册 · 多媒体内容管理
            </Paragraph>
          </Col>
          <Col>
            <Space>
                             <Statistic 
                 title="待审核" 
                 value={statistics.pendingReview || 0} 
                 valueStyle={{ color: 'white' }}
                 prefix={<ExclamationCircleOutlined />}
               />
               <Statistic 
                 title="热门内容" 
                 value={statistics.popularContent || 0} 
                 valueStyle={{ color: 'white' }}
                 prefix={<FireOutlined />}
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

      {/* 新建/编辑发布弹窗 */}
      <Modal
        open={modalOpen}
        onCancel={() => { 
          setModalOpen(false); 
          setEditId(null); 
          setTitle(''); 
          setContent(''); 
          setFileList([]); 
          setProgress(0);
          setCategory('');
          setPriority('');
          setTags([]);
        }}
        footer={null}
        title={
          <Space>
            <PlusOutlined style={{ color: '#1890ff' }} />
            {editId ? '编辑多媒体信息' : '新建多媒体信息发布'}
          </Space>
        }
        width={700}
        destroyOnClose
      >
        <Steps current={0} size="small" style={{ marginBottom: 24 }}>
          <Step title="基本信息" />
          <Step title="文件上传" />
          <Step title="分类标签" />
        </Steps>

        <div style={{ marginBottom: 16 }}>
          <Text strong>信息标题</Text>
          <Input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="请输入信息标题" 
            style={{ marginTop: 8 }} 
            maxLength={40} 
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>信息内容</Text>
          <TextArea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="请输入信息内容（支持换行）" 
            rows={4} 
            style={{ marginTop: 8 }} 
            maxLength={200} 
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>内容分类</Text>
          <Select
            value={category}
            onChange={setCategory}
            placeholder="请选择内容分类"
            style={{ width: '100%', marginTop: 8 }}
          >
            <Select.Option value="健康宣教">健康宣教</Select.Option>
            <Select.Option value="医院导览">医院导览</Select.Option>
            <Select.Option value="健康讲座">健康讲座</Select.Option>
            <Select.Option value="健康手册">健康手册</Select.Option>
            <Select.Option value="医院导航">医院导航</Select.Option>
            <Select.Option value="排班信息">排班信息</Select.Option>
            <Select.Option value="就诊指南">就诊指南</Select.Option>
            <Select.Option value="急救知识">急救知识</Select.Option>
          </Select>
        </div>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Text strong>优先级</Text>
            <Select
              value={priority}
              onChange={setPriority}
              placeholder="请选择优先级"
              style={{ width: '100%', marginTop: 8 }}
            >
              <Select.Option value="low">低</Select.Option>
              <Select.Option value="normal">普通</Select.Option>
              <Select.Option value="high">高</Select.Option>
            </Select>
          </Col>
          <Col span={12}>
            <Text strong>标签</Text>
            <Select
              mode="tags"
              value={tags}
              onChange={setTags}
              placeholder="请输入标签"
              style={{ width: '100%', marginTop: 8 }}
            />
          </Col>
        </Row>

        <div style={{ marginBottom: 16 }}>
          <Text strong>文件上传</Text>
          <Upload.Dragger
            multiple
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleUpload}
            listType="picture"
            accept={ACCEPT}
            style={{ marginTop: 8 }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            <p className="ant-upload-hint">
              支持图片、视频、音频、PDF、Office文档等格式，单个文件不超过10MB
            </p>
          </Upload.Dragger>
        </div>

        {uploading && <Progress percent={progress} style={{ marginBottom: 16 }} />}

        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          style={{ width: '100%' }} 
          loading={uploading} 
          onClick={handlePublish}
          size="large"
        >
          {editId ? '保存修改' : '一键发布'}
        </Button>
      </Modal>

      {/* 文件预览弹窗 */}
      <Modal 
        open={!!preview} 
        onCancel={() => setPreview(null)} 
        footer={null} 
        title={
          <Space>
            {preview && getFileIcon(preview)}
            {preview?.name || '文件预览'}
          </Space>
        }
        width={600}
      >
        {preview ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            {preview.demo ? (
              <Alert
                message="演示文件"
                description="这是一个演示文件，无法进行实际预览。在实际环境中，您可以预览图片、播放视频和音频、查看PDF等。"
                type="info"
                showIcon
              />
            ) : (
              <div>
                <div style={{ fontSize: 64, color: getFileTypeColor(preview), marginBottom: 16 }}>
                  {getFileIcon(preview)}
                </div>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="文件名">{preview.name || '未知文件'}</Descriptions.Item>
                  <Descriptions.Item label="文件类型">{preview.type || '未知类型'}</Descriptions.Item>
                  <Descriptions.Item label="文件大小">{preview.size || '未知大小'}</Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 16 }}>
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(preview)}
                  >
                    下载文件
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Empty description="暂无文件预览" />
          </div>
        )}
      </Modal>

      {/* 内容详情抽屉 */}
      <Drawer
        title="内容详情"
        placement="right"
        onClose={() => setDetailDrawer(null)}
        open={!!detailDrawer}
        width={600}
      >
        {detailDrawer && (
          <div>
                         <div style={{ textAlign: 'center', marginBottom: 24 }}>
               <Avatar 
                 size={80} 
                 icon={<FileTextOutlined />} 
                 style={{ backgroundColor: detailDrawer.files && detailDrawer.files[0] ? getFileTypeColor(detailDrawer.files[0]) : '#666' }} 
               />
               <Title level={3} style={{ marginTop: 16 }}>{detailDrawer.title}</Title>
             </div>

                         <Descriptions column={1} bordered>
               <Descriptions.Item label="内容描述">{detailDrawer.content || '暂无描述'}</Descriptions.Item>
               <Descriptions.Item label="发布部门">{detailDrawer.author || '未知'}</Descriptions.Item>
               <Descriptions.Item label="内容分类">{detailDrawer.category || '未分类'}</Descriptions.Item>
               <Descriptions.Item label="优先级">
                 <Tag color={detailDrawer.priority === 'high' ? 'red' : 'blue'}>
                   {detailDrawer.priority === 'high' ? '高' : '普通'}
                 </Tag>
               </Descriptions.Item>
               <Descriptions.Item label="标签">
                 {detailDrawer.tags && detailDrawer.tags.length > 0 ? detailDrawer.tags.map(tag => (
                   <Tag key={tag} color="blue" style={{ marginRight: 4 }}>{tag}</Tag>
                 )) : <Text type="secondary">暂无标签</Text>}
               </Descriptions.Item>
               <Descriptions.Item label="发布时间">{detailDrawer.time || '未知'}</Descriptions.Item>
               <Descriptions.Item label="浏览量">{detailDrawer.views || 0}</Descriptions.Item>
               <Descriptions.Item label="下载量">{detailDrawer.downloads || 0}</Descriptions.Item>
               <Descriptions.Item label="点赞数">{detailDrawer.likes || 0}</Descriptions.Item>
               <Descriptions.Item label="评分">
                 <Rate disabled defaultValue={detailDrawer.rating || 0} />
               </Descriptions.Item>
             </Descriptions>

            <Divider />

                         <div>
               <Title level={5}>附件文件</Title>
               {detailDrawer.files && detailDrawer.files.length > 0 ? (
                 detailDrawer.files.map((file, index) => (
                   <Card 
                     key={index} 
                     size="small" 
                     style={{ marginBottom: 8 }}
                     actions={[
                       <Button size="small" icon={<EyeOutlined />} onClick={() => handlePreview(file)}>
                         预览
                       </Button>,
                       <Button size="small" icon={<DownloadOutlined />} onClick={() => handleDownload(file)}>
                         下载
                       </Button>
                     ]}
                   >
                     <Card.Meta
                       avatar={getFileIcon(file)}
                       title={file.name || '未知文件'}
                       description={`${file.type || '未知类型'} | ${file.size || '未知大小'}`}
                     />
                   </Card>
                 ))
               ) : (
                 <Empty description="暂无附件文件" />
               )}
             </div>
          </div>
        )}
      </Drawer>
    </div>
  );
} 