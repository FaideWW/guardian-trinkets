import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withHandlers } from 'recompose';

import styles from './DisplayButtonGroup.css';

const withActions = withHandlers({
  handleClickChart: ({ onChange }) => () => onChange({ value: 'chart' }),
  handleClickTable: ({ onChange }) => () => onChange({ value: 'table' }),
});

function DisplayButtonGroup(props) {
  return (
    <div> 
      <button 
        value="chart" 
        className={classNames(styles.button, { [styles.active]: props.display === 'chart' })} 
        onClick={props.handleClickChart}
      >
        Chart
      </button>
      <button 
        value="table" 
        className={classNames(styles.button, { [styles.active]: props.display === 'table' })} 
        onClick={props.handleClickTable}
      >
        Table
      </button>
    </div>
  )
}

DisplayButtonGroup.propTypes = {
  display: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default withActions(DisplayButtonGroup);
