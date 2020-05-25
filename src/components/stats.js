import AbstractComponent from "./abstract-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {sortObjectByValues} from "../utils/common.js";
import {TRIP_POINTS_TYPES} from "../consts.js";

const BAR_HEIGHT = 55;

const DataTypes = {
  PRICE: `price`,
  TRANSPORT: `transport`,
  TIME: `time`
};

const chartOptions = (title, format, isPrefix) => {
  return ({
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `${isPrefix ? `${format}${val}` : `${val}${format}`}`
      }
    },
    title: {
      display: true,
      text: title,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  });
};

const getData = (points, dataType) => {
  const data = {};
  points.forEach((point) => {
    const name = point.type;
    let term = 1;
    if (dataType === DataTypes.TIME) {
      term = point.dateEnd.getTime() - point.dateStart.getTime();
    } else if (dataType) {
      term = point[dataType];
    }
    if (data[name]) {
      data[name] += term;
    } else {
      data[name] = term;
    }
  });
  const sortedData = sortObjectByValues(data);
  return sortedData;
};

const renderMoneyChart = (points) => {
  const moneyCtx = document.querySelector(`.statistics__chart--money`);
  moneyCtx.height = BAR_HEIGHT * 6;
  const moneyData = getData(points, DataTypes.PRICE);
  const types = Object.keys(moneyData);
  const prices = Object.values(moneyData);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: prices,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: chartOptions(`MONEY`, `€ `, true)
  });
};

const renderTransportChart = (points) => {
  const transportCtx = document.querySelector(`.statistics__chart--transport`);
  transportCtx.height = BAR_HEIGHT * 4;

  const transportData = getData(points);
  const types = Object.keys(transportData);
  const counts = Object.values(transportData);

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: counts,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: chartOptions(`TRANSPORT`, `x`)
  });
};

const renderTimeChart = (points) => {
  const timeSpendCtx = document.querySelector(`.statistics__chart--time`);
  timeSpendCtx.height = BAR_HEIGHT * 4;

  const timeData = getData(points, DataTypes.TIME);
  const types = Object.keys(timeData);
  const durations = Object.values(timeData).map((item) => Math.ceil(item / 3600000));

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: durations,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: chartOptions(`TIME SPENT`, `H`)
  });
};

const createStatsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractComponent {
  constructor(points) {
    super();
    this._moneyChart = null;
    this._timeChart = null;
    this._transportChart = null;
    this._points = points;
  }

  show() {
    this.renderCharts(this._points.getPoints());
    super.show();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  renderCharts(points) {
    const actionPoints = points.filter((item) => TRIP_POINTS_TYPES[item.type].action === `to`);
    this._resetCharts();
    this._moneyChart = renderMoneyChart(points);
    this._timeChart = renderTimeChart(points);
    this._transportChart = renderTransportChart(actionPoints);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }
    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }
  }
}
