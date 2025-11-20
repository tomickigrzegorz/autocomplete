let data = [
  { id: 1, name: "Walter White" },
  { id: 2, name: "Jesse Pinkman" },
  { id: 3, name: "Skyler White" },
  { id: 4, name: "Walter White Jr." },
];

const autoRerender = new Autocomplete("rerender-output", {
  classPreventClosing: "additional-elements",

  onSearch: ({ currentValue }) => {
    return data
      .filter((el) => new RegExp(currentValue, "i").test(el.name))
      .sort((a, b) => (a.clone ? -1 : 1) || a.name.localeCompare(b.name));
  },

  onResults: ({ matches }) => {
    return matches
      .map(
        ({ id, name, clone, button }) => `
        <li data-id="${id}" data-clone="${clone ?? false}" class="flex">
          <div class="name" title="clickable">${name}</div>
          <div class="additional-elements" title="not clickable">
            <span>${button ?? "CLICK"}</span></div>
        </li>`,
      )
      .join("");
  },

  onSubmit: () => {
    autoRerender.rerender();
  },
});

// -------------------------------------------------

document.addEventListener("click", ({ target }) => {
  const preventClose = target.closest(".additional-elements");

  if (!preventClose) return;

  const cloneRow = target.closest(".flex");
  const rowId = +cloneRow?.dataset.id;

  const rowClone = cloneRow?.dataset.clone;

  if (rowClone == "true") {
    cloneRow.remove();
    data = data.filter((el) => {
      return !(el.id === rowId && el.clone === true);
    });
    return;
  }

  const index = data.find((object) => object.id === rowId);
  const newindex = { ...index, clone: true, button: "REMOVE" };
  const findIndex = (object) => object.id === rowId && object?.clone === true;

  const checkIfExist = data.some(findIndex);

  if (checkIfExist) return;
  data.push(newindex);
  autoRerender.rerender();
});
