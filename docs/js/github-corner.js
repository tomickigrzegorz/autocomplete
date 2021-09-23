const githubConrner = `
<a href="https://github.com/tomik23/autocomplete" target="_blank" class="github-corner" aria-label="View source on GitHub"><svg
  width="50" height="50" viewBox="0 0 250 250"
  style="fill:#FD6C6C; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
  <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
  <path
    d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
    fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
  <path
    d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
    fill="currentColor" class="octo-body"></path>
</svg></a>
`;

// adding github-corner
document.body.insertAdjacentHTML('beforeend', githubConrner);

const dataSources = [...document.querySelectorAll('[data-source]')];

async function fetchData(url, type) {
  try {
    const response = await fetch(url);
    const data =
      type === 'text' ? await response.text() : await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

dataSources.forEach((datasource) => {
  fetchData(datasource.dataset.source, 'text').then((data) => {
    datasource.textContent = data;
  });
});

const sections = document.querySelectorAll('section');
const sectionClass = document.querySelectorAll('.section');

const htmlRoot = document.querySelectorAll('.search-element');
const htmlRootElement = document.querySelectorAll(
  '.search-element > :nth-child(2)'
);

/**
 * menu
 */

const menu = document.querySelector('.menu');
function generateMenu(data) {
  data.map((el, index) => {
    const li = document.createElement('li');
    if (index === 0) {
      li.className = 'active';
    }
    const a = document.createElement('a');
    a.href = `#${el.link}`;
    a.insertAdjacentHTML('beforeend', el.html);
    li.appendChild(a);
    menu.appendChild(li);
  });
}

function detectUrl(file) {
  let url;
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    url = `./data/${file}`;
  } else {
    url = `https://tomik23.github.io/autocomplete/data/${file}`;
  }
  return url;
}

fetchData(detectUrl('menu.json'), 'json')
  .then((data) => {
    generateMenu(data);
  })
  .then(() => {
    // IntersectionObserver section
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          document.querySelector('.active').classList.remove('active');
          let id = entry.target.getAttribute('id');
          document
            .querySelector(`[href="#${id}"]`)
            .parentNode.classList.add('active');
        }
      });
    }, options);
    sectionClass.forEach((section) => {
      observer.observe(section);
    });
  });

// ----------

htmlRootElement.forEach((element, index) => {
  const htmlCode = element.cloneNode(true).outerHTML.replace(/^\s{1,12}/gm, '');

  const htmlConverter = htmlCode.replace(
    /[\u00A0-\u9999<>\\&]/gim,
    function (i) {
      return `&#${i.charCodeAt(0)};`;
    }
  );

  const preElement = document.createElement('pre');
  const codeElement = document.createElement('code');
  codeElement.className = 'language-html';

  preElement.appendChild(codeElement);

  codeElement.insertAdjacentHTML('beforeend', htmlConverter);

  htmlRoot[index].nextElementSibling.appendChild(preElement);
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('copy-code')) {
    buttonCopy(target);
  }

  // toggle-button
  if (target.classList.contains('toggle-menu')) {
    document.body.classList.toggle('close');
  }

  // active menu elements
  if (target.closest('li')) {
    document.body.classList.remove('close');
  }
});

const button = document.createElement('button');
button.setAttribute('type', 'text');
button.className = 'copy-code';
button.textContent = 'copy';

const highlights = document.querySelectorAll('.highlight > h4');
const htmlClass = document.querySelectorAll('.html-class');

htmlClass.forEach((htmlCl) => {
  const buttonClone = button.cloneNode(true);
  htmlCl.insertAdjacentElement('afterbegin', buttonClone);
});

highlights.forEach((highlight) => {
  const buttonClone = button.cloneNode(true);
  highlight.insertAdjacentElement('afterend', buttonClone);
});

const buttonCopy = (target) => {
  const selection = window.getSelection();
  const range = document.createRange();
  const targetEl = target;
  range.selectNodeContents(targetEl.nextElementSibling);
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand('copy');
    selection.removeAllRanges();

    targetEl.classList.add('success-msg');
    targetEl.textContent = 'copied!';

    setTimeout(() => {
      targetEl.classList.remove('success-msg');
      targetEl.textContent = 'copy';
    }, 1200);
  } catch (e) {
    targetEl.classList.add('error-msg');
    targetEl.textContent = 'error!';

    setTimeout(() => {
      targetEl.classList.remove('error-msg');
      targetEl.textContent = 'copy';
    }, 1200);
  }
};

const topButton = document.createElement('a');
topButton.href = '#';
topButton.className = 'top-button';
topButton.textContent = 'top';

const section = document.querySelectorAll('section, article');
section.forEach((element) => {
  element.insertAdjacentElement('beforeend', topButton.cloneNode(true));
});

const tablesNew = document.querySelectorAll('.table-new');

const table = document.createElement('table');
const thead = document.createElement('thead');
const tbody = document.createElement('tbody');

const tr = document.createElement('tr');
const th = document.createElement('th');
const td = document.createElement('td');

tablesNew.forEach((tableRoot) => {
  const tableJson = tableRoot.dataset.json;

  const ta = table.cloneNode();
  const head = thead.cloneNode();
  const body = tbody.cloneNode();

  ta.appendChild(head);
  ta.appendChild(body);
  tableRoot.appendChild(ta);

  fetchData(detectUrl(tableJson), 'json').then((data) => {
    configurationOfThePlugin(data);
  });

  function configurationOfThePlugin(data) {
    return data.map((element) => {
      // thead
      const etr = tr.cloneNode();

      if (element.thead) {
        element.thead.map((text) => {
          const eth = th.cloneNode();
          eth.textContent = text;
          etr.appendChild(eth);
          head.appendChild(etr);
        });
      }
      // tbody
      if (element.tbody) {
        element.tbody.map((el) => {
          const etr = tr.cloneNode();
          el.row.map((col, index) => {
            const etd = td.cloneNode();
            etd.innerHTML =
              index == 0 ? `<code>${col.column}</code>` : col.column;
            etr.appendChild(etd);
          });
          body.appendChild(etr);
        });
      }
    });
  }
});
