const dpModal = document.getElementById("dropdown-parent-modal");
const dpOpenBtn = document.getElementById("open-dropdown-parent-modal");
const dpCloseBtn = document.getElementById("close-dropdown-parent-modal");

const dpData = [
  { name: "Walter White" },
  { name: "Jesse Pinkman" },
  { name: "Skyler White" },
  { name: "Walter White Jr." },
  { name: "Saul Goodman" },
  { name: "Hank Schrader" },
  { name: "Mike Ehrmantraut" },
];

// Inline example — input is inside a container with overflow: hidden.
// Without dropdownParent the dropdown would be clipped; with it, the
// resultWrap is appended to document.body and positioned via position: fixed.
//
// dropdownAttrs adds extra attributes to the wrapper element that is appended
// to dropdownParent. Use `class` to apply CSS classes and `style` for inline
// CSS — useful e.g. to override the default z-index of 9999.
//
// onReset fires after all listeners are removed, so enable() can be called
// directly — no setTimeout needed.
let dpInlineAc;
dpInlineAc = new Autocomplete("dropdown-parent-inline", {
  dropdownParent: document.body,
  dropdownAttrs: {
    class: "my-wrapper",
    style: "z-index: 10001",
  },
  insertToInput: true,

  onSearch: ({ currentValue }) =>
    dpData
      .filter((el) => new RegExp(currentValue, "i").test(el.name))
      .sort((a, b) => a.name.localeCompare(b.name)),

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),

  onReset: () => dpInlineAc.enable(),
});

// Initialize once on first open.
// On re-open: enable() restores event listeners and re-attaches the resultWrap
// to document.body if destroy() had removed it (e.g. via the clear button).
// On close: destroy() cleans up the resultWrap from body and removes listeners,
// preventing orphaned elements when the modal is reused.
let dpAc = null;

dpOpenBtn.addEventListener("click", () => {
  dpModal.style.display = "flex";

  if (dpAc) {
    dpAc.enable();
  } else {
    dpAc = new Autocomplete("dropdown-parent", {
      dropdownParent: document.body,
      insertToInput: true,

      onSearch: ({ currentValue }) =>
        dpData
          .filter((el) => new RegExp(currentValue, "i").test(el.name))
          .sort((a, b) => a.name.localeCompare(b.name)),

      onResults: ({ matches }) =>
        matches.map((el) => `<li>${el.name}</li>`).join(""),

      onReset: () => dpAc.enable(),
    });
  }
});

dpCloseBtn.addEventListener("click", () => {
  dpModal.style.display = "none";
  // destroy() closes the dropdown, removes listeners, and removes resultWrap
  // from document.body — keeping the DOM clean for next open.
  dpAc && dpAc.destroy();
});
