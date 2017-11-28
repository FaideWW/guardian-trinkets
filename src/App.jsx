import React, { Component } from 'react';
import { lifecycle, withStateHandlers, branch, compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import TrinketChart from './components/TrinketChart';
import TrinketTable from './components/TrinketTable';
import Header from './components/Header';
import patchTrinketData from './data/patchTrinketData';
import trinketJSON from '../2017-10-28-legendaries-at-1000/full.json';
import {
  DEFAULT_ILEVEL,
  DEFAULT_TALENTS,
  DEFAULT_TARGETCOUNT,
  DEFAULT_PANTHEON,
  DEFAULT_FON,
  DEFAULT_DISPLAY,
} from './constants';

import styles from './styles.css';
  
const trinketData = patchTrinketData(trinketJSON);

const validIlevels = [920, 940, 960];
const validTalents = ['incarn', 'gg'];
const validTargetCounts = ['1t', '3t', '5t'];
const validPantheonLevels = ['p0', 'p5', 'p10', 'p15', 'p20'];
const validDisplays = ['chart', 'table'];

const defaults = {
  ilevel: DEFAULT_ILEVEL,
  talents: DEFAULT_TALENTS,
  targetCount: DEFAULT_TARGETCOUNT,
  pantheon: DEFAULT_PANTHEON,
  isFoN: DEFAULT_FON,
  display: DEFAULT_DISPLAY,
};

function isInArray(array, el) {
  return array.indexOf(el) >= 0;
}

const withDropdownState = withStateHandlers(
  ({ location }) => {
    const stateFromLocation = decodeLocationString(location.search);
    const stateWithDefaults = {
      ilevel: isInArray(validIlevels, Number(stateFromLocation.ilevel)) ? Number(stateFromLocation.ilevel) : defaults.ilevel,
      talents: isInArray(validTalents, stateFromLocation.talents) ? stateFromLocation.talents : defaults.talents,
      targetCount: isInArray(validTargetCounts, stateFromLocation.targetCount) ? stateFromLocation.targetCount : defaults.targetCount,
      pantheon: isInArray(validPantheonLevels, stateFromLocation.pantheon) ? stateFromLocation.pantheon : defaults.pantheon,
      isFoN: (stateFromLocation.isFoN == 'true') || defaults.isFoN,
      display: isInArray(validDisplays, stateFromLocation.display) ? stateFromLocation.display : defaults.display,
    };
    return stateWithDefaults;
  },
  {
    handleSetIlevel: () => ({ value }) => ({ ilevel: value }),
    handleSetTalents: () => ({ value }) => ({ talents: value }),
    handleSetTargetCount: () => ({ value }) => ({ targetCount: value }),
    handleSetPantheon: () => ({ value }) => ({ pantheon: value }),
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
      nextProps.pantheon !== this.props.pantheon || 
      nextProps.isFoN !== this.props.isFoN ||
      nextProps.display !== this.props.display
    ) {
      // Redirect
      this.props.history.push(this.props.location.pathname + encodeLocationString(nextProps));
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
          pantheon={props.pantheon}
          isFoN={props.isFoN}
          display={props.display}
          handleSetIlevel={props.handleSetIlevel}
          handleSetTalents={props.handleSetTalents}
          handleSetTargetCount={props.handleSetTargetCount}
          handleSetPantheon={props.handleSetPantheon}
          handleSetIsFoN={props.handleSetIsFoN}
          handleSetDisplay={props.handleSetDisplay}
        />
      <section className={styles.section}>
        <DataDisplay
          ilevel={props.ilevel}
          talents={props.talents}
          targetCount={props.targetCount}
          pantheon={props.pantheon}
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
  // Remove defaults
  let str = '?';

  if (state.ilevel !== defaults.ilevel) {
    str += `ilevel=${state.ilevel}&`;
  }

  if (state.talents !== defaults.talents) {
    str += `talents=${state.talents}&`;
  }

  if (state.targetCount !== defaults.targetCount) {
    str += `targetCount=${state.targetCount}&`;
  }

  if (state.pantheon !== defaults.pantheon) {
    str += `pantheon=${state.pantheon}&`;
  }

  if (state.isFoN !== defaults.isFoN) {
    str += `isFoN=${state.isFoN}&`;
  }

  if (state.display !== defaults.display) {
    str += `display=${state.display}&`;
  }

  return str.slice(0, -1);

  // return `?ilevel=${state.ilevel}&talents=${state.talents}&targetCount=${state.targetCount}&isFoN=${state.isFoN}&display=${state.display}`;
}


export default withDropdownState(withRedirect(withRouter(App)));
