import React, { Component } from 'react';
import TrinketChart from './components/TrinketChart';

export default class App extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <TrinketChart />
      </div>
    );
  }
}
