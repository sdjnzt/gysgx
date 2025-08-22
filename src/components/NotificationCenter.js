import React, { useState, useEffect } from 'react';
import { 
  Badge, 
  Dropdown, 
  List, 
  Avatar, 
  Typography, 
  Button, 
  Tabs, 
  Empty, 
  Space,
  Tag,
  Divider
} from 'antd';
import { 
  BellOutlined, 
  CheckCircleOutlined, 
  WarningOutlined, 
  InfoCircleOutlined, 
  CloseCircleOutlined,
  CheckOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 模拟通知数据
const mockNotifications = [
  {
    id: 1,
    title: '系统更新',
    content: '系统将于今晚23:00进行例行维护，预计持续1小时',
    time: '10分钟前',
    type: 'info',
    read: false
  },
  {
    id: 2,
    title: '资源告警',
    content: '人事科资源池CPU使用率超过80%',
    time: '30分钟前',
    type: 'warning',
    read: false
  },
  {
    id: 3,
    title: '备份完成',
    content: '系统自动备份已完成，备份大小：256MB',
    time: '1小时前',
    type: 'success',
    read: true
  },
  {
    id: 4,
    title: '登录提醒',
    content: '您的账号刚刚在新设备上登录',
    time: '2小时前',
    type: 'info',
    read: true
  },
  {
    id: 5,
    title: '系统错误',
    content: '数据库连接异常，请联系管理员',
    time: '1天前',
    type: 'error',
    read: true
  }
];

// 模拟消息数据
const mockMessages = [
  {
    id: 1,
    sender: '系统管理员',
    avatar: null,
    content: '请各部门尽快完成本月资源使用情况统计',
    time: '30分钟前',
    read: false
  },
  {
    id: 2,
    sender: '张主任',
    avatar: null,
    content: '请帮我分配一个新的云电脑资源',
    time: '1小时前',
    read: false
  },
  {
    id: 3,
    sender: '李科长',
    avatar: null,
    content: '人事系统备份已完成，请查收',
    time: '3小时前',
    read: true
  }
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [messages, setMessages] = useState(mockMessages);
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState('1');

  // 计算未读通知数量
  const unreadNotifications = notifications.filter(item => !item.read).length;
  const unreadMessages = messages.filter(item => !item.read).length;
  const totalUnread = unreadNotifications + unreadMessages;

  // 标记所有通知为已读
  const markAllAsRead = () => {
    if (activeKey === '1') {
      setNotifications(notifications.map(item => ({ ...item, read: true })));
    } else {
      setMessages(messages.map(item => ({ ...item, read: true })));
    }
  };

  // 标记单个通知为已读
  const markAsRead = (id) => {
    if (activeKey === '1') {
      setNotifications(notifications.map(item => 
        item.id === id ? { ...item, read: true } : item
      ));
    } else {
      setMessages(messages.map(item => 
        item.id === id ? { ...item, read: true } : item
      ));
    }
  };

  // 删除通知
  const deleteNotification = (id) => {
    if (activeKey === '1') {
      setNotifications(notifications.filter(item => item.id !== id));
    } else {
      setMessages(messages.filter(item => item.id !== id));
    }
  };

  // 获取通知图标
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'info':
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  // 获取通知标签
  const getNotificationTag = (type) => {
    switch (type) {
      case 'success':
        return <Tag color="success">成功</Tag>;
      case 'warning':
        return <Tag color="warning">警告</Tag>;
      case 'error':
        return <Tag color="error">错误</Tag>;
      case 'info':
      default:
        return <Tag color="processing">信息</Tag>;
    }
  };

  // 下拉菜单内容
  const menu = (
    <div style={{ 
      width: 350, 
      maxHeight: 500, 
      overflow: 'auto',
      boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      background: '#fff',
      borderRadius: '4px'
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong>通知中心</Text>
        <Button type="link" size="small" onClick={markAllAsRead}>
          全部标为已读
        </Button>
      </div>
      
      <Tabs 
        activeKey={activeKey} 
        onChange={setActiveKey}
        style={{ padding: '0 16px' }}
      >
        <TabPane 
          tab={
            <span>
              通知
              {unreadNotifications > 0 && (
                <Badge 
                  count={unreadNotifications} 
                  size="small" 
                  style={{ marginLeft: 6 }}
                />
              )}
            </span>
          } 
          key="1"
        >
          {notifications.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={item => (
                <List.Item
                  style={{ 
                    opacity: item.read ? 0.7 : 1,
                    background: item.read ? 'transparent' : 'rgba(24, 144, 255, 0.05)',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                  onClick={() => markAsRead(item.id)}
                  actions={[
                    !item.read && (
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<CheckOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.id);
                        }}
                      />
                    )
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={getNotificationIcon(item.type)} />
                    }
                    title={
                      <Space>
                        <Text strong={!item.read}>{item.title}</Text>
                        {getNotificationTag(item.type)}
                      </Space>
                    }
                    description={
                      <>
                        <Paragraph style={{ margin: 0 }}>
                          {item.content}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.time}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description="暂无通知"
              style={{ padding: '20px 0' }}
            />
          )}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              消息
              {unreadMessages > 0 && (
                <Badge 
                  count={unreadMessages} 
                  size="small" 
                  style={{ marginLeft: 6 }}
                />
              )}
            </span>
          } 
          key="2"
        >
          {messages.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={item => (
                <List.Item
                  style={{ 
                    opacity: item.read ? 0.7 : 1,
                    background: item.read ? 'transparent' : 'rgba(24, 144, 255, 0.05)',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                  onClick={() => markAsRead(item.id)}
                  actions={[
                    !item.read && (
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<CheckOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.id);
                        }}
                      />
                    )
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar>{item.sender.charAt(0)}</Avatar>
                    }
                    title={
                      <Text strong={!item.read}>{item.sender}</Text>
                    }
                    description={
                      <>
                        <Paragraph style={{ margin: 0 }}>
                          {item.content}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.time}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description="暂无消息"
              style={{ padding: '20px 0' }}
            />
          )}
        </TabPane>
      </Tabs>
      
      <Divider style={{ margin: '0' }} />
      
      <div style={{ padding: '8px 16px', textAlign: 'center' }}>
        <Button type="link">查看全部</Button>
      </div>
    </div>
  );

  return (
    <Dropdown 
      overlay={menu} 
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
      placement="bottomRight"
      arrow
    >
      <Badge count={totalUnread} size="small">
        <Button 
          type="text" 
          icon={<BellOutlined style={{ fontSize: '18px' }} />} 
          style={{ padding: '0 8px' }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationCenter; 