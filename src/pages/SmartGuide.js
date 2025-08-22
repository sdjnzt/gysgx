import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  List,
  Tag,
  Avatar,
  Empty,
  message,
  Modal,
  Descriptions,
  Tooltip,
  Space,
  Progress,
  Tabs,
  Carousel,
  Divider,
  Row,
  Col,
  Statistic,
  Timeline,
  Badge,
  Rate,
  Collapse,
  Alert,
  Steps,
  Result,
  Typography,
  Image
} from 'antd';
import {
  RobotOutlined,
  UserOutlined,
  SearchOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  AudioOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  StarOutlined,
  FireOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  FilePdfOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Step } = Steps;

const departments = [
  {
    name: '内科',
    desc: '常见内科疾病诊疗',
    icon: <MedicineBoxOutlined style={{ color: '#1890ff' }} />,
    doctors: 12,
    patients: 156,
    rating: 4.8,
    specialties: ['高血压', '糖尿病', '心脏病', '呼吸系统疾病']
  },
  {
    name: '外科',
    desc: '外伤、手术相关咨询',
    icon: <MedicineBoxOutlined style={{ color: '#faad14' }} />,
    doctors: 8,
    patients: 89,
    rating: 4.6,
    specialties: ['普外科', '骨科', '神经外科', '胸外科']
  },
  {
    name: '儿科',
    desc: '儿童疾病、疫苗接种',
    icon: <MedicineBoxOutlined style={{ color: '#52c41a' }} />,
    doctors: 6,
    patients: 234,
    rating: 4.9,
    specialties: ['小儿内科', '小儿外科', '新生儿科', '儿童保健']
  },
  {
    name: '妇产科',
    desc: '妇女、孕产相关问题',
    icon: <MedicineBoxOutlined style={{ color: '#eb2f96' }} />,
    doctors: 10,
    patients: 178,
    rating: 4.7,
    specialties: ['产科', '妇科', '计划生育', '生殖医学']
  },
  {
    name: '中医科',
    desc: '中医调理、针灸推拿',
    icon: <MedicineBoxOutlined style={{ color: '#13c2c2' }} />,
    doctors: 5,
    patients: 67,
    rating: 4.5,
    specialties: ['中医内科', '针灸推拿', '中药调理', '养生保健']
  },
  {
    name: '急诊科',
    desc: '24小时急诊救治',
    icon: <ThunderboltOutlined style={{ color: '#f5222d' }} />,
    doctors: 15,
    patients: 45,
    rating: 4.9,
    specialties: ['创伤急救', '心肺复苏', '中毒救治', '急危重症']
  }
];

const doctors = [
  {
    name: '张伟',
    dept: '内科',
    title: '主任医师',
    avatar: 'https://img1.baidu.com/it/u=1.jpg',
    desc: '擅长高血压、糖尿病等慢性病管理，从医20年，发表论文30余篇',
    queue: 3,
    time: '09:00-12:00',
    rating: 4.9,
    patients: 1250,
    specialties: ['高血压', '糖尿病', '冠心病'],
    experience: '20年',
    education: '北京大学医学部博士'
  },
  {
    name: '李静',
    dept: '外科',
    title: '副主任医师',
    avatar: 'https://img1.baidu.com/it/u=2.jpg',
    desc: '擅长普外科手术及创伤救治，微创手术专家，手术成功率98%',
    queue: 1,
    time: '13:30-17:00',
    rating: 4.7,
    patients: 890,
    specialties: ['普外科', '微创手术', '创伤救治'],
    experience: '15年',
    education: '复旦大学医学院硕士'
  },
  {
    name: '王磊',
    dept: '儿科',
    title: '主治医师',
    avatar: 'https://img1.baidu.com/it/u=3.jpg',
    desc: '擅长小儿呼吸道疾病，对儿童常见病有丰富经验，深受家长信赖',
    queue: 5,
    time: '09:00-12:00',
    rating: 4.8,
    patients: 2100,
    specialties: ['小儿内科', '呼吸道疾病', '儿童保健'],
    experience: '12年',
    education: '首都医科大学本科'
  },
  {
    name: '刘芳',
    dept: '妇产科',
    title: '主治医师',
    avatar: 'https://img1.baidu.com/it/u=4.jpg',
    desc: '擅长孕产期保健及妇科常见病，产检经验丰富，接生技术娴熟',
    queue: 2,
    time: '13:30-17:00',
    rating: 4.6,
    patients: 1560,
    specialties: ['产科', '妇科', '孕产保健'],
    experience: '10年',
    education: '中山大学医学院本科'
  },
  {
    name: '陈明',
    dept: '中医科',
    title: '副主任医师',
    avatar: 'https://img1.baidu.com/it/u=5.jpg',
    desc: '中医世家，擅长内科疾病的中医治疗，针灸推拿技术精湛',
    queue: 0,
    time: '08:00-12:00',
    rating: 4.5,
    patients: 780,
    specialties: ['中医内科', '针灸', '中药调理'],
    experience: '18年',
    education: '北京中医药大学硕士'
  }
];

