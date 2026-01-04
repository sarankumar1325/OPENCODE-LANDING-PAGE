import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Commits', value: 6500 },
  { name: 'Stars', value: 45000 },
  { name: 'Users', value: 650000 },
  { name: 'Forks', value: 3200 },
  { name: 'Issues', value: 1200 },
];

export const Stats: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[40px] font-mono text-xs opacity-50 hover:opacity-100 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={2}>
          <Tooltip 
            cursor={{fill: '#27272a'}}
            contentStyle={{ backgroundColor: '#09090b', borderColor: '#22c55e', color: '#e4e4e7' }}
            itemStyle={{ color: '#22c55e' }}
          />
          <Bar dataKey="value" fill="#22c55e" barSize={4} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};