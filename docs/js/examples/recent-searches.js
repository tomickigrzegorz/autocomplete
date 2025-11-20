// cache for the recent searches
let history = [];

new Autocomplete("recent-searches", {
  cache: true,
  classPreventClosing: "additional-elements",

  onSearch: ({ currentValue }) => {
    const api = "./characters.json";

    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          const result = data
            .filter((el) => new RegExp(currentValue, "i").test(el.name))
            .sort((a, b) => a.name.localeCompare(b.name));
          resolve(result);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  // this function is responsible for rendering
  // additional elements above and below the results
  onRender: ({ results }) => {
    const elements = [{ where: "beforebegin", text: "Recent Search:" }];

    elements.map((element) => {
      results.insertAdjacentHTML(
        element.where,
        `<div class="additional-elements hidden" tabindex="0"><small>${element.text}</small></div>`,
      );
    });

    // --------------------------------------------------
    // add history to header
    const additionalElements = document.querySelector(".additional-elements");
    // ceate history div
    const historyElement = document.createElement("div");
    historyElement.classList.add("history-element");

    // add history to header
    additionalElements.insertAdjacentElement("beforeend", historyElement);
  },

  onOpened: () => {
    const historyElement = document.querySelector(".history-element");
    historyElement.textContent = "";

    let historyElements = history.reverse().slice(0, 2);

    if (historyElements.length === 0) {
      historyElement.parentElement.classList.add("hidden");
    } else {
      historyElement.parentElement.classList.remove("hidden");
    }

    [...new Set(historyElements)].map((item) => {
      historyElement.insertAdjacentHTML(
        "beforeend",
        `<div class="flex history-item">- ${item}</div>`,
      );
    });
  },

  onSubmit: ({ element }) => {
    history.push(element.value);
  },

  // counting status elements
  onResults: ({ matches }) => {
    return matches
      .map(
        ({ name }) => `
        <li class="flex">
          <div class="name" title="clickable">${name}</div>
        </li>`,
      )
      .join("");
  },

  onReset: () => {
    history = [];
  },
});
