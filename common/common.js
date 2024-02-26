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
