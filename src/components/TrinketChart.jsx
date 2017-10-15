import React  from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import getTrinketData from '../data/getTrinketData';
import { formatNumber, formatPercent } from '../format';

import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

const MIN_ILEVEL = 880;
const MAX_ILEVEL = 970;
const ilevelRange = [...Array((MAX_ILEVEL - MIN_ILEVEL) / 5 + 1).keys()].map(i => 880 + (i * 5));
const colors = {
  880: 'rgb(63, 102, 203)',
  885: 'rgb(210, 60, 32)',
  890: 'rgb(246, 154, 28)',
  895: 'rgb(49, 149, 23)',
  900: 'rgb(147, 11, 153)',
  905: 'rgb(53, 153, 197)',
  910: 'rgb(212, 71, 121)',
  915: 'rgb(109, 169, 3)',
  920: 'rgb(176, 49, 51)',
  925: 'rgb(58, 99, 148)',
  930: 'rgb(148, 70, 153)',
  935: 'rgb(66, 169, 152)',
  940: 'rgb(169, 170, 25)',
  945: 'rgb(101, 53, 203)',
  950: 'rgb(221, 116, 24)',
  955: 'rgb(132, 13, 16)',
  970: 'rgb(97, 19, 103)',
};

function TrinketChart(props) {
  const data = getTrinketData(props.data, { ...props, display: 'chart' });
  return (
    <ResponsiveContainer width="100%" maxHeight={1200} minHeight={900}>
      <BarChart 
        layout="vertical" 
        data={data} 
        width={900} 
        height={1200}
      >
        <YAxis 
          dataKey="name" 
          type="category" 
          width={300} 
          interval={0} 
        />
        <XAxis type="number" />
        <CartesianGrid horizontal={false} />
        <Tooltip 
          formatter={formatTrinketTooltip} 
          itemSorter={sortTrinketTooltip}
        />
        <Legend 
        layout="vertical"
          align="right"
          verticalAlign="top"
        />
        {ilevelRange.map((ilevel, index) => (
          <Bar 
            key={ilevel} 
            isAnimationActive={false}
            dataKey={ilevel} 
            stackId="a" 
            fill={colors[ilevel]} 
            onMouseOver={props.testMouseoverEvent}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

TrinketChart.propTypes = {
  ilevel: PropTypes.number.isRequired,
  talents: PropTypes.string.isRequired,
  targetCount: PropTypes.string.isRequired,
  isFoN: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
}

function formatTrinketTooltip(value, name, data, index) {
  const total = data.payload[`${name}-total`];
  const baseline = (total - data.payload[`${name}-gain`]);
  const gain = (total / baseline) - 1;
  return `${formatNumber(total)} (${formatPercent(gain)})`;
}

function sortTrinketTooltip(a, b) {
  return b.payload[`${b.name}-total`] - a.payload[`${a.name}-total`];
}

export default pure(TrinketChart);

