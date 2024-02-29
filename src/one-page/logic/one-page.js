function renderOnePage() {
  addOpenOrdersWidgetHtml();
}

function addOpenOrdersWidgetHtml() {
  const filePath = '../../src/open-orders-widget/open-orders.html';

  getHtmlFile(filePath)
    .then((html) => {
      const openOrdersEl = document.getElementById('open-orders-widget');

      const getHtml = document.createElement('div');
      getHtml.insertAdjacentHTML('beforeend', html);

      const widgetEl = getHtml.querySelector('#oo-main-widget-container');

      openOrdersEl.appendChild(widgetEl);

      import('../../open-orders-widget/logic/open-orders.js').then((mod) => {
        const path = '../../src/open-orders-widget/static/open-orders.json';
        mod.initOoWidgetForOnePage(path);
      });
    })
    .catch((err) => {
      console.log('Error rendering Open Orders Widget: ', err);
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
