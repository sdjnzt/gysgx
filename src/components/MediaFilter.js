import React from 'react';
import { Select, Space } from 'antd';

export default function MediaFilter({ banners, filter, setFilter }) {
  // 提取所有分组和标签
  const groups = Array.from(new Set(banners.map(b => b.group)));
  const tags = Array.from(new Set(banners.flatMap(b => b.tags)));
  return (
    <Space style={{ marginBottom: 16 }}>
      <Select
        value={filter.group}
        onChange={v => setFilter(f => ({ ...f, group: v }))}
        style={{ width: 120 }}
      >
        <Select.Option value="全部">全部分组</Select.Option>
        {groups.map(g => <Select.Option key={g} value={g}>{g}</Select.Option>)}
      </Select>
      <Select
        value={filter.tag}
        onChange={v => setFilter(f => ({ ...f, tag: v }))}
        style={{ width: 120 }}
      >
        <Select.Option value="全部">全部标签</Select.Option>
        {tags.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
      </Select>
    </Space>
  );
} 