const commonQuestions = [
  {
    q: '感冒发烧应该挂哪个科？',
    a: '建议挂内科，若伴有呼吸道症状可挂呼吸内科。感冒初期可先到内科就诊，医生会根据症状判断是否需要转诊。',
    category: '常见症状',
    hot: true
  },
  {
    q: '小孩发烧怎么办？',
    a: '建议挂儿科，及时就医，注意物理降温。儿童发烧需要特别关注，建议到儿科专科就诊，避免延误病情。',
    category: '儿科问题',
    hot: true
  },
  {
    q: '孕妇产检需要挂什么科？',
    a: '建议挂妇产科，产科门诊。孕妇产检是孕期保健的重要环节，需要定期到产科门诊进行检查。',
    category: '产科问题',
    hot: false
  },
  {
    q: '外伤流血如何处理？',
    a: '建议先止血包扎，尽快挂外科就诊。外伤处理需要专业医生评估，避免感染和并发症。',
    category: '外伤处理',
    hot: true
  },
  {
    q: '想调理身体可以挂中医吗？',
    a: '可以，建议挂中医科，根据症状选择合适的中医门诊。中医调理需要辨证论治，建议到正规中医科就诊。',
    category: '中医调理',
    hot: false
  },
  {
    q: '高血压患者日常需要注意什么？',
    a: '合理膳食、适量运动、规律服药，定期监测血压，保持良好心态，避免情绪激动。',
    category: '慢性病管理',
    hot: true
  },
  {
    q: '儿童疫苗接种有哪些注意事项？',
    a: '按时接种，注意接种前后的护理，如有发热等症状需延迟接种，接种后观察30分钟。',
    category: '疫苗接种',
    hot: false
  },
  {
    q: '妇科检查需要做哪些准备？',
    a: '避开月经期，检查前24小时避免性生活，保持外阴清洁，穿宽松衣物便于检查。',
    category: '妇科检查',
    hot: false
  }
];

