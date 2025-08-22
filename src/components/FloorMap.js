import React from 'react';

export default function FloorMap({ floorMap }) {
  return (
    <div>
      {floorMap.map(floor => (
        <div key={floor.floor} style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 6 }}>
          <h3>{floor.floor}</h3>
          <ul>
            {floor.departments.map(dep => (
              <li key={dep.name}>
                <b>{dep.name}</b>（{dep.location}）：{dep.info}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
} 