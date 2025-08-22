import React from 'react';
import { Alert, Carousel } from 'antd';

export default function NoticeBar({ notices }) {
  if (!notices || notices.length === 0) return null;
  return (
    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 8px #eee', padding: '4px 16px', marginBottom: 8 }}>
      <Carousel vertical autoplay dots={false} style={{ height: 32 }}>
        {notices.map(n => (
          <div key={n.id}>
            <Alert message={n.content} type={n.type || 'info'} banner showIcon={false} style={{ background: 'none', margin: 0, padding: 0, fontSize: 16 }} />
          </div>
        ))}
      </Carousel>
    </div>
  );
} 