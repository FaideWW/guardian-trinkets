import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import getTrinketData from '../data/getTrinketData';
import { formatNumber, formatPercent } from '../format';

import styles from './TrinketTable.css';

function TrinketTable(props) {
  const data = getTrinketData(props.data, { ...props, display: 'table' });
  console.log(data);
  return (
    <table className={styles.table}>
      <thead className={styles.head}>
        <tr>
          <th className={styles.heading}>#</th>
          <th className={styles.heading}>Name</th>
          <th className={styles.heading}>Item Level</th>
          <th className={styles.heading}>DPS</th>
          <th className={styles.heading}>Gain (from Baseline)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => (
          <tr className={styles.row} key={i}>
            <td className={styles.cell}>{i + 1}</td>
            <td className={styles.cell}>{d.name}</td>
            <td className={styles.cell}>{d.ilevel}</td>
            <td className={styles.cell}>{formatNumber(d.dps)}</td>
            <td className={styles.cell}>{formatPercent(d.gain)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

TrinketTable.propTypes = {
  ilevel: PropTypes.number.isRequired,
  talents: PropTypes.string.isRequired,
  targetCount: PropTypes.string.isRequired,
  isFoN: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
}

export default pure(TrinketTable);
