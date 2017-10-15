import React, { Component } from 'react';
import { lifecycle, withStateHandlers, branch, compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import TrinketChart from './components/TrinketChart';
import TrinketTable from './components/TrinketTable';
import Header from './components/Header';
import patchTrinketData from './data/patchTrinketData';
import trinketJSON from '../2017-8-17-test-collation-4/full.json';

import styles from './styles.css';
  
const trinketData = patchTrinketData(trinketJSON);

const validIlevels = [900, 920, 940];
const validTalents = ['incarn', 'gg'];
const validTargetCounts = ['1t', '3t', '5t'];
const validDisplays = ['chart', 'table'];
function isInArray(array, el) {
  return array.indexOf(el) >= 0;
}

const withDropdownState = withStateHandlers(
  ({ location }) => {
    const stateFromLocation = decodeLocationString(location.search);
    const stateWithDefaults = {
      ilevel: isInArray(validIlevels, Number(stateFromLocation.ilevel)) ? Number(stateFromLocation.ilevel) : 940,
      talents: isInArray(validTalents, stateFromLocation.talents) ? stateFromLocation.talents : 'gg',
      targetCount: isInArray(validTargetCounts, stateFromLocation.targetCount) ? stateFromLocation.targetCount : '1t',
      isFoN: (stateFromLocation.isFoN == 'true') || false,
      display: isInArray(validDisplays, stateFromLocation.display) ? stateFromLocation.display : 'chart',
    };
    return stateWithDefaults;
  },
  {
    handleSetIlevel: () => ({ value }) => ({ ilevel: value }),
    handleSetTalents: () => ({ value }) => ({ talents: value }),
    handleSetTargetCount: () => ({ value }) => ({ targetCount: value }),
    handleSetIsFoN: () => ({ value }) => ({ isFoN: value }),
    handleSetDisplay: () => ({ value }) => ({ display: value }),
  }
);

const withRedirect = lifecycle({
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.ilevel !== this.props.ilevel || 
      nextProps.talents !== this.props.talents || 
      nextProps.targetCount !== this.props.targetCount || 
      nextProps.isFoN !== this.props.isFoN ||
      nextProps.display !== this.props.display
    ) {
      // Redirect
      this.props.history.push(encodeLocationString(nextProps));
    }
  },
});

function App(props) {
  const DataDisplay = (props.display === 'chart') ? TrinketChart : TrinketTable;
  return (
    <div>
        <Header
          ilevel={props.ilevel}
          talents={props.talents}
          targetCount={props.targetCount}
          isFoN={props.isFoN}
          display={props.display}
          handleSetIlevel={props.handleSetIlevel}
          handleSetTalents={props.handleSetTalents}
          handleSetTargetCount={props.handleSetTargetCount}
          handleSetIsFoN={props.handleSetIsFoN}
          handleSetDisplay={props.handleSetDisplay}
        />
      <section className={styles.section}>
        <DataDisplay
          ilevel={props.ilevel}
          talents={props.talents}
          targetCount={props.targetCount}
          isFoN={props.isFoN}
          data={trinketData} 
        />
      </section>
    </div>
  );
}

function decodeLocationString(location) {
  if (location.length < 2) {
    return {};
  }
  
  return location
    .slice(1)
    .split('&')
    .map(query => query.split('='))
    .reduce((state, query) => {
      if (!(query[0] && query[1])) {
        return state;
      }
      state[query[0]] = query[1];
      return state;
    }, {});
}

function encodeLocationString(state) {
  return `?ilevel=${state.ilevel}&talents=${state.talents}&targetCount=${state.targetCount}&isFoN=${state.isFoN}&display=${state.display}`;
}


export default withDropdownState(withRedirect(withRouter(App)));
