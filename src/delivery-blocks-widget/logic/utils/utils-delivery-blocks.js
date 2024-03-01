import {
  init,
  setIIconActionsHandler,
  clearMainWorkingArea,
  renderErrorMessage,
} from '../../../common/logic/common.js';

export function initDbWidget(pathForOnePage) {
  const URL = 'https://www.google.com/';
  const mainWidgetContainer = document.getElementById(
    'db-main-widget-container'
  );
  const mainWorkingArea = mainWidgetContainer.querySelector('#db-working-area');
  const loadTemplate = mainWidgetContainer.querySelector('#db-loader');
  const errorFetchDataTemplate = mainWidgetContainer.querySelector('#db-error');

  const JSON_FILE_PATH = pathForOnePage
    ? pathForOnePage
    : './static/delivery-blocks.json';

  init(
    JSON_FILE_PATH,
    mainWorkingArea,
    loadTemplate,
    errorFetchDataTemplate,
    'db-error-message',
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
        'db-error-message'
      );
    }
  }

  function renderWidget(data) {
    const widgetTemplate = mainWidgetContainer.querySelector('#db-widget');

    const clonWidgetTemplate = widgetTemplate.content.cloneNode(true);
    mainWorkingArea.appendChild(clonWidgetTemplate);

    google.charts.load('current', { packages: ['corechart'] });

    const chartElement = document.getElementById('db_chart');

    const dbData = data.delivery_blocks;
    const fromDate = data.from_date;
    const deliveryBlocksTotal = data.delivery_blocks_total;

    const isOnlyZeros = dbData.every((element) => {
      return parseInt(element.value) === 0;
    });

    const IIconElement = document.getElementById(
      'db_header_with_icon_header_i_icon'
    );
    const DB_ICON_MESSAGE = `These are blocks on ALL open orders in SAP from ${fromDate}`;

    setIIconActionsHandler(IIconElement, DB_ICON_MESSAGE);

    function setTotalEventLisener() {
      const totalDiv = document.getElementById('db_total');
      const totalSpan = totalDiv.querySelector('span');

      totalSpan.textContent = deliveryBlocksTotal;

      totalDiv.addEventListener('click', totalDivHandler);

      function totalDivHandler() {
        window.open(URL, '_blank');
      }
    }

    function convertToArray(arrayOfObjects) {
      const resultArray = [];

      for (const obj of arrayOfObjects) {
        resultArray.push([
          obj.name,
          parseInt(obj.value),
          'color: #3290ED',
          parseInt(obj.value),
        ]);
      }

      return resultArray;
    }

    function drawDbChart() {
      const chartDataArray = [
        [
          'DBName',
          'Value',
          {
            role: 'style',
          },
          {
            role: 'annotation',
          },
        ],
      ];

      chartDataArray.push(...convertToArray(dbData));

      const chartData = google.visualization.arrayToDataTable(chartDataArray);

      const dbChartView = new google.visualization.DataView(chartData);

      dbChartView.setColumns([
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
          left: 50,
          top: 10,
          width: '90%',
          height: '75%',
        },
        height: 200,
        annotations: {
          alwaysOutside: true,
          stemColor: 'none',
          highContrast: false,
          textStyle: {
            fontName: 'Segoe UI',
            fontSize: 13,
            color: '#000000',
          },
        },
        vAxis: {
          baselineColor: '#DDDBDA',
          gridlineColor: '#fff',
          textPosition: 'none',
          textStyle: {
            fontName: 'Segoe UI',
            fontSize: 12,
            color: '#3E3E3C',
          },
        },
        hAxis: {
          baselineColor: '#fff',
          gridlineColor: '#fff',
          textStyle: {
            fontName: 'Segoe UI',
            fontSize: 13,
            color: '#3E3E3C',
          },
        },
        legend: { position: 'none' },
        tooltip: {
          trigger: 'none',
        },
        enableInteractivity: false,
      };

      if (isOnlyZeros) {
        options.vAxis.viewWindow = {
          min: 0,
          max: 1,
        };
      }

      const dbChart = new google.visualization.ColumnChart(chartElement);

      dbChart.draw(dbChartView, options);
    }

    setTotalEventLisener();
    google.charts.setOnLoadCallback(drawDbChart);
  }
}
