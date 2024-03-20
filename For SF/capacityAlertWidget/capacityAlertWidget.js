import { LightningElement, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/ChartjsLibrary';
import Common from 'c/common_Widget';

export default class CapacityAlertWidget extends LightningElement {
  @api widgetData;
  data;
  meta;
  caChart;
  chartCanvas;
  chartCtx;

  @api setWidgetData(widgetData) {
    if (!widgetData) return;
    try {
      if (this.caChart) this.caChart.destroy();
      const tooltipEl = document.querySelector(`[data-id="ca-tooltip"]`);
      if (tooltipEl) tooltipEl.remove();
      this.widgetData = widgetData;
      this.renderWidget();
    } catch (error) {
      console.error(error);
    }
  }

  connectedCallback() {
    Promise.all([
      loadStyle(this, chartjs + '/TruckCapacity/capacityAlertWidget.css'),
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

  parseData(data) {
    return {
      labels: data.days.map((day) => {
        return day.date_to_display;
      }),
      values: data.days.map((day) => {
        return day.number_of_trucks;
      }),
      colours: data.days.map((day) => {
        return day.is_over_limit === 'true' ? '#F2536D' : '#3290ED';
      }),
    };
  }

  renderWidget() {
    try {
      this.data = JSON.parse(this.widgetData);
      this.chartCanvas = Common.getElByDataId(this, 'ca_chart');
      this.chartCtx = this.chartCanvas.getContext('2d');

      const parsedData = this.parseData(this.data);
      const labels = parsedData.labels;
      const values = parsedData.values;
      const colours = parsedData.colours;

      const caData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colours,
          },
        ],
      };

      const options = {
        events: ['click'],
        showDatapoints: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
          custom: this.renderTooltip.bind(this),
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
                max: Math.max(...caData.datasets[0].data) + 1,
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
        data: caData,
      };

      this.caChart = new window.Chart(this.chartCtx, chartConfig);

      this.meta = this.caChart.getDatasetMeta(0);

      Chart.plugins.register({
        afterDraw: this.setValuesAboveHandler.bind(this),
      });
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }

  setValuesAboveHandler() {
    if (this.caChart.ctx) this.setValuesAbove(this.caChart);
  }

  removeAllChildEl(node) {
    while (node.lastElementChild) {
      node.removeChild(node.lastElementChild);
    }
  }

  createTooltip(dataArray) {
    if (!dataArray) {
      return;
    }
    const tooltipHtml = document.createElement('div');
    tooltipHtml.classList.add('ca_tooltip');

    const tableDiv = document.createElement('div');
    tableDiv.dataset.id = 'ca_table';

    const closeDiv = document.createElement('div');
    closeDiv.classList.add('ca_close');
    closeDiv.dataset.id = 'ca_close';

    const tableHeader = [];
    const tableData = [];

    tableHeader.push(['Location', 'No. of trucks']);

    for (const el of dataArray) {
      tableData.push([el.location_name, el.number_of_trucks, el.is_over_limit]);
    }

    this.createTableHandler(tableHeader, tableData, tableDiv);

    tooltipHtml.appendChild(tableDiv);
    tooltipHtml.appendChild(closeDiv);

    return tooltipHtml.outerHTML;
  }

  createTableHandler(tableHeader, tableData, appendToElem) {
    const divTableHandler = document.createElement('div');
    divTableHandler.classList.add('ca_scroll_table');
    const divHeader = document.createElement('div');
    divHeader.classList.add('ca_scroll_table_header');
    this.createTable(tableHeader, divHeader, true);

    divTableHandler.appendChild(divHeader);

    const divBody = document.createElement('div');
    divBody.classList.add('ca_scroll_table_body');
    this.createTable(tableData, divBody, false);

    divTableHandler.appendChild(divBody);

    appendToElem.appendChild(divTableHandler);
  }

  createTable(tableData, appendToElem, isHeader) {
    const table = document.createElement('table');

    const tableContent = isHeader
      ? document.createElement('thead')
      : document.createElement('tbody');

    tableData.forEach(function (rowData) {
      const row = document.createElement('tr');

      rowData.forEach(function (cellData, index) {
        let cell;
        if (isHeader) {
          cell = document.createElement('th');
        } else {
          if (index === 2) {
            return;
          }
          cell = document.createElement('td');
          if (rowData[2] === 'true') {
            if (index === 1) {
              cell.classList.add('ca_over_limit');
            }
          }
        }

        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });

      tableContent.appendChild(row);
    });

    table.appendChild(tableContent);
    appendToElem.appendChild(table);
  }

  renderTooltip(context) {
    try {
      const DEFAULT_TOOLTIP_WIDTH = 320;
      const DEFAULT_TOOLTIP_HEIGHT = 352;
      const DEFAULT_TOOLTIP_GAP = 15;
      const RIGHT = 'RIGHT';
      const LEFT = 'LEFT';

      let tooltipEl = document.querySelector(`[data-id="ca-tooltip"]`);

      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.dataset.id = 'ca-tooltip';
        tooltipEl.classList.add('ca-tooltip');
        document.body.appendChild(tooltipEl);
      } else {
        if (context.opacity === 0) {
          tooltipEl.remove();
        }
        this.removeAllChildEl(tooltipEl);
      }

      if (context.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
      }
      tooltipEl.classList.remove('above', 'below', 'no-transform');
      if (context.yAlign) {
        tooltipEl.classList.add(context.yAlign);
      } else {
        tooltipEl.classList.add('no-transform');
      }

      const index = context.dataPoints[0].index;
      const dataArray = this.data.days[index].shipTo_details;

      const tooltipElHtml = this.createTooltip(dataArray);
      tooltipEl.insertAdjacentHTML('beforeend', tooltipElHtml);

      let tooltipWidth = tooltipEl
        ? parseInt(tooltipEl.offsetWidth)
        : DEFAULT_TOOLTIP_WIDTH;

      const tooltipHeight = tooltipEl
        ? parseInt(tooltipEl.offsetHeight)
        : DEFAULT_TOOLTIP_HEIGHT;

      const tooltipGap = DEFAULT_TOOLTIP_GAP;

      const targetX = parseInt(context.caretX);
      const targetHalfWidth = parseInt(this.meta.data[index]._model.width) / 2;
      const chartElementWidth = parseInt(this.chartCtx.canvas.offsetWidth);

      const positionOfTooltip =
        targetX + tooltipWidth + tooltipGap > chartElementWidth ? RIGHT : LEFT;

      if (positionOfTooltip === RIGHT) {
        tooltipEl.classList.remove('ca_arrow_left');
        tooltipEl.classList.add('ca_arrow_right');
      } else {
        tooltipEl.classList.remove('ca_arrow_right');
        tooltipEl.classList.add('ca_arrow_left');
      }

      const position = this.chartCanvas.getBoundingClientRect();

      tooltipEl.style.opacity = 1;
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.zIndex = 1;
      if (positionOfTooltip === LEFT) {
        tooltipEl.style.left =
          position.left + context.caretX + targetHalfWidth + tooltipGap + 'px';
      } else {
        tooltipEl.style.left =
          position.left +
          context.caretX -
          targetHalfWidth -
          tooltipWidth -
          tooltipGap +
          'px';
      }

      tooltipEl.style.top =
        position.top +
        context.caretY +
        (this.meta.data[index]._model.base - this.meta.data[index]._model.y) /
          2 -
        tooltipHeight / 2 +
        'px';

      const tableBody = tooltipEl.querySelector('.ca_scroll_table_body');
      const tableHeader = tooltipEl.querySelector('.ca_scroll_table_header');

      if (tableBody.scrollHeight <= tableBody.clientHeight) {
        tableHeader.style.paddingRight = '0px';
        tableBody.style.height = 'auto';
      }

      const closeEl = tooltipEl.querySelector('[data-id="ca_close"]');

      closeEl.addEventListener('click', () => {
        tooltipEl.remove();
        this.chartCanvas.click();
      });
    } catch (error) {
      alert(error);
      console.error(error);
    }
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
            if ((scaleMax - model.y) / scaleMax >= 0.8) {
              yPos = model.y + DEFAULT_TOP_GAP;
              const width = ctx.measureText(dataset.data[index]).width;
              const height = ctx.measureText(
                dataset.data[index]
              ).actualBoundingBoxAscent;
              ctx.fillStyle =
                this.data.days[index].is_over_limit === 'true'
                  ? '#F2536D'
                  : '#3290ED';
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
