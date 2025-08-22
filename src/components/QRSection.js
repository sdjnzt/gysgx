import React from 'react';

export default function QRSection({ qrLinks }) {
  if (!qrLinks || qrLinks.length === 0) return null;
  return (
    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 8px #eee', padding: 16, marginBottom: 24 }}>
      <h3 style={{ fontWeight: 500, fontSize: 18, marginBottom: 12 }}>扫码导航</h3>
      {qrLinks.map(qr => (
        <div key={qr.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <img src={qr.img} alt={qr.title} style={{ width: 64, height: 64, marginRight: 16, borderRadius: 8, border: '1px solid #eee' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{qr.title}</div>
            <a href={qr.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff', fontSize: 14 }}>点击访问</a>
          </div>
        </div>
      ))}
    </div>
  );
} 