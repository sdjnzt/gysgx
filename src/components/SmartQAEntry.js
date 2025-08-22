import React from 'react';
import { Button } from 'antd';

export default function SmartQAEntry({ style }) {
  // 这里可扩展为弹窗或跳转到智能问答页面
  const handleClick = () => {
    window.open('https://hospital-qa.com', '_blank');
  };
  return (
    <div style={{ ...style, background: '#fff', borderRadius: 8, boxShadow: '0 1px 8px #eee', padding: 16, textAlign: 'center' }}>
      <h3 style={{ fontWeight: 500, fontSize: 18, marginBottom: 12 }}>智能导诊问答</h3>
      <Button type="primary" size="large" onClick={handleClick}>
        进入智能问答
      </Button>
    </div>
  );
} 