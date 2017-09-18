import React  from 'react';
import PropTypes from 'prop-types';

import { Bar } from 'react-chartjs-2';

function TrinketChart(props) {
  return (
    <div>
      <Bar
        label={['one', 'two']}
        data={[10, 20]}
      />
    </div>
  );
}

TrinketChart.propTypes = {
}

export default TrinketChart;
