import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import styles from './Header.css';
import 'react-select/dist/react-select.css';

const validIlevels = [
  { value: 900, label: '900' },
  { value: 920, label: '920' },
  { value: 940, label: '940' },
];

const validTalents = [
  { value: 'gg', label: 'Galactic Guardian' },
  { value: 'incarn', label: 'Incarnation' },
];

const validTargetCount = [
  { value: '1t', label: '1 Target' },
  { value: '3t', label: '3 Targets' },
  { value: '5t', label: '5 Targets' },
];

const validIsFoN = [
  { value: false, label: 'No' },
  { value: true, label: 'Yes' },
];

export default function Header(props) {
  return (
    <header className={styles.header}>
      <div className={styles.item}>
        Item Level:
        <Select className={styles.select} name="form-ilevel" options={validIlevels} onChange={props.handleSetIlevel} value={props.ilevel} clearable={false} />
      </div>
      <div className={styles.item}>
        Talents:
        <Select className={styles.select} name="form-talents" options={validTalents} onChange={props.handleSetTalents} value={props.talents} clearable={false} />
      </div>
      <div className={styles.item}>
        Target Count:
        <Select className={styles.select} name="form-targetCount" options={validTargetCount} onChange={props.handleSetTargetCount} value={props.targetCount} clearable={false} />
      </div>
      <div className={styles.item}>
        Fury of Nature?:
        <Select className={styles.select} name="form-isFoN" options={validIsFoN} onChange={props.handleSetIsFoN} value={props.isFoN} clearable={false} />
      </div>
    </header>
  );
}
