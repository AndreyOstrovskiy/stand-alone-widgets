import {
  init,
  clearMainWorkingArea,
  renderErrorMessage,
} from '../../../common/logic/common.js';

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

    const labels = data.days.map((day) => {
      return day.date_to_display;
    });

    const values = data.days.map((day) => {
      return day.number_of_trucks;
    });

    function renderTooltip() {
      // Tooltip Element
      var tooltipEl = document.getElementById('chartjs-tooltip');

      // Create element on first render
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = '<table></table>';
        document.body.appendChild(tooltipEl);
      }
      tooltipEl.style.opacity = 1;
      //   tooltipEl.style.left = position.left + tooltipModel.caretX + 'px';
      tooltipEl.style.left = '30px';
      //   tooltipEl.style.top = position.top + tooltipModel.caretY + 'px';
      tooltipEl.style.top = '30px';
      tooltipEl.style.fontFamily = Chart.defaults.global.defaultFontFamily;
      tooltipEl.style.fontSize = Chart.defaults.global.defaultFontSize;
      tooltipEl.style.fontStyle = 'normal';
      //   tooltipEl.style.padding =
      //     tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
      tooltipEl.style.padding = '30' + 'px ' + '30' + 'px';
    }

    function setValuesAbove(chart) {
      const chartInstance = chart;
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
        },
      ],
    };

    const options = {
      events: ['click'],
      showDatapoints: true,
      maintainAspectRatio: false,
      tooltips: {
        custom: renderTooltip(),
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

    Chart.plugins.register({
      afterDraw: function (chartInstance) {
        setValuesAbove(chartInstance);
      },
    });
  }
}
