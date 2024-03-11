import { init, renderErrorMessage } from '../../../../common/logic/common.js';

export function initCaWidget(pathForOnePage) {
  const mainWidgetContainer = document.getElementById(
    'ca-main-widget-container'
  );
  const mainWorkingArea = mainWidgetContainer.querySelector('#ca-working-area');
  const loadTemplate = mainWidgetContainer.querySelector('#ca-loader');
  const errorFetchDataTemplate = mainWidgetContainer.querySelector('#ca-error');

  const JSON_FILE_PATH = pathForOnePage
    ? pathForOnePage
    : './static/capacity-alert.json';

  const DEFAULT_TOOLTIP_WIDTH = 320;
  const DEFAULT_TOOLTIP_HEIGHT = 352;
  const DEFAULT_TOOLTIP_GAP = 15;
  const RIGHT = 'RIGHT';
  const LEFT = 'LEFT';

  init(
    JSON_FILE_PATH,
    mainWorkingArea,
    loadTemplate,
    errorFetchDataTemplate,
    'ca-error-message',
    renderWidgetHandler
  );

  function renderWidgetHandler(data) {
    try {
      renderWidget(data);
    } catch (e) {
      const LOAD_WIDGET_ERROR = 'Unable to load widget';
      renderErrorMessage(
        LOAD_WIDGET_ERROR,
        e,
        mainWorkingArea,
        errorFetchDataTemplate,
        'ca-error-message'
      );
    }
  }

  function renderWidget(data) {
    const widgetTemplate = mainWidgetContainer.querySelector('#ca-widget');

    const clonWidgetTemplate = widgetTemplate.content.cloneNode(true);
    mainWorkingArea.appendChild(clonWidgetTemplate);

    const chartCanvas = mainWorkingArea.querySelector('#ca_chart');

    const colors = [];

    const labels = data.days.map((day) => {
      if (day.is_over_limit === 'true') {
        colors.push('#F2536D');
      } else {
        colors.push('#3290ED');
      }

      return day.date_to_display;
    });

    const values = data.days.map((day) => {
      return day.number_of_trucks;
    });

    function removeAllChildEl(node) {
      while (node.lastElementChild) {
        node.removeChild(node.lastElementChild);
      }
    }

    function createTooltip(dataArray) {
      if (!dataArray) {
        return '<div id="unvisible" class="unvisible"></div>';
      }
      const tooltipHtml = document.createElement('div');
      tooltipHtml.classList.add('ca_tooltip');

      const tableDiv = document.createElement('div');
      tableDiv.id = 'ca_table';

      const closeDiv = document.createElement('div');
      closeDiv.classList.add('ca_close');
      closeDiv.id = 'ca_close';

      const tableHeader = [];
      const tableData = [];

      tableHeader.push(['Location', 'No. of trucks']);

      for (const el of dataArray) {
        tableData.push([
          el.location_name,
          el.number_of_trucks,
          el.is_over_limit,
        ]);
      }

      createTableHandler(tableHeader, tableData, tableDiv);

      tooltipHtml.appendChild(tableDiv);
      tooltipHtml.appendChild(closeDiv);

      return tooltipHtml.outerHTML;
    }

    function createTableHandler(tableHeader, tableData, appendToElem) {
      const divTableHandler = document.createElement('div');
      divTableHandler.classList.add('ca_scroll_table');
      const divHeader = document.createElement('div');
      divHeader.classList.add('ca_scroll_table_header');
      createTable(tableHeader, divHeader, true);

      divTableHandler.appendChild(divHeader);

      const divBody = document.createElement('div');
      divBody.classList.add('ca_scroll_table_body');
      createTable(tableData, divBody, false);

      divTableHandler.appendChild(divBody);

      appendToElem.appendChild(divTableHandler);
    }

    function createTable(tableData, appendToElem, isHeader) {
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

    const renderTooltip = (context) => {
      let tooltipEl = document.getElementById('ca-tooltip');

      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'ca-tooltip';
        document.body.appendChild(tooltipEl);
      } else {
        if (context.opacity === 0) {
          tooltipEl.remove();
        }
        removeAllChildEl(tooltipEl);
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
      const dataArray = data.days[index].shipTo_details;

      const tooltipElHtml = createTooltip(dataArray);
      tooltipEl.insertAdjacentHTML('beforeend', tooltipElHtml);

      let tooltipWidth = tooltipEl
        ? parseInt(tooltipEl.offsetWidth)
        : DEFAULT_TOOLTIP_WIDTH;

      const tooltipHeight = tooltipEl
        ? parseInt(tooltipEl.offsetHeight)
        : DEFAULT_TOOLTIP_HEIGHT;

      const tooltipGap = DEFAULT_TOOLTIP_GAP;

      const targetX = parseInt(context.caretX);
      const targetHalfWidth = parseInt(meta.data[index]._model.width) / 2;
      const chartElementWidth = parseInt(chartCanvas.offsetWidth);

      const positionOfTooltip =
        targetX + tooltipWidth + tooltipGap > chartElementWidth ? RIGHT : LEFT;

      if (positionOfTooltip === RIGHT) {
        tooltipEl.classList.remove('ca_arrow_left');
        tooltipEl.classList.add('ca_arrow_right');
      } else {
        tooltipEl.classList.remove('ca_arrow_right');
        tooltipEl.classList.add('ca_arrow_left');
      }

      const position = chartCanvas.getBoundingClientRect();

      tooltipEl.style.opacity = 1;
      tooltipEl.style.position = 'absolute';
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
        (meta.data[index]._model.base - meta.data[index]._model.y) / 2 -
        tooltipHeight / 2 +
        'px';

      const tableBody = tooltipEl.querySelector('.ca_scroll_table_body');
      const tableHeader = tooltipEl.querySelector('.ca_scroll_table_header');

      if (tableBody.scrollHeight <= tableBody.clientHeight) {
        tableHeader.style.paddingRight = '0px';
        tableBody.style.height = 'auto';
      }

      const closeEl = tooltipEl.querySelector('#ca_close');

      closeEl.addEventListener('click', closeClickHandler);

      function closeClickHandler() {
        tooltipEl.remove();
      }
    };

    function setValuesAbove(chartInstance) {
      if (chartInstance.config.options.showDatapoints) {
        const helpers = Chart.helpers;
        const ctx = chartInstance.chart.ctx;
        const fontColor = helpers.getValueOrDefault(
          chartInstance.config.options.showDatapoints.fontColor,
          chartInstance.config.options.defaultFontColor
        );

        ctx.font = Chart.helpers.fontString(
          Chart.defaults.global.defaultFontSize,
          'normal',
          Chart.defaults.global.defaultFontFamily
        );
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = fontColor;

        chartInstance.data.datasets.forEach(function (dataset) {
          dataset.data.forEach((elem, index) => {
            const model =
              dataset._meta[Object.keys(dataset._meta)[0]].data[index]._model;
            const scaleMax =
              dataset._meta[Object.keys(dataset._meta)[0]].data[index]._yScale
                .maxHeight;
            const yPos =
              (scaleMax - model.y) / scaleMax >= 0.93
                ? model.y + 20
                : model.y - 5;
            ctx.fillText(dataset.data[index], model.x, yPos);
          });
        });
      }
    }

    Chart.defaults.global.defaultFontColor = '#3E3E3C';
    Chart.defaults.global.defaultFontFamily = 'Segoe UI';
    Chart.defaults.global.defaultFontSize = 13;
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.elements.rectangle.backgroundColor = '#3290ED';
    Chart.defaults.global.elements.rectangle.borderWidth = 0;

    const caData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
        },
      ],
    };

    const options = {
      events: ['click'],
      showDatapoints: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
        custom: renderTooltip,
      },
      animation: {
        duration: 0,
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

    const caChart = new Chart(chartCanvas, chartConfig);
    setValuesAbove(caChart);

    const meta = caChart.getDatasetMeta(0);

    Chart.plugins.register({
      afterDraw: function (chartInstance) {
        setValuesAbove(chartInstance);
      },
    });
  }
}
