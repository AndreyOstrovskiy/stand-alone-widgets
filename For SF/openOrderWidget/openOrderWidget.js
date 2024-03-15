import { LightningElement, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/ChartjsLibrary';
import Common from 'c/common_Widget';

export default class OpenOrderWidget extends LightningElement {
  @api widgetData;
  data;
  meta;
  ooChart;
  chartCanvas;
  chartCtx;
  openOrdersMsu;
  openOrdersSummaryValue;
  ooData;
  startMBDAT;
  endMBDAT;
  OO_ICON_MESSAGE;

  @api setWidgetData(widgetData) {
    if (this.ooChart) {
      try {
        this.updateValues();
        const IIconElement = Common.getElByDataId(
          this,
          'oo_header_with_icon_header_i_icon'
        );

        Common.removeIIconActionsHandler(IIconElement, this.OO_ICON_MESSAGE);
        Common.setIIconActionsHandler(IIconElement, this.OO_ICON_MESSAGE);

        const parsedData = this.parseData(this.ooData);
        const labels = parsedData.labels;
        const values = parsedData.values;
        const colours = parsedData.colours;

        this.ooChart.data.labels = labels;
        this.ooChart.data.datasets[0].data = values;
        this.ooChart.data.datasets[0].backgroundColor = colours;

        this.openOrdersValue();
        this.ooChart.update();
      } catch (error) {
        console.error(error);
      }
    } else {
      this.widgetData = widgetData;
      this.renderWidget();
    }
  }

  connectedCallback() {
    Promise.all([
      loadStyle(this, chartjs + '/Common/common.css'),
      loadScript(this, chartjs + '/chartjs_v280.js'),
    ])
      .then(() => {
        this.renderWidget();
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  }

  updateValues() {
    this.data = JSON.parse(this.widgetData);
    this.ooData = this.sortData(this.data.categories);
    this.startMBDAT = this.data.start_MBDAT;
    this.endMBDAT = this.data.end_MBDAT;
    this.openOrdersMsu = this.data.open_orders_MSU
      ? this.data.open_orders_MSU
      : '0';
    this.openOrdersSummaryValue = this.data.open_orders_summary_value
      ? this.data.open_orders_summary_value
      : 0;
    this.OO_ICON_MESSAGE = `These are orders going through the AV cycle from ${this.startMBDAT} to ${this.endMBDAT}`;
  }

  renderWidget() {
    this.updateValues();

    this.chartCanvas = Common.getElByDataId(this, 'oo_chart_canvas');
    this.chartCtx = this.chartCanvas.getContext('2d');
    const IIconElement = Common.getElByDataId(
      this,
      'oo_header_with_icon_header_i_icon'
    );

    Common.setIIconActionsHandler(IIconElement, this.OO_ICON_MESSAGE);

    this.openOrdersValue();
    if (this.ooData && this.ooData.length > 0) {
      this.drawOoChart();
    }
  }

  openOrdersValue() {
    const openOrdersMSUEl = Common.getElByDataId(this, 'open-orders-msu');
    openOrdersMSUEl.textContent = this.openOrdersMsu;

    const valueObj = Common.convertToInternationalCurrencySystem(
      this.openOrdersSummaryValue
    );

    const currency = Common.getCurrencySymbol(
      navigator.language,
      this.data.currency
    );
    const amount = valueObj.value;
    const measure = valueObj.measure;

    const currencyEl = Common.getElByDataId(this, 'oo_currency');
    currencyEl.textContent = currency;

    const amountEl = Common.getElByDataId(this, 'oo_value');
    amountEl.textContent = amount;

    const measureEl = Common.getElByDataId(this, 'oo_measure');
    measureEl.textContent = measure;
  }

  sortData(dataToSort) {
    const resultArray = [];

    for (const obj of dataToSort) {
      resultArray.push({
        name: obj.name,
        value: obj.value,
      });
    }

    resultArray.sort((a, b) => {
      return b.value - a.value;
    });

    return resultArray;
  }

  parseData(data) {
    return {
      labels: data.map((category) => {
        return category.name;
      }),
      values: data.map((category) => {
        return category.value;
      }),
      colours: data.map(() => {
        return '#9D53F2';
      }),
    };
  }

  drawOoChart() {
    try {
      const parsedData = this.parseData(this.ooData);
      const labels = parsedData.labels;
      const values = parsedData.values;
      const colours = parsedData.colours;

      const ooWidgetData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colours,
          },
        ],
      };

      const options = {
        events: [],
        showDatapoints: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        animation: {
          duration: 1000,
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
        scales: {
          yAxes: [
            {
              display: true,
              gridLines: {
                display: false,
              },
              ticks: {
                display: true,
                fontColor: '#2B2826',
                fontFamily: 'Segoe UI',
                fontSize: 13,
                fontStyle: 'normal',
              },
            },
          ],
          xAxes: [
            {
              display: false,
              gridLines: {
                display: false,
              },
              ticks: {
                max: Math.max(...ooWidgetData.datasets[0].data) + 0.1,
                display: false,
                beginAtZero: true,
                stepSize: 0.1,
              },
            },
          ],
        },
      };

      const chartConfig = {
        type: 'horizontalBar',
        options: options,
        data: ooWidgetData,
      };

      this.ooChart = new window.Chart(this.chartCanvas, chartConfig);

      this.setValuesAbove(this.ooChart);

      Chart.plugins.register({
        afterDraw: this.setValuesAboveHandler.bind(this),
      });
    } catch (error) {
      console.error(error);
    }
  }

  setValuesAboveHandler() {
    if (this.ooChart.ctx) this.setValuesAbove(this.ooChart);
  }

  setValuesAbove(chartInstance) {
    try {
      if (chartInstance.config.options.showDatapoints) {
        const DEFAULT_X_GAP_RIGHT = 20;
        const DEFAULT_X_GAP_LEFT = 20;

        const ctx = chartInstance.chart.ctx;

        ctx.font = Chart.helpers.fontString(12, 'normal', 'Segoe UI');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        chartInstance.data.datasets.forEach(function (dataset) {
          dataset.data.forEach((elem, index) => {
            ctx.fillStyle = '#2B2826';
            const model =
              dataset._meta[Object.keys(dataset._meta)[0]].data[index]._model;
            const xScale =
              dataset._meta[Object.keys(dataset._meta)[0]].data[index]._xScale;
            const scaleMax = xScale.maxWidth;
            const yPos =
              model.y +
              ctx.measureText(dataset.data[index]).fontBoundingBoxAscent / 2;

            let xPos;

            if ((scaleMax - model.x) / scaleMax >= 0) {
              xPos = model.x + DEFAULT_X_GAP_RIGHT;
              ctx.fillStyle = '#ffffff';
              ctx.fillText(dataset.data[index], xPos, yPos);
              ctx.fillStyle = '#2B2826';
            } else {
              xPos = model.x - DEFAULT_X_GAP_LEFT;
              ctx.fillStyle = '#9D53F2';
              ctx.fillText(dataset.data[index], xPos, yPos);
              ctx.fillStyle = '#ffffff';
            }

            ctx.fillText(dataset.data[index], xPos, yPos);
          });
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
