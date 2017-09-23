import React, { Component } from 'react';
import TrinketChart from './components/TrinketChart';
import trinketJSON from '../2017-8-17-test-collation-4/full.json';

console.log('trinkets', trinketJSON);
export default class App extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <TrinketChart />
      </div>
    );
  }
}
