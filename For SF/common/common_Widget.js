import { LightningElement } from 'lwc';
export default class Common_Widget extends LightningElement {
  // Get element by data-id attr
  static getElByDataId(node, id) {
    return node.template.querySelector(`[data-id="${id}"]`);
  }

  // Create i icon function
  static createIIcon(elem, text) {
    try {
      const IIcon = document.createElement('div');
      IIcon.classList.add('i_icon_tooltip');

      const IIconTextPar = document.createElement('p');
      IIconTextPar.innerHTML = text;

      IIcon.appendChild(IIconTextPar);

      const rect = elem.getBoundingClientRect();
      const leftValue = rect.left + 25;
      IIcon.style.left = leftValue + 'px';

      return IIcon;
    } catch (error) {
      console.error(error);
    }
  }

  /*
  Next block is using only in Open Orders widget, but potentially can be used in any other

==========================================================================================
*/

  // Convert number to international currency system
  static convertToInternationalCurrencySystem(
    labelValue = 0,
    pointNotation = 0
  ) {
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? {
          value: (Math.abs(Number(labelValue)) / 1.0e9).toFixed(pointNotation),
          measure: 'B',
        }
      : Math.abs(Number(labelValue)) >= 1.0e6
      ? {
          value: (Math.abs(Number(labelValue)) / 1.0e6).toFixed(pointNotation),
          measure: 'M',
        }
      : Math.abs(Number(labelValue)) >= 1.0e3
      ? {
          value: (Math.abs(Number(labelValue)) / 1.0e3).toFixed(pointNotation),
          measure: 'K',
        }
      : {
          value: Math.abs(Number(labelValue)),
          measure: '',
        };
  }

  // Get currency symbol
  static getCurrencySymbol(locale = 'en-US', currency) {
    return (0)
      .toLocaleString(locale, {
        style: 'currency',
        currency: currency,
      })
      .replace(/\d./g, '')
      .trim();
  }

  /*
==========================================================================================
*/
}
