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
