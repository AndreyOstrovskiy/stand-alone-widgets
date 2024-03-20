import { LightningElement, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/ChartjsLibrary';
import Common from 'c/common_Widget';

export default class DeliveryBlocksWidget extends LightningElement {
  @api widgetData;
  data;
  dbChart;
  chartCanvas;
  chartCtx;
  dbData;
  fromDate;
  deliveryBlocksTotal;
  IIconElement;
  DB_ICON_MESSAGE;

  @api setWidgetData(widgetData) {
    if (!widgetData) return;
    try {
      if (this.dbChart) this.dbChart.destroy();
      this.widgetData = widgetData;
      this.renderWidget();
    } catch (error) {
      console.error(error);
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
    this.dbData = this.data.delivery_blocks;
    this.fromDate = this.data.from_date;
    this.deliveryBlocksTotal = this.data.delivery_blocks_total;
    this.DB_ICON_MESSAGE = `These are blocks on ALL open orders in SAP from ${this.fromDate}`;
  }

  setIIconActionsHandler() {
    this.IIconElement.addEventListener(
      'mouseenter',
      this.mouseEnterEventHandler.bind(this)
    );
    this.IIconElement.addEventListener(
      'mouseleave',
      this.mouseLeaveEventHandler.bind(this)
    );
  }

  removeIIconActionsHandler() {
    this.IIconElement.removeEventListener(
      'mouseenter',
      this.mouseEnterEventHandler.bind(this)
    );
    this.IIconElement.removeEventListener(
      'mouseleave',
      this.mouseLeaveEventHandler.bind(this)
    );
  }

  mouseEnterEventHandler(e) {
    try {
      this.IIconElement.appendChild(
        Common.createIIcon(this.IIconElement, this.DB_ICON_MESSAGE)
      );
    } catch (error) {
      console.error(error);
    }
  }

  mouseLeaveEventHandler() {
    try {
      this.IIconElement.removeChild(this.IIconElement.lastElementChild);
    } catch (error) {
      console.error(error);
    }
  }

  renderWidget() {
    try {
      this.updateValues();

      this.chartCanvas = Common.getElByDataId(this, 'db_chart');
      this.chartCtx = this.chartCanvas.getContext('2d');

      this.IIconElement = Common.getElByDataId(
        this,
        'db_header_with_icon_header_i_icon'
      );

      this.removeIIconActionsHandler();
      this.setIIconActionsHandler();

      this.deliveryBlocksValue();
      this.drawDbChart();
    } catch (error) {
      console.error(error);
    }
  }

  deliveryBlocksValue() {
    try {
      const deliveryBlocksEl = Common.getElByDataId(this, 'db_total');
      deliveryBlocksEl.textContent = this.deliveryBlocksTotal;
    } catch (error) {
      console.error(error);
    }
  }

  drawDbChart() {
    try {
      const parsedData = this.parseData(this.dbData);

      const dbData = {
        labels: parsedData.labels,
        datasets: [
          {
            data: parsedData.values,
            backgroundColor: parsedData.colours,
          },
        ],
      };

      const options = {
        events: [''],
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
          xAxes: [
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
          yAxes: [
            {
              display: false,
              gridLines: {
                display: false,
              },
              ticks: {
                max: Math.max(...dbData.datasets[0].data) + 1,
                display: false,
                beginAtZero: true,
                stepSize: 1,
              },
            },
          ],
        },
      };

      const chartConfig = {
        type: 'bar',
        options: options,
        data: dbData,
      };

      this.dbChart = new window.Chart(this.chartCtx, chartConfig);

      Chart.plugins.register({
        afterDraw: this.setValuesAboveHandler.bind(this),
      });
    } catch (error) {
      console.error(error);
    }
  }

  setValuesAboveHandler() {
    if (this.dbChart.ctx) this.setValuesAbove(this.dbChart);
  }

  parseData(data) {
    return {
      labels: data.map((block) => {
        return block.name;
      }),
      values: data.map((block) => {
        return block.value;
      }),
      colours: data.map(() => {
        return '#3290ED';
      }),
    };
  }

  setValuesAbove(chartInstance) {
    try {
      if (chartInstance.config.options.showDatapoints) {
        const DEFAULT_TOP_GAP = 20;
        const DEFAULT_BUTTOM_GAP = 5;
        const ctx = chartInstance.chart.ctx;

        ctx.font = Chart.helpers.fontString(13, 'normal', 'Segoe UI');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#2B2826';

        chartInstance.data.datasets.forEach((dataset) => {
          dataset.data.forEach((elem, index) => {
            const model =
              dataset._meta[Object.keys(dataset._meta)[0]].data[index]._model;
            const scaleMax =
              dataset._meta[Object.keys(dataset._meta)[0]].data[index]._yScale
                .maxHeight;
            let yPos;

            if ((scaleMax - model.y) / scaleMax >= 0.93) {
              yPos = model.y + DEFAULT_TOP_GAP;
              const width = ctx.measureText(dataset.data[index]).width;
              const height = ctx.measureText(
                dataset.data[index]
              ).actualBoundingBoxAscent;
              ctx.fillStyle = '#3290ED';
              ctx.fillRect(model.x - width / 2, yPos - height, width, height);
              ctx.fillStyle = '#ffffff';
            } else {
              yPos = model.y - DEFAULT_BUTTOM_GAP;
              ctx.fillStyle = '#ffffff';
              ctx.fillText(dataset.data[index], model.x, yPos);
              ctx.fillStyle = '#2B2826';
            }

            ctx.fillText(dataset.data[index], model.x, yPos);
          });
        });
      }
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }
}
