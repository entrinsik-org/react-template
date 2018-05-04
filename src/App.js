import React, { Component } from 'react';

import Informer, { withComponents } from 'react-informer';

class Gallery extends Component {
  state = { interval: 'month', chartType: 'line' };

  handleIntervalChange = event =>
    this.setState({ interval: event.target.value });

  handleChartTypeChange = event =>
    this.setState({ chartType: event.target.value });

  render() {
    const { Trend, Chart } = this.props.components;
    const { interval, chartType } = this.state;

    return (
      <div>
        <select onChange={this.handleIntervalChange}>
          <option selected={interval === 'month'} value="month">
            Month
          </option>
          <option selected={interval === 'year'} value="year">
            Year
          </option>
        </select>
        <select onChange={this.handleChartTypeChange}>
          <option selected={chartType === 'column'} value="column">
            Column
          </option>
          <option selected={chartType === 'line'} value="line">
            Line
          </option>
        </select>
        <Trend
          dataset="admin:northwind-orders"
          x="OrderDate"
          chartType={chartType}
          interval={interval}
        />
        <Chart
          dataset="admin:northwind-orders"
          chartType="pie"
          groupBy="ShipCountry"
          splitBy="ShipRegion"
        />
      </div>
    );
  }
}

const ConnectedGallery = withComponents(Gallery);

export default class App extends Component {
  render() {
    return (
      <div>
        <Informer>
          <ConnectedGallery />
        </Informer>
      </div>
    );
  }
}