const healthArticles = [
  {
    title: '春季流感预防指南',
    desc: '春季气温多变，注意保暖，勤洗手，预防流感。本文详细介绍春季流感的预防措施和注意事项。',
    cover: 'https://img1.baidu.com/it/u=1.jpg',
    link: '#',
    views: 1250,
    likes: 89,
    category: '疾病预防',
    publishTime: '2025-08-15'
  },
  {
    title: '高血压患者日常管理',
    desc: '合理膳食、适量运动、规律服药，科学管理血压。专家建议的高血压患者生活方式指导。',
    cover: 'https://img1.baidu.com/it/u=2.jpg',
    link: '#',
    views: 980,
    likes: 67,
    category: '慢性病管理',
    publishTime: '2025-08-10'
  },
  {
    title: '儿童疫苗接种时间表',
    desc: '家长请按时带孩子接种疫苗，预防传染病。完整的儿童疫苗接种时间表和注意事项。',
    cover: 'https://img1.baidu.com/it/u=3.jpg',
    link: '#',
    views: 2100,
    likes: 156,
    category: '儿童保健',
    publishTime: '2025-08-08'
  },
  {
    title: '女性健康知识科普',
    desc: '关注妇科健康，定期体检，科学备孕。女性健康知识大全，包括妇科疾病预防和保健。',
    cover: 'https://img1.baidu.com/it/u=4.jpg',
    link: '#',
    views: 890,
    likes: 45,
    category: '女性健康',
    publishTime: '2025-08-05'
  },
  {
    title: '中医养生保健方法',
    desc: '传统中医养生理念，包括四季养生、穴位保健、中药调理等实用方法。',
    cover: 'https://img1.baidu.com/it/u=5.jpg',
    link: '#',
    views: 750,
    likes: 78,
    category: '中医养生',
    publishTime: '2025-08-01'
  },
  {
    title: '急救知识普及',
    desc: '常见急症的急救方法，包括心肺复苏、止血包扎、骨折固定等实用技能。',
    cover: 'https://img1.baidu.com/it/u=6.jpg',
    link: '#',
    views: 1680,
    likes: 234,
    category: '急救知识',
    publishTime: '2024-02-28'
  }
];

const hotDepts = [
  { name: '内科', icon: <MedicineBoxOutlined style={{ color: '#1890ff' }} />, desc: '慢性病、感冒发烧等', hot: true, patients: 156, rating: 4.8 },
  { name: '儿科', icon: <MedicineBoxOutlined style={{ color: '#52c41a' }} />, desc: '儿童常见病、疫苗接种', hot: true, patients: 234, rating: 4.9 },
  { name: '外科', icon: <MedicineBoxOutlined style={{ color: '#faad14' }} />, desc: '外伤、手术相关', hot: false, patients: 89, rating: 4.6 },
  { name: '妇产科', icon: <MedicineBoxOutlined style={{ color: '#eb2f96' }} />, desc: '妇女、孕产相关', hot: false, patients: 178, rating: 4.7 },
  { name: '急诊科', icon: <ThunderboltOutlined style={{ color: '#f5222d' }} />, desc: '24小时急诊救治', hot: true, patients: 45, rating: 4.9 },
  { name: '中医科', icon: <MedicineBoxOutlined style={{ color: '#13c2c2' }} />, desc: '中医调理、针灸推拿', hot: false, patients: 67, rating: 4.5 }
];

// 统计数据
const statistics = {
  totalPatients: 2847,
  totalDoctors: 56,
  totalDepartments: 12,
  satisfactionRate: 96.5,
  averageWaitTime: 15,
  todayAppointments: 89
};

