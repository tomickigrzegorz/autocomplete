const csTrigger = document.getElementById("cs-trigger");
const csFlag = document.getElementById("cs-flag");
const csName = document.getElementById("cs-name");
const csClear = document.getElementById("cs-clear");
const csPanel = document.getElementById("cs-panel");

function openCs() {
  csPanel.classList.add("is-open");
  csTrigger.classList.add("is-open");
  const input = document.getElementById("country-select");
  input.focus();
  input.click();
}

function closeCs() {
  csPanel.classList.remove("is-open");
  csTrigger.classList.remove("is-open");
}

function clearCs(e) {
  e.stopPropagation();
  csFlag.src = "";
  csFlag.alt = "";
  csFlag.classList.remove("cs-flag--visible");
  csName.textContent = "Country";
  csClear.classList.remove("cs-clear--visible");
  const input = document.getElementById("country-select");
  input.value = "";
  closeCs();
  document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

csTrigger.addEventListener("click", () => {
  csPanel.classList.contains("is-open") ? closeCs() : openCs();
});
csTrigger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ")
    csPanel.classList.contains("is-open") ? closeCs() : openCs();
  if (e.key === "Escape") closeCs();
});

csClear.addEventListener("click", clearCs);

document.addEventListener("click", (e) => {
  if (!csPanel.contains(e.target) && !csTrigger.contains(e.target)) {
    closeCs();
  }
});

new Autocomplete("country-select", {
  dropdownParent: document.body,
  showValuesOnClick: true,
  clearButton: false,
  cache: true,
  selectFirst: true,
  classPrefix: "country-select",

  onSearch: ({ currentValue }) =>
    fetch("./phoneCodes.json")
      .then((r) => r.json())
      .then((data) =>
        data
          .filter((c) =>
            new RegExp(currentValue.replace(/\\/g, ""), "i").test(c.text),
          )
          .sort((a, b) => a.text.localeCompare(b.text)),
      ),

  onResults: ({ currentValue, matches }) =>
    matches
      .map(
        (c) => `
        <li class="cs-item">
          <img src="${c.flag}" alt="${c.text}" class="cs-item-flag" />
          <span>${
            currentValue
              ? c.text.replace(
                  new RegExp(currentValue, "gi"),
                  (s) => `<mark>${s}</mark>`,
                )
              : c.text
          }</span>
        </li>`,
      )
      .join(""),

  onSubmit: ({ object }) => {
    csFlag.src = object.flag;
    csFlag.alt = object.text;
    csFlag.classList.add("cs-flag--visible");
    csName.textContent = object.text;
    csClear.classList.add("cs-clear--visible");
    closeCs();
  },

  noResults: ({ element }) => `<li>No country found: "${element.value}"</li>`,
});
