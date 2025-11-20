const info = document.querySelector(".info-d");

new Autocomplete("static-file-data", {
  selectFirst: true,

  // onSearch
  onSearch: ({ currentValue }) => {
    // static file
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

  onResults: ({ currentValue, matches }) => {
    return matches
      .map(({ name, status }) => {
        return `
          <li class="loupe">
            <p>${name.replace(
              new RegExp(currentValue, "gi"),
              (str) => `<b>${str}</b>`,
            )}</p>
            <small>status - ${status}</small>
          </li>`;
      })
      .join("");
  },

  // event onsubmit
  onSubmit: ({ index, element, object }) => {
    const { name, status, img } = object;

    console.table("static-file-data", index, element, object);

    const template = `
    <p>name - ${name}</p>
    <p>status - ${status}</p>
    <div class="image"><img src="${img}"></div>`;

    info.textContent = "";
    info.classList.add("active-data");
    info.insertAdjacentHTML("beforeend", template);
  },

  // get index and data from li element after
  // hovering over li with the mouse
  onSelectedItem: ({ index, element, object }) => {
    console.log("onSelectedItem:", index, element.value, object);
  },

  onReset: () => {
    info.textContent = "";
    info.classList.remove("active-data");
  },
});
