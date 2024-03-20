import { LightningElement } from 'lwc';
export default class WidgetContainer extends LightningElement {
  jsonData;
  template1 = `
    {
  "days": [
    {
      "date": "2024-02-06",
      "date_to_display": "06.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-07",
      "date_to_display": "07.02",
      "is_over_limit": "false",
      "number_of_trucks": "2",
      "shipTo_details": [
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "2"
        }
      ]
    },
    {
      "date": "2024-02-08",
      "date_to_display": "08.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-09",
      "date_to_display": "09.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-10",
      "date_to_display": "10.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-11",
      "date_to_display": "11.02",
      "is_over_limit": "true",
      "number_of_trucks": "8",
      "shipTo_details": [
        {
          "is_over_limit": "true",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "1"
        }
      ]
    },
    {
      "date": "2024-02-12",
      "date_to_display": "12.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-13",
      "date_to_display": "13.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-14",
      "date_to_display": "14.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-15",
      "date_to_display": "15.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-16",
      "date_to_display": "16.02",
      "is_over_limit": "false",
      "number_of_trucks": "1",
      "shipTo_details": [
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        }
      ]
    },
    {
      "date": "2024-02-17",
      "date_to_display": "17.02",
      "is_over_limit": "false",
      "number_of_trucks": "2",
      "shipTo_details": [
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        }
      ]
    },
    {
      "date": "2024-02-18",
      "date_to_display": "18.02",
      "is_over_limit": "false",
      "number_of_trucks": "1",
      "shipTo_details": [
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        }
      ]
    },
    {
      "date": "2024-02-19",
      "date_to_display": "19.02",
      "is_over_limit": "true",
      "number_of_trucks": "1",
      "shipTo_details": [
        {
          "is_over_limit": "true",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        }
      ]
    }
  ]
}
    `;
  template2 = `
    {
  "days": [
    {
      "date": "2024-02-06",
      "date_to_display": "06.02",
      "is_over_limit": "true",
      "number_of_trucks": "1",
      "shipTo_details": [
        {
          "is_over_limit": "true",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "1"
        }
      ]
    },
    {
      "date": "2024-02-07",
      "date_to_display": "07.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-08",
      "date_to_display": "08.02",
      "is_over_limit": "false",
      "number_of_trucks": "2",
      "shipTo_details": [
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "2"
        }
      ]
    },
    {
      "date": "2024-02-09",
      "date_to_display": "09.02",
      "is_over_limit": "false",
      "number_of_trucks": "4",
      "shipTo_details": [
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "2"
        },
        {
          "is_over_limit": "false",
          "location": "2002206229",
          "location_name": "0815 ONLINE HANDEL GMBH",
          "number_of_trucks": "2"
        }
      ]
    },
    {
      "date": "2024-02-10",
      "date_to_display": "10.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-11",
      "date_to_display": "11.02",
      "is_over_limit": "true",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-12",
      "date_to_display": "12.02",
      "is_over_limit": "false",
      "number_of_trucks": "5",
      "shipTo_details": [
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        }
      ]
    },
    {
      "date": "2024-02-13",
      "date_to_display": "13.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-14",
      "date_to_display": "14.02",
      "is_over_limit": "false",
      "number_of_trucks": "3",
      "shipTo_details": [
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        },
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        }
      ]
    },
    {
      "date": "2024-02-15",
      "date_to_display": "15.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-16",
      "date_to_display": "16.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-17",
      "date_to_display": "17.02",
      "is_over_limit": "false",
      "number_of_trucks": "0",
      "shipTo_details": []
    },
    {
      "date": "2024-02-18",
      "date_to_display": "18.02",
      "is_over_limit": "false",
      "number_of_trucks": "1",
      "shipTo_details": [
        {
          "is_over_limit": "false",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        }
      ]
    },
    {
      "date": "2024-02-19",
      "date_to_display": "19.02",
      "is_over_limit": "true",
      "number_of_trucks": "1",
      "shipTo_details": [
        {
          "is_over_limit": "true",
          "location": "2000121188",
          "location_name": "SPAR OESTERR WARENHANDELS AG",
          "number_of_trucks": "1"
        }
      ]
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
      'c-capacity-alert-widget'
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
