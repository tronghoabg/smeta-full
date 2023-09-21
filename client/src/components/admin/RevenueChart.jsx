import React, { Component, useEffect, useState } from 'react';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function ChartExample({ data }) {
  const datas = [
    { name: 'Tháng 1', $: 4000, user: 2400 },
    { name: 'Tháng 2', $: 3000, user: 1398 },
    { name: 'Tháng 3', $: 2000, user: 9800 },
    { name: 'Tháng 4', $: 2780, user: 3908 },
    { name: 'Tháng 5', $: 1890, user: 4800 },
    { name: 'Tháng 6', $: 2390, user: 3800 },
    { name: 'Tháng 7', $: 3490, user: 4300 },
  ]

  console.log(data);
  return (
    <ResponsiveContainer className="chart" height={300} width="100%">
      <LineChart
        //  width={600} 
        //  height={300} 
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="$" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="user" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ChartExample;
