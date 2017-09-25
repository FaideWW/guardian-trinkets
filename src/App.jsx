import React, { Component } from 'react';
import { withStateHandlers, branch, compose } from 'recompose';
import TrinketChart from './components/TrinketChart';
import TrinketTable from './components/TrinketTable';
import Header from './components/Header';
import getTrinketData from './data/getTrinketData';
import patchTrinketData from './data/patchTrinketData';
import trinketJSON from '../2017-8-17-test-collation-4/full.json';

import styles from './styles.css';

const withDropdownState = withStateHandlers(
  ({
    ilevel: 940,
    talents: 'gg',
    targetCount: '1t',
    isFoN: false,
    showChart: false,
  }),
  {
    handleSetIlevel: () => ({ value }) => ({ ilevel: value }),
    handleSetTalents: () => ({ value }) => ({ talents: value }),
    handleSetTargetCount: () => ({ value }) => ({ targetCount: value }),
    handleSetIsFoN: () => ({ value }) => ({ isFoN: value }),
    handleSetShowChart: () => ({ value }) => ({ showChart: value }),
  }
);

function App(props) {
  console.log(props);
  const trinketData = getTrinketData(patchTrinketData(trinketJSON), props);
  console.log('trinketData', trinketData);


  let dataDisplay = null;
  if (props.showChart) {
    dataDisplay = <TrinketChart data={trinketData} />;
  } else {
    dataDisplay = <TrinketTable data={trinketData} />;
  }
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
        {dataDisplay}
      </section>
    </div>
  );
}

export default withDropdownState(App);
