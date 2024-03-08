import { initOoWidget } from '../../open-orders-widget/logic/utils/utils-open-orders.js';
import { initDbWidget } from '../../delivery-blocks-widget/logic/utils/utils-delivery-blocks.js';

function renderOnePage() {
  addOpenOrdersWidgetHtml();
  addDeliveryBlocksWidgetHtml();
}

function addOpenOrdersWidgetHtml() {
  const filePath =
    '../../../src/google-chart/open-orders-widget/open-orders.html';
  const ooWidgetDataPath =
    '../../../src/google-chart/open-orders-widget/static/open-orders.json';

  getHtmlFile(filePath)
    .then((html) => {
      const openOrdersEl = document.getElementById('open-orders-widget');

      const getHtml = document.createElement('div');
      getHtml.insertAdjacentHTML('beforeend', html);

      const widgetEl = getHtml.querySelector('#oo-main-widget-container');

      openOrdersEl.appendChild(widgetEl);

      initOoWidget(ooWidgetDataPath);
    })
    .catch((err) => {
      console.log('Error rendering Open Orders Widget: ', err);
    });
}

function addDeliveryBlocksWidgetHtml() {
  const filePath =
    '../../../src/google-chart/delivery-blocks-widget/delivery-blocks.html';
  const dbWidgetDataPath =
    '../../../src/google-chart/delivery-blocks-widget/static/delivery-blocks.json';

  getHtmlFile(filePath)
    .then((html) => {
      const openOrdersEl = document.getElementById('delivery-blocks-widget');

      const getHtml = document.createElement('div');
      getHtml.insertAdjacentHTML('beforeend', html);

      const widgetEl = getHtml.querySelector('#db-main-widget-container');

      openOrdersEl.appendChild(widgetEl);

      initDbWidget(dbWidgetDataPath);
    })
    .catch((err) => {
      console.log('Error rendering Delivery Blocks Widget: ', err);
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
