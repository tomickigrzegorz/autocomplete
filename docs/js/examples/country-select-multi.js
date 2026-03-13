const CSM_MAX = 2;
let csmSelected = [];

const csmTrigger = document.getElementById("csm-trigger");
const csmTags = document.getElementById("csm-tags");
const csmPlaceholder = document.getElementById("csm-placeholder");
const csmPanel = document.getElementById("csm-panel");
const csmLimitMsg = document.getElementById("csm-limit-msg");

function csmOpen() {
  csmPanel.classList.add("is-open");
  csmTrigger.classList.add("is-open");
  const input = document.getElementById("country-select-multi");
  input.value = "";
  input.focus();
  input.click();
}

function csmClose() {
  csmPanel.classList.remove("is-open");
  csmTrigger.classList.remove("is-open");
  csmLimitMsg.classList.remove("is-visible");
}

function csmRemove(id) {
  csmSelected = csmSelected.filter((c) => c.id !== id);
  const tag = csmTags.querySelector(`[data-code="${id}"]`);
  if (tag) tag.remove();
  csmPlaceholder.style.display = csmSelected.length === 0 ? "" : "none";
  csmLimitMsg.classList.remove("is-visible");
  csmTrigger.classList.remove("is-open");
}

function csmAddTag(country) {
  const tag = document.createElement("span");
  tag.className = "csm-tag";
  tag.dataset.code = country.id;
  tag.innerHTML = `<img src="${country.flag}" class="csm-tag-flag" alt="${country.text}" />${country.text}<button class="csm-tag-remove" type="button" aria-label="Remove">&#10005;</button>`;
  tag.querySelector(".csm-tag-remove").addEventListener("click", (e) => {
    e.stopPropagation();
    csmRemove(country.id);
  });
  csmTags.appendChild(tag);
  csmPlaceholder.style.display = "none";
}

csmTrigger.addEventListener("click", () => {
  if (
    csmPanel.classList.contains("is-open") ||
    csmLimitMsg.classList.contains("is-visible")
  ) {
    csmClose();
    return;
  }
  if (csmSelected.length >= CSM_MAX) {
    csmTrigger.classList.add("is-open");
    csmLimitMsg.classList.add("is-visible");
  } else {
    csmOpen();
  }
});
csmTrigger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ")
    csmPanel.classList.contains("is-open") ? csmClose() : csmOpen();
  if (e.key === "Escape") csmClose();
});

document.addEventListener("click", (e) => {
  if (!csmPanel.contains(e.target) && !csmTrigger.contains(e.target)) {
    csmClose();
  }
});

new Autocomplete("country-select-multi", {
  dropdownParent: document.body,
  showValuesOnClick: true,
  clearButton: false,
  cache: true,
  classPrefix: "csm",

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

  // mark already-selected items directly in the rendered HTML
  onResults: ({ currentValue, matches }) =>
    matches
      .map((c) => {
        const isSelected = csmSelected.some((s) => s.id === c.id);
        const label = currentValue
          ? c.text.replace(
              new RegExp(currentValue, "gi"),
              (s) => `<mark>${s}</mark>`,
            )
          : c.text;
        return `
        <li class="cs-item${isSelected ? " csm-auto-selected" : ""}">
          <img src="${c.flag}" alt="${c.text}" class="cs-item-flag" />
          <span>${label}</span>
        </li>`;
      })
      .join(""),

  onSubmit: ({ object }) => {
    // clicking an already-selected item removes it
    const existingIndex = csmSelected.findIndex((c) => c.id === object.id);
    if (existingIndex !== -1) {
      csmRemove(object.id);
      csmClose();
      return;
    }

    if (csmSelected.length >= CSM_MAX) return;
    csmSelected.push(object);
    csmAddTag(object);
    csmClose();
  },

  noResults: ({ element }) => `<li>No country found: "${element.value}"</li>`,
});
