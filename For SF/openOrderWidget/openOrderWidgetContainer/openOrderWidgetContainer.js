import { LightningElement } from 'lwc';
export default class WidgetContainer extends LightningElement {
  jsonData;
  template1 = `
 {
  "end_MBDAT": "10.10.2023",
  "open_orders_summary_value": "115631232.23",
  "currency": "EUR",
  "open_orders_MSU": "97.5",
  "start_MBDAT": "01.01.2020",
  "categories": [
    { "name": "Oral Care", "value": "2.8" },
    { "name": "Baby Care", "value": "15.6" },
    { "name": "Appliances", "value": "12.3" },
    { "name": "Fabric Care", "value": "16.8" },
    { "name": "Shave Care", "value": "0.8" },
    { "name": "Home Care", "value": "8.8" },
    { "name": "Hair Care", "value": "0.1" },
    { "name": "Feminine Care", "value": "0.3" }
  ]
}
    `;
  template2 = `
  {
  "end_MBDAT": "01.05.2024",
  "open_orders_summary_value": "631232.23",
  "currency": "USD",
  "open_orders_MSU": "47.5",
  "start_MBDAT": "01.01.2024",
  "categories": [
    { "name": "Oral Care", "value": "2.8" },
    { "name": "Baby Care", "value": "5.6" },
    { "name": "Appliances", "value": "2.3" },
    { "name": "Fabric Care", "value": "6.8" },
    { "name": "Home Care", "value": "8.8" }
  ]
}
    `;

  renderedCallback() {
    const template1Btn = this.template.querySelector(
      '[data-id="dataTemplate1"]'
    );
    const template2Btn = this.template.querySelector(
      '[data-id="dataTemplate2"]'
    );
    const widgetComponent = this.template.querySelector('c-open-order-widget');

    template1Btn.addEventListener('click', () => {
      this.jsonData = this.template1;
      widgetComponent.setWidgetData(this.jsonData);
    });
    template2Btn.addEventListener('click', () => {
      this.jsonData = this.template2;
      widgetComponent.setWidgetData(this.jsonData);
    });
  }
}
