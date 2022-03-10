const githubConrner = `
<a href="https://github.com/tomik23/autocomplete" target="_blank" class="github-corner" aria-label="View source on GitHub" title="View source on GitHub"><svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
</svg></a>
`;

// adding github-corner
document.body.insertAdjacentHTML("beforeend", githubConrner);

const dataSources = [...document.querySelectorAll("[data-source]")];

async function fetchData(url, type) {
  try {
    const response = await fetch(url);
    const data =
      type === "text" ? await response.text() : await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

dataSources.forEach((datasource) => {
  fetchData(datasource.dataset.source, "text").then((data) => {
    datasource.textContent = data;
  });
});

const sections = document.querySelectorAll("section");
const sectionClass = document.querySelectorAll(".section");

const htmlRoot = document.querySelectorAll(".search-element");
const htmlRootElement = document.querySelectorAll(
  ".search-element > :nth-child(2)"
);

/**
 * menu
 */

const menu = document.querySelector(".menu");
function generateMenu(data) {
  data.map((el, index) => {
    const li = document.createElement("li");
    if (index === 0) {
      li.className = "active";
    }
    const a = document.createElement("a");
    a.href = `#${el.link}`;
    a.insertAdjacentHTML("beforeend", el.html);
    li.appendChild(a);
    menu.appendChild(li);
  });
}

function detectUrl(file) {
  let url;
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    url = `./data/${file}`;
  } else {
    url = `https://tomik23.github.io/autocomplete/data/${file}`;
  }
  return url;
}

fetchData(detectUrl("menu.json"), "json")
  .then((data) => {
    generateMenu(data);
  })
  .then(() => {
    // IntersectionObserver section
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          document.querySelector(".active").classList.remove("active");
          let id = entry.target.getAttribute("id");
          document
            .querySelector(`[href="#${id}"]`)
            .parentNode.classList.add("active");
        }
      });
    }, options);
    sectionClass.forEach((section) => {
      observer.observe(section);
    });
  });

// ----------

htmlRootElement.forEach((element, index) => {
  const htmlCode = element.cloneNode(true).outerHTML.replace(/^\s{1,12}/gm, "");

  const htmlConverter = htmlCode.replace(
    /[\u00A0-\u9999<>\\&]/gim,
    function (i) {
      return `&#${i.charCodeAt(0)};`;
    }
  );

  const preElement = document.createElement("pre");
  const codeElement = document.createElement("code");
  codeElement.className = "language-html";

  preElement.appendChild(codeElement);

  codeElement.insertAdjacentHTML("beforeend", htmlConverter);

  htmlRoot[index].nextElementSibling.appendChild(preElement);
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("copy-code")) {
    buttonCopy(target);
  }

  // toggle-button
  if (target.classList.contains("toggle-menu")) {
    document.body.classList.toggle("show-menu");
  }

  // active menu elements
  if (target.closest("li")) {
    document.body.classList.remove("show-menu");
  }
});

const button = document.createElement("button");
button.setAttribute("type", "text");
button.className = "copy-code";
button.textContent = "copy";

const highlights = document.querySelectorAll(".highlight > h4");
const htmlClass = document.querySelectorAll(".html-class");

htmlClass.forEach((htmlCl) => {
  const buttonClone = button.cloneNode(true);
  htmlCl.insertAdjacentElement("afterbegin", buttonClone);
});

highlights.forEach((highlight) => {
  const buttonClone = button.cloneNode(true);
  highlight.insertAdjacentElement("afterend", buttonClone);
});

const buttonCopy = (target) => {
  const selection = window.getSelection();
  const range = document.createRange();
  const targetEl = target;
  range.selectNodeContents(targetEl.nextElementSibling);
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand("copy");
    selection.removeAllRanges();

    targetEl.classList.add("success-msg");
    targetEl.textContent = "copied!";

    setTimeout(() => {
      targetEl.classList.remove("success-msg");
      targetEl.textContent = "copy";
    }, 1200);
  } catch (e) {
    targetEl.classList.add("error-msg");
    targetEl.textContent = "error!";

    setTimeout(() => {
      targetEl.classList.remove("error-msg");
      targetEl.textContent = "copy";
    }, 1200);
  }
};

const topButton = document.createElement("a");
topButton.href = "#";
topButton.className = "top-button";
topButton.textContent = "top";

const section = document.querySelectorAll("section, article");
section.forEach((element) => {
  element.insertAdjacentElement("beforeend", topButton.cloneNode(true));
});

const tablesNew = document.querySelectorAll(".table-new");

const table = document.createElement("table");
const thead = document.createElement("thead");
const tbody = document.createElement("tbody");

const tr = document.createElement("tr");
const th = document.createElement("th");
const td = document.createElement("td");

tablesNew.forEach((tableRoot) => {
  const tableJson = tableRoot.dataset.json;

  const ta = table.cloneNode();
  const head = thead.cloneNode();
  const body = tbody.cloneNode();

  ta.appendChild(head);
  ta.appendChild(body);
  tableRoot.appendChild(ta);

  fetchData(detectUrl(tableJson), "json").then((data) => {
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
