const JSON_FILE_PATH = './open-orders.json';

const mainWidgetContainer = document.getElementById('main-widget-container');
const loadTemplate = mainWidgetContainer.querySelector('#loader');
const errorFetchDataTemplate =
  mainWidgetContainer.querySelector('#error-fetch-data');
const widgetTemplate = mainWidgetContainer.querySelector('#widget');

fetchJSONData(JSON_FILE_PATH)
  .then((data) => {
    console.log(data);

    clearbody();
    renderWidget();
  })
  .catch((e) => {
    console.error('Unable to fetch data:', e);

    clearbody();

    const clonErrorFetchDataTemplate =
      errorFetchDataTemplate.content.cloneNode(true);
    mainWidgetContainer.appendChild(clonErrorFetchDataTemplate);
  });

function init() {
  const clonLoadTemplate = loadTemplate.content.cloneNode(true);
  mainWidgetContainer.appendChild(clonLoadTemplate);
}

function clearbody() {
  while (mainWidgetContainer.lastElementChild) {
    mainWidgetContainer.removeChild(mainWidgetContainer.lastElementChild);
  }
}

function renderWidget() {
  const clonWidgetTemplate = widgetTemplate.content.cloneNode(true);
  mainWidgetContainer.appendChild(clonWidgetTemplate);
}

init();
