// Get data from JSON file
function fetchJSONData(path) {
  return new Promise((resolve, reject) => {
    fetch(path)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => reject(error));
  });
}

// Create i icon function
function createIIcon(elem, text) {
  const IIcon = document.createElement('div');
  IIcon.classList.add('i_icon_tooltip');

  const IIconTextPar = document.createElement('p');
  IIconTextPar.innerHTML = text;

  IIcon.appendChild(IIconTextPar);

  const rect = elem.getBoundingClientRect();
  const leftValue = rect.left + 25;
  IIcon.style.left = leftValue + 'px';

  return IIcon;
}

// Set actions for i icon
export function setIIconActionsHandler(IIconElement, IconMessage) {
  IIconElement.addEventListener('mouseenter', () => {
    IIconElement.appendChild(createIIcon(IIconElement, IconMessage));
  });

  IIconElement.addEventListener('mouseleave', () => {
    IIconElement.removeChild(IIconElement.lastElementChild);
  });
}

// Initialization of the widget based on templates
export function init(
  JsonFilePath,
  mainWorkingArea,
  loadTemplate,
  errorTemplate,
  errorMessageSpan,
  renderWidgetHandler
) {
  const clonLoadTemplate = loadTemplate.content.cloneNode(true);
  mainWorkingArea.appendChild(clonLoadTemplate);

  fetchJSONData(JsonFilePath)
    .then((data) => {
      clearMainWorkingArea(mainWorkingArea);
      renderWidgetHandler(data);
    })
    .catch((e) => {
      const FETCHING_DATA_ERROR = 'Unable to fetch data';
      renderErrorMessage(
        FETCHING_DATA_ERROR,
        `'Unable to fetch data: ${e}`,
        mainWorkingArea,
        errorTemplate,
        errorMessageSpan
      );
    });
}

// Delete all child elements
export function clearMainWorkingArea(mainWorkingArea) {
  while (mainWorkingArea.lastElementChild) {
    mainWorkingArea.removeChild(mainWorkingArea.lastElementChild);
  }
}

// Render error message
export function renderErrorMessage(
  errorMessage = 'Error occured',
  error,
  mainWorkingArea,
  errorTemplate,
  errorMessageSpanId
) {
  clearMainWorkingArea(mainWorkingArea);

  const clonErrorTemplate = errorTemplate.content.cloneNode(true);

  const errorMessageSpan = clonErrorTemplate.querySelector(
    `#${errorMessageSpanId}`
  );
  errorMessageSpan.textContent = errorMessage;

  mainWorkingArea.appendChild(clonErrorTemplate);

  console.error(error);
}

/*
  Next block is using only in Open Orders widget, but potentially can be used in any other

==========================================================================================
*/

// Convert number to international currency system
export function convertToInternationalCurrencySystem(
  labelValue = 0,
  pointNotation = 0
) {
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? {
        value: (Math.abs(Number(labelValue)) / 1.0e9).toFixed(pointNotation),
        measuer: 'B',
      }
    : Math.abs(Number(labelValue)) >= 1.0e6
    ? {
        value: (Math.abs(Number(labelValue)) / 1.0e6).toFixed(pointNotation),
        measuer: 'M',
      }
    : Math.abs(Number(labelValue)) >= 1.0e3
    ? {
        value: (Math.abs(Number(labelValue)) / 1.0e3).toFixed(pointNotation),
        measuer: 'K',
      }
    : {
        value: Math.abs(Number(labelValue)),
        measure: '',
      };
}

// Get currency symbol
export function getCurrencySymbol(locale = 'en-US', currency) {
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
