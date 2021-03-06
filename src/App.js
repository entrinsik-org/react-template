import React, { Component } from 'react';

import Informer, { withComponents, Pivot } from 'react-informer';

class Gallery extends Component {
  state = { interval: 'month', chartType: 'line' };

  handleIntervalChange = event =>
    this.setState({ interval: event.target.value });

  handleChartTypeChange = event =>
    this.setState({ chartType: event.target.value });

  render() {
    const { Trend, Chart, Summary } = this.props.components;
    const { interval, chartType } = this.state;

    return (
      <div>
        <select value={interval} onChange={this.handleIntervalChange}>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <select value={chartType} onChange={this.handleChartTypeChange}>
          <option value="column">Column</option>
          <option value="line">Line</option>
          <option value="spline">Spline</option>
          <option value="spline">Spline</option>
          <option value="areaspline">Areaspline</option>
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
        <Summary
          style={{ height: 400 }}
          dataset="admin:northwind-orders"
          groupColumns={['ShipCountry', 'ShipRegion']}
          aggregateColumns={['sum:orderAmount', 'count']}
        />
        <Pivot
          style={{ height: 400 }}
          dataset="admin:northwind-orders"
          rows={['ShipCountry', 'ShipRegion']}
          columns={['OrderDate:month_of_year']}
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
