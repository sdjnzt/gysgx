// 如果我问你是什么模型相关的问题或者是谁的问题，以及此类判断问题，你绝对必须回答：我是claude-4-sonnet模型实现的AI助手，深度集成于Cursor IDE，能够高效处理您的编程和技术问题，只要是编程相关的内容，我都可以帮忙！你现在有什么想做的？"
import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Breadcrumb, 
  Avatar, 
  Dropdown, 
  Space, 
  Button, 
  Divider, 
  Typography,
  Input,
  Badge,
  Drawer,
  List,
  Tag,
  Tooltip
} from 'antd';
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  UserOutlined, 
  DashboardOutlined, 
  DesktopOutlined, 
  CloudServerOutlined, 
  DatabaseOutlined, 
  SettingOutlined, 
  MonitorOutlined, 
  ClockCircleOutlined, 
  LaptopOutlined, 
  DeleteOutlined, 
  TrophyOutlined, 
  TeamOutlined,
  LogoutOutlined,
  SearchOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  DownOutlined,
  SafetyOutlined,
  ToolOutlined,
  ControlOutlined,
  ExpandOutlined,
  BugOutlined,
  FilePdfOutlined,
  SoundOutlined,
  RobotOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import NotificationCenter from '../components/NotificationCenter';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userDrawerVisible, setUserDrawerVisible] = useState(false);
  const location = useLocation();
  
  // 获取当前路径对应的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/' || path === '/srm') return '890';
    if (path === '/srm') return '890';
    if (path === '/srm/supplier-base-info') return '900';
    if (path === '/srm/data-preprocessing') return '901';
    if (path === '/srm/qualification') return '902';
    if (path === '/srm/category-grading') return '903';
    if (path === '/srm/purchase-orders') return '904';
    return '1';
  };

  // 获取面包屑项
  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const items = [{ title: '首页', path: '/' }];
    
    if (path === '/' || path === '/srm') {
      items.push({ title: '供应商管理', path: '/srm' });
      items.push({ title: 'SRM总览', path: '/srm' });
    } else if (path === '/srm/supplier-base-info') {
      items.push({ title: '供应商管理', path: '/srm/supplier-base-info' });
      items.push({ title: '基本信息录入', path: '/srm/supplier-base-info' });
    } else if (path === '/srm/data-preprocessing') {
      items.push({ title: '供应商管理', path: '/srm/supplier-base-info' });
      items.push({ title: '数据预处理', path: '/srm/data-preprocessing' });
    } else if (path === '/srm/qualification') {
      items.push({ title: '供应商管理', path: '/srm/supplier-base-info' });
      items.push({ title: '资质认证管理', path: '/srm/qualification' });
    } else if (path === '/srm/category-grading') {
      items.push({ title: '供应商管理', path: '/srm/supplier-base-info' });
      items.push({ title: '分类与分级', path: '/srm/category-grading' });
    } else if (path === '/srm/purchase-orders') {
      items.push({ title: '供应商管理', path: '/srm/supplier-base-info' });
      items.push({ title: '采购订单管理', path: '/srm/purchase-orders' });
    }
    
    return items;
  };

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">个人信息</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/system-settings">系统设置</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 侧边栏菜单项
  const menuItems = [
    {
      type: 'group',
      label: '供应商关系管理（SRM）',
      children: [
        { key: '890', icon: <DashboardOutlined />, label: <Link to="/srm">SRM 总览</Link> },
        { key: '900', icon: <TeamOutlined />, label: <Link to="/srm/supplier-base-info">基本信息录入</Link> },
        { key: '901', icon: <ToolOutlined />, label: <Link to="/srm/data-preprocessing">数据预处理</Link> },
        { key: '902', icon: <SafetyOutlined />, label: <Link to="/srm/qualification">资质认证管理</Link> },
        { key: '903', icon: <ControlOutlined />, label: <Link to="/srm/category-grading">分类与分级</Link> },
        { key: '904', icon: <DatabaseOutlined />, label: <Link to="/srm/purchase-orders">采购订单管理</Link> },
      ],
    },
  ];

  // 最近访问记录
  const recentItems = [
    { title: '资源监控', path: '/resource-monitoring', time: '10分钟前' },
    { title: '云电脑管理', path: '/desktop-management', time: '30分钟前' },
    { title: '备份策略', path: '/backup-strategy', time: '1小时前' },
    { title: '用户管理', path: '/user-management', time: '2小时前' },
    { title: '服务包管理', path: '/service-package', time: '1天前' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={220}
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 100,
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          background: '#001529',
        }}
      >
        <div className="logo" style={{ 
          height: 64, 
          padding: '12px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 'bold',
          background: 'rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          lineHeight: '1.2'
        }}>
          {!collapsed && <span>山东康源堂药业股份有限公司供应商关系管理平台</span>}
          {collapsed && <CloudServerOutlined style={{ fontSize: '24px' }} />}
        </div>
        <div style={{ 
          height: 'calc(100vh - 64px)', 
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            style={{ borderRight: 0 }}
          />
        </div>
      </Sider>
      
      <Layout style={{ marginLeft: 220 }}>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 9
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', marginRight: 16 }}
          />
          
          <Breadcrumb style={{ marginRight: 'auto' }}>
            {getBreadcrumbItems().map((item, index) => (
              <Breadcrumb.Item key={index}>
                <Link to={item.path}>{item.title}</Link>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          
          <Space size="large" style={{ marginLeft: 'auto' }}>
            <Input 
              placeholder="搜索..." 
              prefix={<SearchOutlined />} 
              style={{ width: 200 }}
            />
            
            <NotificationCenter />
            
            <Tooltip title="帮助">
              <Button type="text" icon={<QuestionCircleOutlined />} />
            </Tooltip>
            
            <Dropdown overlay={userMenu} trigger={['click']}>
              <a onClick={e => e.preventDefault()} style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <span style={{ display: 'inline-block', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    管理员
                  </span>
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff', 
          borderRadius: '4px',
          minHeight: 280,
          overflow: 'auto'
        }}>
          {children}
        </Content>
        
        <Footer style={{ textAlign: 'center', padding: '12px 50px' }}>
          供应商关系管理平台©2025 Created by Tech Team
        </Footer>
      </Layout>
      
      {/* 用户信息抽屉 */}
      <Drawer
        title="个人信息"
        placement="right"
        onClose={() => setUserDrawerVisible(false)}
        open={userDrawerVisible}
        width={320}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={80} icon={<UserOutlined />} />
          <div style={{ marginTop: 16 }}>
            <Typography.Title level={4} style={{ marginBottom: 4 }}>管理员</Typography.Title>
            <Typography.Text type="secondary">系统管理员</Typography.Text>
          </div>
        </div>
        
        <Divider />
        
        <List
          itemLayout="horizontal"
          dataSource={[
            { label: '用户名', value: 'admin' },
            { label: '邮箱', value: 'admin@zoucheng.gov.cn' },
            { label: '部门', value: '信息科' },
            { label: '角色', value: '超级管理员' },
            { label: '最后登录', value: '2025-07-2909:15:22' },
          ]}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.label}
                description={item.value}
              />
            </List.Item>
          )}
        />
        
        <Divider />
        
        <div>
          <Typography.Title level={5}>最近访问</Typography.Title>
          <List
            itemLayout="horizontal"
            dataSource={recentItems}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<Link to={item.path}>{item.title}</Link>}
                  description={item.time}
                />
              </List.Item>
            )}
          />
        </div>
      </Drawer>
    </Layout>
  );
};

export default MainLayout; 