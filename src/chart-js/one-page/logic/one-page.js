import { initCaWidget } from '../../capacity-alert-widget/logic/utils/utils-capacity-alert.js';

function renderOnePage() {
  addCapacityAlertWidgetHtml();
}

function addCapacityAlertWidgetHtml() {
  const filePath =
    '../../../src/chart-js/capacity-alert-widget/capacity-alert.html';
  const caWidgetDataPath =
    '../../../src/chart-js/capacity-alert-widget/static/capacity-alert.json';

  getHtmlFile(filePath)
    .then((html) => {
      const openOrdersEl = document.getElementById('capacity-alert-widget');

      const getHtml = document.createElement('div');
      getHtml.insertAdjacentHTML('beforeend', html);

      const widgetEl = getHtml.querySelector('#ca-main-widget-container');

      openOrdersEl.appendChild(widgetEl);

      initCaWidget(caWidgetDataPath);
    })
    .catch((err) => {
      console.log('Error rendering Capacity ALert Widget: ', err);
    });
}

async function getHtmlFile(path) {
  return new Promise((resolve, reject) => {
    fetch(path)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unable to get html file: ', res.status);
        }
        return res.text();
      })
      .then((html) => {
        resolve(html);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

renderOnePage();
