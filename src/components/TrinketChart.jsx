import React  from 'react';
import PropTypes from 'prop-types';

import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

const colors = {
  900: 'blue',
  905: 'red',
};
const data = [
  { name: 'Trinket A', '900': 10, '905': 15 },
  { name: 'Trinket B', '900': 15, '905': 20 },
];

function TrinketChart(props) {
  return (
    <div>
    <BarChart layout="vertical" data={data} width={500} height={600}>
    <YAxis dataKey="name" type="category" />
    <XAxis type="number"/>
    <CartesianGrid horizontal={false} />
    <Tooltip />
    <Legend />
    <Bar dataKey="900" stackId="a" fill={colors[900]} />
    <Bar dataKey="905" stackId="a" fill={colors[905]} />
    </BarChart>
    </div>
  );
}

TrinketChart.propTypes = {
}

export default TrinketChart;
