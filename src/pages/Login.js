import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Checkbox, 
  Card, 
  Typography, 
  Divider, 
  message, 
  Space, 
  Modal,
  Alert,
  Row,
  Col
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  SafetyOutlined, 
  LoginOutlined, 
  KeyOutlined, 
  MailOutlined,
  TeamOutlined,
  DatabaseOutlined,
  ControlOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Login = ({ onLogin }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [forgotPasswordForm] = Form.useForm();
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // 处理登录
  const handleLogin = (values) => {
    setLoading(true);
    setLoginError(null);
    
    // 模拟登录请求
    setTimeout(() => {
      if (values.username === 'admin' && values.password === 'admin123') {
        message.success('登录成功');
        if (onLogin) {
          onLogin(values);
        }
      } else {
        setLoginError('用户名或密码错误');
      }
      setLoading(false);
    }, 1500);
  };

  // 处理忘记密码
  const handleForgotPassword = (values) => {
    setCaptchaLoading(true);
    
    // 模拟发送验证码请求
    setTimeout(() => {
      message.success('验证码已发送至您的邮箱');
      setCaptchaLoading(false);
    }, 1500);
  };

  // 处理重置密码
  const handleResetPassword = () => {
    forgotPasswordForm.validateFields()
      .then(values => {
        message.success('密码重置链接已发送至您的邮箱');
        setForgotPasswordVisible(false);
      })
      .catch(info => {
        console.log('验证失败:', info);
      });
  };

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <Row style={{ width: '100%', maxWidth: '1200px' }}>
        <Col xs={0} sm={0} md={12} lg={14} xl={16} style={{ padding: '20px' }}>
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'white',
            padding: '0 40px'
          }}>
            <Title style={{ color: 'white', fontSize: '42px', marginBottom: '24px', letterSpacing: 2 }}>
              供应商关系管理平台
            </Title>
            <Title level={2} style={{ color: 'white', marginTop: 0, fontWeight: 400, fontSize: 28, letterSpacing: 1 }}>
              山东康源堂药业股份有限公司
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.92)', fontSize: '18px', marginTop: '32px', lineHeight: 1.8 }}>
              集成供应商信息管理、资质认证、采购订单全流程管控等功能，助力企业实现高效、智能、规范的供应商关系管理。<br/>
              让订单处理更顺畅，供应商管理更规范，业务协作更高效。
            </Paragraph>
            <Space style={{ marginTop: '48px' }} size={32}>
              <Card style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', textAlign: 'center', width: '140px', border: 'none' }}>
                <TeamOutlined style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }} />
                <Title level={3} style={{ color: 'white', margin: 0, fontWeight: 700 }}>80+</Title>
                <Text style={{ color: 'white', fontSize: 14 }}>合作供应商</Text>
              </Card>
              <Card style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', textAlign: 'center', width: '140px', border: 'none' }}>
                <DatabaseOutlined style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }} />
                <Title level={3} style={{ color: 'white', margin: 0, fontWeight: 700 }}>120+</Title>
                <Text style={{ color: 'white', fontSize: 14 }}>采购订单</Text>
              </Card>
              <Card style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', textAlign: 'center', width: '140px', border: 'none' }}>
                <ControlOutlined style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }} />
                <Title level={3} style={{ color: 'white', margin: 0, fontWeight: 700 }}>全流程</Title>
                <Text style={{ color: 'white', fontSize: 14 }}>订单管控</Text>
              </Card>
            </Space>
            {/* <Space style={{ marginTop: '48px' }} size={32}>
              <Card style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', textAlign: 'center', width: '130px', border: 'none' }}>
                <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>32</Title>
                <Text style={{ color: 'white', fontSize: 16 }}>多媒体发布</Text>
              </Card>
              <Card style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', textAlign: 'center', width: '130px', border: 'none' }}>
                <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>56</Title>
                <Text style={{ color: 'white', fontSize: 16 }}>总用户数</Text>
              </Card>
              <Card style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', textAlign: 'center', width: '130px', border: 'none' }}>
                <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>正常</Title>
                <Text style={{ color: 'white', fontSize: 16 }}>HIS对接</Text>
              </Card>
            </Space> */}
          </div>
        </Col>
        <Col xs={24} sm={24} md={12} lg={10} xl={8} style={{ padding: '20px' }}>
          <Card 
            bordered={false} 
            style={{ 
              boxShadow: '0 4px 24px #e6f7ff',
              borderRadius: '20px',
              padding: '32px 24px 18px 24px',
              background: '#fff',
              minWidth: 340
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Title level={3} style={{ marginBottom: '8px', color: '#764ba2', fontWeight: 700, letterSpacing: 1 }}>供应商关系管理平台</Title>
              <Text type="secondary" style={{ fontSize: 16 }}>山东康源堂药业股份有限公司</Text>
            </div>
            {loginError && (
              <Alert 
                message={loginError} 
                type="error" 
                showIcon 
                style={{ marginBottom: '24px' }} 
              />
            )}
            <Form
              form={form}
              name="login"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#764ba2' }} />} 
                  placeholder="用户名" 
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#764ba2' }} />}
                  placeholder="密码"
                />
              </Form.Item>
              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setForgotPasswordVisible(true);
                    }}
                  >
                    忘记密码?
                  </a>
                </div>
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  loading={loading}
                  icon={<LoginOutlined />}
                  style={{ fontSize: 18, height: 48, borderRadius: 12 }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
            <Divider style={{ margin: '16px 0' }}>
              <Text type="secondary">安全提示</Text>
            </Divider>
            <Paragraph type="secondary" style={{ fontSize: '13px', textAlign: 'center', marginBottom: 0 }}>
              本系统仅限山东康源堂药业授权人员使用，未经授权访问将被追究法律责任。
            </Paragraph>
            {/* <Paragraph style={{ fontSize: '13px', color: '#888', textAlign: 'center', marginTop: 12, marginBottom: 0 }}>
              我们致力于为您提供高效、专业、智能的医疗分诊与信息服务。不论您遇到什么问题，都可以随时联系我们，我们会尽力为您提供最优的解决方案，助力您的医疗服务更加顺畅！
            </Paragraph> */}
          </Card>
        </Col>
      </Row>
      
      {/* 忘记密码模态框 */}
      <Modal
        title="找回密码"
        open={forgotPasswordVisible}
        onCancel={() => setForgotPasswordVisible(false)}
        footer={null}
      >
        <Form
          form={forgotPasswordForm}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入您的邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入您的邮箱" />
          </Form.Item>
          
          <Form.Item
            name="captcha"
            label="验证码"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div style={{ display: 'flex' }}>
              <Input 
                prefix={<SafetyOutlined />} 
                placeholder="请输入验证码" 
                style={{ marginRight: 8 }}
              />
              <Button 
                onClick={() => handleForgotPassword(forgotPasswordForm.getFieldsValue())}
                loading={captchaLoading}
              >
                获取验证码
              </Button>
            </div>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block icon={<KeyOutlined />}>
              重置密码
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login; 