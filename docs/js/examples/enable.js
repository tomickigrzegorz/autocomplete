const autocompleteEnable = new Autocomplete("enable-toggle", {
  onSearch: ({ currentValue }) => {
    const data = [
      { name: "Walter White" },
      { name: "Jesse Pinkman" },
      { name: "Skyler White" },
      { name: "Walter White Jr." },
    ];
    return data.filter((item) =>
      item.name.toLowerCase().includes(currentValue.toLowerCase()),
    );
  },
  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),
});

// Buttons for enabling/disabling
const disableBtn = document.getElementById("disable-btn");
const enableBtn = document.getElementById("enable-btn");

// Disable autocomplete
disableBtn.addEventListener("click", () => {
  autocompleteEnable.disable();
  console.log("Autocomplete disabled");
});

// Enable autocomplete
enableBtn.addEventListener("click", () => {
  autocompleteEnable.enable();
  // if you trigger rerender then you'll be able to click on the
  // input and see the list of results based on the entered text

  // autocompleteEnable.rerender();

  // if you trigger rerender with a string, the input will show
  // that text and you'll see the results based on it

  // autocompleteEnable.rerender("sk");
  console.log("Autocomplete enabled");
});

// Alternative: toggle functionality
const toggleBtn = document.getElementById("toggle-btn");
let isEnabled = true;

toggleBtn.addEventListener("click", () => {
  if (isEnabled) {
    autocompleteEnable.disable();
    toggleBtn.textContent = "Toggle Disable";
    isEnabled = false;
  } else {
    autocompleteEnable.enable();
    toggleBtn.textContent = "Toggle Enable";
    isEnabled = true;
  }
});