export default function SmartGuide() {
  const [input, setInput] = useState('');
  const [multiStep, setMultiStep] = useState({ step: 0, gender: '', age: '', symptom: '' });
  const [recommend, setRecommend] = useState(null);
  const [recommendList, setRecommendList] = useState([]);
  const [history, setHistory] = useState([]);
  const [detailModal, setDetailModal] = useState(null);
  const [selfTestOpen, setSelfTestOpen] = useState(false);
  const [selfTestResult, setSelfTestResult] = useState(null);
  const [selfTestStep, setSelfTestStep] = useState(0);
  const [selfTestAnswers, setSelfTestAnswers] = useState({});
  const [tabKey, setTabKey] = useState('guide');

  // 多轮对话流程
  const handleMultiStep = () => {
    if (multiStep.step === 0) {
      if (!input.trim()) return message.warning('请描述您的症状或问题');
      setMultiStep(s => ({ ...s, symptom: input, step: 1 }));
      setInput('');
    } else if (multiStep.step === 1) {
      if (!input.trim()) return message.warning('请输入您的性别');
      setMultiStep(s => ({ ...s, gender: input, step: 2 }));
      setInput('');
    } else if (multiStep.step === 2) {
      if (!input.trim() || isNaN(Number(input))) return message.warning('请输入您的年龄（数字）');
      setMultiStep(s => ({ ...s, age: input, step: 3 }));
      setInput('');
      // 生成推荐
      const { symptom, gender, age } = { ...multiStep, age: input };
      // 简单模拟推荐多个科室/医生
      let deptList = [];
      if (/咳嗽|发烧|感冒|高血压|糖尿病/.test(symptom)) deptList.push(departments[0]);
      if (/外伤|骨折|手术|刀口/.test(symptom)) deptList.push(departments[1]);
      if (/小孩|儿童|小儿|疫苗/.test(symptom) || (Number(age) < 14)) deptList.push(departments[2]);
      if (/妇女|怀孕|产检|月经/.test(symptom) || (gender.includes('女') && Number(age) > 12)) deptList.push(departments[3]);
      if (/中医|调理|针灸|推拿/.test(symptom)) deptList.push(departments[4]);
      if (deptList.length === 0) deptList = [departments[0]];
      const docList = doctors.filter(d => deptList.some(dep => dep.name === d.dept));
      setRecommendList(docList.map(d => ({ ...d, dept: deptList.find(dep => dep.name === d.dept) })));
      setRecommend({ deptList, docList });
      setHistory(h => [{ question: `${symptom}（${gender}，${age}岁）`, deptList, docList, time: new Date().toLocaleTimeString() }, ...h]);
    }
  };

  // 健康自测问卷
  const selfTestQuestions = [
    { q: '您是否有发热、咳嗽等呼吸道症状？', key: 'q1' },
    { q: '您是否近期有外伤或手术史？', key: 'q2' },
    { q: '您是否有慢性疾病（如高血压、糖尿病）？', key: 'q3' },
    { q: '您是否近期有疫苗接种需求？', key: 'q4' },
    { q: '您是否有妇科或孕产相关问题？', key: 'q5' },
  ];

  const handleSelfTestNext = (ans) => {
    setSelfTestAnswers(a => ({ ...a, [selfTestQuestions[selfTestStep].key]: ans }));
    if (selfTestStep < selfTestQuestions.length - 1) {
      setSelfTestStep(s => s + 1);
    } else {
      // 简单自测结果
      let result = '建议挂内科';
      if (ans === '是' && selfTestQuestions[selfTestStep].key === 'q2') result = '建议挂外科';
      else if (ans === '是' && selfTestQuestions[selfTestStep].key === 'q4') result = '建议挂儿科';
      else if (ans === '是' && selfTestQuestions[selfTestStep].key === 'q5') result = '建议挂妇产科';
      setSelfTestResult(result);
    }
  };

  const resetSelfTest = () => {
    setSelfTestStep(0);
    setSelfTestAnswers({});
    setSelfTestResult(null);
  };

  const handleSearch = () => {
    if (!input.trim()) return message.warning('请输入搜索内容');
    // 模拟搜索逻辑
    const results = [];
    if (/内科|感冒|发烧|高血压|糖尿病/.test(input)) results.push(departments[0]);
    if (/外科|外伤|手术/.test(input)) results.push(departments[1]);
    if (/儿科|儿童|小孩|疫苗/.test(input)) results.push(departments[2]);
    if (/妇产科|妇科|产科|怀孕/.test(input)) results.push(departments[3]);
    if (/中医|针灸|推拿/.test(input)) results.push(departments[4]);
    if (/急诊|急救|急症/.test(input)) results.push(departments[5]);

    if (results.length > 0) {
      setRecommendList(results);
      setRecommend({ deptList: results, docList: [] });
      message.success(`找到 ${results.length} 个相关科室`);
    } else {
      message.info('未找到相关科室，建议咨询导医台');
    }
  };

  const tabs = [
    {
      key: 'guide',
      label: (
        <span>
          <RobotOutlined />
          智能导诊
        </span>
      ),
      children: (
        <div>
          {/* 统计数据展示 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Statistic
                  title="今日就诊"
                  value={statistics.todayAppointments}
                  valueStyle={{ color: 'white' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card bordered={false} style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Statistic
                  title="在岗医生"
                  value={statistics.totalDoctors}
                  valueStyle={{ color: 'white' }}
                  prefix={<TeamOutlined />}
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

          {/* 智能导诊区域 */}
          <Card
            title={
              <Space>
                <RobotOutlined style={{ color: '#1890ff' }} />
                智能导诊助手
              </Space>
            }
            bordered={false}
            style={{ marginBottom: 24 }}
            extra={
              <Button
                type="primary"
                icon={<QuestionCircleOutlined />}
                onClick={() => setSelfTestOpen(true)}
              >
                健康自测
              </Button>
            }
          >
            <Alert
              message="AI智能导诊"
              description="请描述您的症状或问题，AI助手将为您推荐合适的科室和医生"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
              <Input
                size="large"
                placeholder="请描述您的症状或问题..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
              />
              <Button
                type="primary"
                size="large"
                onClick={handleSearch}
                icon={<SearchOutlined />}
              >
                智能导诊
              </Button>
            </Space.Compact>

            {/* 多轮对话流程 */}
            {multiStep.step > 0 && (
              <Card size="small" style={{ marginBottom: 16, background: '#f8f9fa' }}>
                <Steps current={multiStep.step} size="small">
                  <Step title="症状描述" description={multiStep.symptom} />
                  <Step title="性别确认" description={multiStep.gender} />
                  <Step title="年龄确认" description={multiStep.age} />
                  <Step title="智能推荐" />
                </Steps>
              </Card>
            )}

            {/* 推荐结果 */}
            {recommend && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>推荐科室：</Title>
                <Row gutter={[16, 16]}>
                  {recommend.deptList.map((dept, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                      <Card
                        hoverable
                        size="small"
                        style={{ textAlign: 'center' }}
                        bodyStyle={{ padding: 16 }}
                      >
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{dept.icon}</div>
                        <Title level={5} style={{ marginBottom: 4 }}>{dept.name}</Title>
                        <Text type="secondary">{dept.desc}</Text>
                        <div style={{ marginTop: 8 }}>
                          <Rate disabled defaultValue={dept.rating} size="small" />
                          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                            {dept.doctors}位医生 | {dept.patients}位患者
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {recommend.docList.length > 0 && (
                  <>
                    <Title level={5} style={{ marginTop: 16 }}>推荐医生：</Title>
                    <List
                      dataSource={recommend.docList}
                      renderItem={doctor => (
                        <List.Item
                          actions={[
                            <Button type="link" onClick={() => setDetailModal(doctor)}>
                              查看详情
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar src={doctor.avatar} icon={<UserOutlined />} />}
                            title={
                              <Space>
                                {doctor.name}
                                <Tag color="blue">{doctor.title}</Tag>
                                <Tag color="green">{doctor.dept}</Tag>
                              </Space>
                            }
                            description={
                              <div>
                                <div>{doctor.desc}</div>
                                <div style={{ marginTop: 4 }}>
                                  <Rate disabled defaultValue={doctor.rating} size="small" />
                                  <span style={{ marginLeft: 8, color: '#999' }}>
                                    接诊{doctor.patients}人 | 等待{doctor.queue}人
                                  </span>
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </>
                )}
              </div>
            )}

            {/* 导诊历史 */}
            {history.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <Title level={5}>导诊历史：</Title>
                <Timeline>
                  {history.slice(0, 5).map((item, index) => (
                    <Timeline.Item
                      key={index}
                      dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    >
                      <div>
                        <Text strong>{item.question}</Text>
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">推荐科室：</Text>
                          {item.deptList.map(dept => (
                            <Tag key={dept.name} color="blue">{dept.name}</Tag>
                          ))}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}
          </Card>

          {/* 热门科室 */}
          <Card
            title={
              <Space>
                <FireOutlined style={{ color: '#fa541c' }} />
                热门科室
              </Space>
            }
            bordered={false}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={[16, 16]}>
              {hotDepts.map((dept, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card
                    hoverable
                    size="small"
                    style={{
                      textAlign: 'center',
                      border: dept.hot ? '2px solid #fa541c' : '1px solid #d9d9d9'
                    }}
                    bodyStyle={{ padding: 16 }}
                  >
                    {dept.hot && (
                      <Badge.Ribbon text="热门" color="red">
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{dept.icon}</div>
                      </Badge.Ribbon>
                    )}
                    {!dept.hot && (
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{dept.icon}</div>
                    )}
                    <Title level={5} style={{ marginBottom: 4 }}>{dept.name}</Title>
                    <Text type="secondary">{dept.desc}</Text>
                    <div style={{ marginTop: 8 }}>
                      <Rate disabled defaultValue={dept.rating} size="small" />
                      <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                        {dept.patients}位患者
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      )
    },
    {
      key: 'departments',
      label: (
        <span>
          <MedicineBoxOutlined />
          科室介绍
        </span>
      ),
      children: (
        <div>
          <Row gutter={[16, 16]}>
            {departments.map((dept, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  cover={
                    <div style={{
                      height: 120,
                      background: `linear-gradient(135deg, ${['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'][index % 6]} 0%, ${['#764ba2', '#f5576c', '#00f2fe', '#38f9d7', '#fecfef', '#fa709a'][index % 6]} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 48
                    }}>
                      {dept.icon}
                    </div>
                  }
                  actions={[
                    <Button type="link" icon={<InfoCircleOutlined />}>
                      查看详情
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={
                      <Space>
                        {dept.name}
                        <Rate disabled defaultValue={dept.rating} size="small" />
                      </Space>
                    }
                    description={
                      <div>
                        <Paragraph>{dept.desc}</Paragraph>
                        <div style={{ marginTop: 8 }}>
                          <Tag color="blue">{dept.doctors}位医生</Tag>
                          <Tag color="green">{dept.patients}位患者</Tag>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Text strong>专业特长：</Text>
                          <div style={{ marginTop: 4 }}>
                            {dept.specialties.map(spec => (
                              <Tag key={spec} size="small">{spec}</Tag>
                            ))}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )
    },
    {
      key: 'doctors',
      label: (
        <span>
          <TeamOutlined />
          医生团队
        </span>
      ),
      children: (
        <div>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
            dataSource={doctors}
            renderItem={doctor => (
              <List.Item>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  cover={
                    <div style={{
                      height: 160,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 64
                    }}>
                      {doctor.avatar ? (
                        <Image
                          src={doctor.avatar}
                          alt={doctor.name}
                          style={{ width: 80, height: 80, borderRadius: '50%' }}
                        />
                      ) : (
                        <UserOutlined />
                      )}
                    </div>
                  }
                  actions={[
                    <Button type="link" icon={<InfoCircleOutlined />} onClick={() => setDetailModal(doctor)}>
                      查看详情
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={
                      <Space>
                        {doctor.name}
                        <Tag color="blue">{doctor.title}</Tag>
                        <Tag color="green">{doctor.dept}</Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Paragraph>{doctor.desc}</Paragraph>
                        <div style={{ marginTop: 8 }}>
                          <Rate disabled defaultValue={doctor.rating} size="small" />
                          <span style={{ marginLeft: 8, color: '#999' }}>
                            {doctor.patients}位患者
                          </span>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Text strong>专业特长：</Text>
                          <div style={{ marginTop: 4 }}>
                            {doctor.specialties.map(spec => (
                              <Tag key={spec} size="small">{spec}</Tag>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Text type="secondary">
                            <ClockCircleOutlined /> {doctor.time} |
                            <UserOutlined /> 等待{doctor.queue}人
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      )
    },
    {
      key: 'qa',
      label: (
        <span>
          <QuestionCircleOutlined />
          常见问答
        </span>
      ),
      children: (
        <div>
          <Collapse defaultActiveKey={['1']} size="large">
            {commonQuestions.map((item, index) => (
              <Panel
                header={
                  <Space>
                    {item.q}
                    {item.hot && <Tag color="red" icon={<FireOutlined />}>热门</Tag>}
                  </Space>
                }
                key={index + 1}
              >
                <div>
                  <Text>{item.a}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue">{item.category}</Tag>
                  </div>
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>
      )
    },
    {
      key: 'articles',
      label: (
        <span>
          <FilePdfOutlined />
          健康资讯
        </span>
      ),
      children: (
        <div>
          <Row gutter={[16, 16]}>
            {healthArticles.map((article, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  hoverable
                  cover={
                    <div style={{
                      height: 160,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 48
                    }}>
                      <Image
                        src={article.cover}
                        alt={article.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  }
                  actions={[
                    <Button type="link" icon={<EyeOutlined />}>
                      {article.views}
                    </Button>,
                    <Button type="link" icon={<HeartOutlined />}>
                      {article.likes}
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={article.title}
                    description={
                      <div>
                        <Paragraph>{article.desc}</Paragraph>
                        <div style={{ marginTop: 8 }}>
                          <Tag color="blue">{article.category}</Tag>
                          <Tag color="green">{article.publishTime}</Tag>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
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
              <RobotOutlined style={{ marginRight: 12 }} />
              智慧导诊中心
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: '8px 0 0 0' }}>
              AI智能导诊 · 科室推荐 · 医生介绍 · 健康自测 · 常见问答
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Statistic
                title="累计服务"
                value={statistics.totalPatients}
                valueStyle={{ color: 'white' }}
                prefix={<UserOutlined />}
              />
              <Statistic
                title="满意度"
                value={statistics.satisfactionRate}
                suffix="%"
                valueStyle={{ color: 'white' }}
                prefix={<HeartOutlined />}
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

      {/* 医生详情弹窗 */}
      <Modal
        title="医生详细信息"
        open={!!detailModal}
        onCancel={() => setDetailModal(null)}
        footer={null}
        width={600}
      >
        {detailModal && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="姓名">{detailModal.name}</Descriptions.Item>
            <Descriptions.Item label="科室">{detailModal.dept}</Descriptions.Item>
            <Descriptions.Item label="职称">{detailModal.title}</Descriptions.Item>
            <Descriptions.Item label="专业特长">
              {detailModal.specialties.map(spec => (
                <Tag key={spec} color="blue">{spec}</Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="从医经验">{detailModal.experience}</Descriptions.Item>
            <Descriptions.Item label="教育背景">{detailModal.education}</Descriptions.Item>
            <Descriptions.Item label="接诊患者">{detailModal.patients}人</Descriptions.Item>
            <Descriptions.Item label="患者评分">
              <Rate disabled defaultValue={detailModal.rating} />
            </Descriptions.Item>
            <Descriptions.Item label="出诊时间">{detailModal.time}</Descriptions.Item>
            <Descriptions.Item label="当前等待">{detailModal.queue}人</Descriptions.Item>
            <Descriptions.Item label="个人简介">{detailModal.desc}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 健康自测弹窗 */}
      <Modal
        title="健康自测问卷"
        open={selfTestOpen}
        onCancel={() => setSelfTestOpen(false)}
        footer={null}
        width={600}
      >
        {!selfTestResult ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={4}>第 {selfTestStep + 1} 题</Title>
              <Paragraph>{selfTestQuestions[selfTestStep].q}</Paragraph>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Space size="large">
                <Button
                  size="large"
                  type="primary"
                  onClick={() => handleSelfTestNext('是')}
                  style={{ minWidth: 100 }}
                >
                  是
                </Button>
                <Button
                  size="large"
                  onClick={() => handleSelfTestNext('否')}
                  style={{ minWidth: 100 }}
                >
                  否
                </Button>
              </Space>
            </div>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Progress
                percent={((selfTestStep + 1) / selfTestQuestions.length) * 100}
                size="small"
                showInfo={false}
              />
              <Text type="secondary">
                {selfTestStep + 1} / {selfTestQuestions.length}
              </Text>
            </div>
          </div>
        ) : (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="自测完成"
            subTitle={selfTestResult}
            extra={[
              <Button type="primary" key="reset" onClick={resetSelfTest}>
                重新测试
              </Button>,
              <Button key="close" onClick={() => setSelfTestOpen(false)}>
                关闭
              </Button>
            ]}
          />
        )}
      </Modal>
    </div>
  );
} 