import { LightningElement } from 'lwc';
export default class DeliveryBlocksWidgetContainer extends LightningElement {
  jsonData;
  template1 = `
  {
  "delivery_blocks_total": "1245",
  "from_date": "19.03.2024",
  "delivery_blocks": [
    {
      "name": "E1",
      "value": "0"
    },
    {
      "name": "S4",
      "value": "4"
    },
    {
      "name": "LO",
      "value": "11"
    },
    {
      "name": "09",
      "value": "320"
    },
    {
      "name": "ZE",
      "value": "62"
    },
    {
      "name": "ZR",
      "value": "27"
    },
    {
      "name": "Others",
      "value": "821"
    }
  ]
}

  `;
  template2 = `
  {
  "delivery_blocks_total": "100",
  "from_date": "06.02.2024",
  "delivery_blocks": [
    {
      "name": "E1",
      "value": "10"
    },
    {
      "name": "S4",
      "value": "20"
    },
    {
      "name": "LO",
      "value": "35"
    },
    {
      "name": "09",
      "value": "5"
    },
    {
      "name": "ZE",
      "value": "5"
    },
    {
      "name": "ZR",
      "value": "15"
    },
    {
      "name": "Others",
      "value": "10"
    }
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
    const widgetComponent = this.template.querySelector(
      'c-delivery-blocks-widget'
    );

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
