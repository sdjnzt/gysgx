import React from 'react';
import { Carousel } from 'antd';

export default function BannerCarousel({ banners }) {
  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', boxShadow: '0 2px 16px #eee', borderRadius: 12, overflow: 'hidden' }}>
      <Carousel autoplay dotPosition="bottom" style={{ background: '#fff' }}>
        {banners.map(item => (
          <div key={item.id} style={{ position: 'relative', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafd' }}>
            {item.type === 'image' ? (
              <img src={item.url} alt={item.title} style={{ maxHeight: 300, maxWidth: '100%', borderRadius: 8, objectFit: 'cover', margin: '0 auto' }} />
            ) : (
              <video src={item.url} controls style={{ maxHeight: 300, maxWidth: '100%', borderRadius: 8, background: '#000' }} preload="metadata" />
            )}
            <div style={{ position: 'absolute', left: 24, bottom: 24, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: 18, fontWeight: 500 }}>
              {item.title}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
} 