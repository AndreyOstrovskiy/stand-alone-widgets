import {
  init,
  setIIconActionsHandler,
  renderErrorMessage,
  convertToInternationalCurrencySystem,
  getCurrencySymbol,
} from '../../../../common/logic/common.js';

export function initOoWidget(pathForOnePage) {
  const mainWidgetContainer = document.getElementById(
    'oo-main-widget-container'
  );
  const mainWorkingArea = mainWidgetContainer.querySelector('#oo-working-area');
  const loadTemplate = mainWidgetContainer.querySelector('#oo-loader');
  const errorFetchDataTemplate = mainWidgetContainer.querySelector('#oo-error');

  const JSON_FILE_PATH = pathForOnePage
    ? pathForOnePage
    : './static/open-orders.json';

  init(
    JSON_FILE_PATH,
    mainWorkingArea,
    loadTemplate,
    errorFetchDataTemplate,
    'oo-error-message',
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
        'oo-error-message'
      );
    }
  }

  function renderWidget(data) {
    const widgetTemplate = mainWidgetContainer.querySelector('#oo-widget');

    const clonWidgetTemplate = widgetTemplate.content.cloneNode(true);
    mainWorkingArea.appendChild(clonWidgetTemplate);

    const chartCanvas = mainWorkingArea.querySelector('#oo_chart_canvas');
    const IIconElement = document.getElementById(
      'oo_header_with_icon_header_i_icon'
    );

    const ooData = data.categories;
    const startMBDAT = data.start_MBDAT;
    const endMBDAT = data.end_MBDAT;
    const openOrdersMsu = data.open_orders_MSU ? data.open_orders_MSU : '0';
    const openOrdersSummaryValue = data.open_orders_summary_value
      ? data.open_orders_summary_value
      : 0;
    const OO_ICON_MESSAGE = `These are orders going through the AV cycle from ${startMBDAT} to ${endMBDAT}`;

    let isOnlyZeros = false;

    if (ooData && ooData.length > 0) {
      isOnlyZeros = ooData.every((element) => {
        return parseInt(element.value) === 0;
      });
    }

    setIIconActionsHandler(IIconElement, OO_ICON_MESSAGE);

    function openOrdersValue() {
      const openOrdersMSUEl = document.getElementById('open-orders-msu');
      openOrdersMSUEl.textContent = openOrdersMsu;

      const wrapper = document.getElementById('oo_summary');
      const valueObj = convertToInternationalCurrencySystem(
        openOrdersSummaryValue
      );

      const currency = getCurrencySymbol(navigator.language, data.currency);
      const amount = valueObj.value;
      const measure = valueObj.measuer;

      wrapper.classList.add('oo_msu_layout', 'jcSB', 'oo_msu');

      const currencyEl = document.createElement('h3');
      currencyEl.classList.add('oo_msu_text');
      currencyEl.textContent = currency;

      const amountEl = document.createElement('h1');
      amountEl.textContent = amount;

      const measureEl = document.createElement('h3');
      measureEl.classList.add('oo_msu_text');
      measureEl.textContent = measure;

      wrapper.append(currencyEl, amountEl, measureEl);
    }

    function sortData(dataToSort) {
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

    const ooSortedData = sortData(ooData);

    function drawOoChart() {
      const DEFAULT_Y_GAP = 3.5;

      const colors = [];

      const labels = ooSortedData.map((category) => {
        colors.push('#9D53F2');

        return category.name;
      });

      const values = ooSortedData.map((category) => {
        return category.value;
      });

      function setValuesAbove(chartInstance) {
        console.log(chartInstance);
        if (chartInstance.config.options.showDatapoints) {
          const ctx = chartInstance.chart.ctx;

          ctx.font = Chart.helpers.fontString(12, 'normal', 'Segoe UI');
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = '#2B2826';

          chartInstance.data.datasets.forEach(function (dataset) {
            dataset.data.forEach((elem, index) => {
              const model =
                dataset._meta[Object.keys(dataset._meta)[0]].data[index]._model;
              const xScale =
                dataset._meta[Object.keys(dataset._meta)[0]].data[index]
                  ._xScale;
              const scaleMax = xScale.maxWidth;
              let xPos;

              if ((scaleMax - model.x) / scaleMax >= 0) {
                xPos = model.x + 20;
              } else {
                console.log('else');
                xPos = model.x - 20;
                // xScale.ctx.fillStyle = 'white';
                console.log(dataset);
              }

              const yPos = model.y + model.height / 2 - DEFAULT_Y_GAP;

              ctx.fillText(dataset.data[index], xPos, yPos);
              console.log('ctx');
              console.log(ctx);
            });
          });
        }
      }

      const ooData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
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
                max: Math.max(...ooData.datasets[0].data) + 1,
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
        data: ooData,
      };

      const ooChart = new Chart(chartCanvas, chartConfig);
      setValuesAbove(ooChart);

      Chart.plugins.register({
        afterDraw: function (chartInstance) {
          setValuesAbove(chartInstance);
        },
      });
    }

    openOrdersValue();
    if (ooData && ooData.length > 0) {
      drawOoChart();
    }
  }
}
