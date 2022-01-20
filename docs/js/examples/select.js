let firstArray = [];
const countNumber = document.querySelector(".count-number");

new Autocomplete("select", {
  onSearch: ({ currentValue }) => {
    const api = "./characters.json";
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          // first, we sort by our group, in our case
          // it will be the status, then we sort by name
          // of course, it is not always necessary because
          // such soroting may be obtained from REST API
          const result = data
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((element) => {
              return element.name.match(new RegExp(currentValue, "gi"));
            });
          resolve(result);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),

  onOpened: ({ results }) => {
    // if the elements from the 'array' are identical to those
    // from the rendered elements add the 'selected' class
    [].slice.call(results.children).map((item) => {
      if (firstArray.includes(item.textContent)) {
        item.classList.add("selected");
      }
    });
  },

  onSubmit: ({ element, results }) => {
    if (firstArray.includes(element.value)) {
      return;
    }

    // add the selected item to the array
    firstArray.push(element.value);

    // the place where we will add selected elements
    const selectedItem = document.querySelector(".selected-item");

    // create elements with names and buttons
    const button = document.createElement("button");
    button.type = "button";
    button.className = "remove-item";
    button.insertAdjacentHTML(
      "beforeend",
      '<svg aria-label="Remove name" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>'
    );

    const item = document.createElement("div");
    item.className = "item";

    // add each item in the array to the div selectedItem
    firstArray.map((itemText) => {
      item.textContent = itemText;
      item.insertAdjacentElement("beforeend", button);
      selectedItem.appendChild(item);
    });

    function setAttributeType(type) {
      [].slice.call(results.children).map((item) => {
        if (item.textContent === button.parentNode.textContent) {
          item.classList[type === "remove" ? "remove" : "add"]("selected");
        }
      });
    }

    // update number count
    countNumber.textContent = firstArray.length;

    // remove selected element
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentElement = button.parentNode;

      // remove element from array
      firstArray.splice(firstArray.indexOf(parentElement.textContent), 1);

      // remove disabled attr
      setAttributeType("remove");

      // update number count
      countNumber.textContent = firstArray.length;

      // remove element from div
      parentElement.parentNode.removeChild(parentElement);
    });

    // add disabled attr
    setAttributeType();
  },

  onReset: (element) => {
    const selectedItem = document.querySelector(".selected-item");
    selectedItem.innerHTML = "";
    // after clicking the 'x' button,
    // clear the table
    firstArray = [];

    // remove count number
    countNumber.textContent = 0;
  },
});
