import {
  init,
  setIIconActionsHandler,
  clearMainWorkingArea,
  renderErrorMessage,
  convertToInternationalCurrencySystem,
  getCurrencySymbol,
} from '../../../common/logic/common.js';

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
      window.addEventListener('resize', () => {
        clearMainWorkingArea(mainWorkingArea);
        renderWidget(data);
      });
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

    google.charts.load('current', { packages: ['corechart'] });

    const chartElement = document.getElementById('oo_chart');
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

    function convertToArray(arrayOfObjects) {
      const resultArray = [];

      for (const obj of arrayOfObjects) {
        resultArray.push([
          obj.name,
          parseFloat(obj.value),
          'color: #9D53F2',
          parseFloat(obj.value),
        ]);
      }

      resultArray.sort((a, b) => {
        return b[1] - a[1];
      });

      return resultArray;
    }

    function drawOoChart() {
      const chartDataArray = [
        [
          'Category',
          'Value',
          {
            role: 'style',
          },
          {
            role: 'annotation',
          },
        ],
      ];
      chartDataArray.push(...convertToArray(ooData));

      const chartData = google.visualization.arrayToDataTable(chartDataArray);

      const ooChartView = new google.visualization.DataView(chartData);
      ooChartView.setColumns([
        0,
        1,
        {
          calc: 'stringify',
          sourceColumn: 1,
          type: 'string',
          role: 'annotation',
        },
        2,
      ]);

      const options = {
        chartArea: {
          left: 150,
          right: 20,
          top: 0,
          width: '100%',
          height: '100%',
        },
        height: 200,
        annotations: {
          alwaysOutside: true,
          stemColor: 'none',
          textStyle: {
            fontName: 'Segoe UI',
            fontSize: 12,
            color: '#2B2826',
          },
        },
        hAxis: {
          baselineColor: '#fff',
          gridlineColor: '#fff',
          textPosition: 'none',
        },
        vAxis: {
          baselineColor: '#fff',
          gridlineColor: '#fff',
          textStyle: {
            fontName: 'Segoe UI',
            fontSize: 13,
            color: '#2B2826',
          },
        },
        legend: { position: 'none' },
        tooltip: {
          trigger: 'none',
        },
        enableInteractivity: false,
      };

      if (isOnlyZeros) {
        options.hAxis.viewWindow = {
          min: 0,
          max: 1,
        };
      }

      const ooChart = new google.visualization.BarChart(chartElement);

      const ooObserver = new MutationObserver(function () {
        Array.prototype.forEach.call(
          chartElement.getElementsByTagName('text'),
          function (annotation) {
            annotation.setAttribute('fill', '#2B2826');
          }
        );
      });

      ooObserver.observe(chartElement, {
        childList: true,
        subtree: true,
      });

      ooChart.draw(ooChartView, options);
    }

    openOrdersValue();
    if (ooData && ooData.length > 0) {
      google.charts.setOnLoadCallback(drawOoChart);
    }
  }
}
