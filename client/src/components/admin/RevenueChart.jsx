import React, { Component, useEffect, useState } from 'react';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function ChartExample({ data }) {
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
