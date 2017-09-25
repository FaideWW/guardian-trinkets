import React, { Component } from 'react';
import { withStateHandlers } from 'recompose';
import TrinketChart from './components/TrinketChart';
import Header from './components/Header';
import getTrinketData from './getTrinketData';
import trinketJSON from '../2017-8-17-test-collation-4/full.json';

import styles from './styles.css';

const withDropdownState = withStateHandlers(
  ({
    ilevel: 940,
    talents: 'gg',
    targetCount: '1t',
    isFoN: false
  }),
  {
    handleSetIlevel: () => ({ value }) => ({ ilevel: value }),
    handleSetTalents: () => ({ value }) => ({ talents: value }),
    handleSetTargetCount: () => ({ value }) => ({ targetCount: value }),
    handleSetIsFoN: () => ({ value }) => ({ isFoN: value }),
  }
);

function App(props) {
  console.log(props);
  const trinketData = getTrinketData(trinketJSON, props);
  console.log('trinketData', trinketData);
  return (
    <div>
        <Header 
          ilevel={props.ilevel}
          talents={props.talents}
          targetCount={props.targetCount}
          isFoN={props.isFoN}
          handleSetIlevel={props.handleSetIlevel}
          handleSetTalents={props.handleSetTalents}
          handleSetTargetCount={props.handleSetTargetCount}
          handleSetIsFoN={props.handleSetIsFoN}
        />
      <section className={styles.section}>
        <TrinketChart data={trinketData} />
      </section>
    </div>
  );
}

export default withDropdownState(App);
