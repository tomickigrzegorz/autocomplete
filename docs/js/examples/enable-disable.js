// Example showing enable/disable functionality with empty input
function initEnableDisableExample() {
  const dataEnableDisable = [
    { name: "Walter White", occupation: "High School Chemistry Teacher" },
    { name: "Jesse Pinkman", occupation: "Former Student" },
    { name: "Skyler White", occupation: "Bookkeeper" },
    { name: "Hank Schrader", occupation: "DEA Agent" },
    { name: "Saul Goodman", occupation: "Lawyer" },
    { name: "Mike Ehrmantraut", occupation: "Security Consultant" },
    { name: "Gus Fring", occupation: "Restaurant Owner" },
    { name: "Marie Schrader", occupation: "Radiologic Technologist" },
    { name: "Todd Alquist", occupation: "Exterminator" },
    { name: "Lydia Rodarte-Quayle", occupation: "Business Executive" },
  ];

  // Autocomplete instance - initially null
  let autoEnableDisable = null;

  // Function to create autocomplete instance
  function createAutocomplete() {
    if (autoEnableDisable) return autoEnableDisable; // Already exists
    autoEnableDisable = new Autocomplete("enable-disable", {
      onSearch: ({ currentValue }) => {
        return new Promise((resolve) => {
          const results = dataEnableDisable.filter((item) =>
            item.name.toLowerCase().includes(currentValue.toLowerCase()),
          );
          resolve(results);
        });
      },
      onResults: ({ matches }) => {
        return matches
          .map(
            (item) =>
              `<li><strong>${item.name}</strong><br><small>${item.occupation}</small></li>`,
          )
          .join("");
      },
      onSubmit: ({ object }) => {
        console.log("Selected:", object);
      },
    });

    return autoEnableDisable;
  }

  // Get buttons
  const disableBtnED = document.getElementById("disable-btn-ed");
  const enableBtnED = document.getElementById("enable-btn-ed");
  const fillBtnED = document.getElementById("fill-btn-ed");
  const statusDivED = document.getElementById("status-ed");

  if (!disableBtnED || !enableBtnED || !fillBtnED || !statusDivED) {
    console.error("❌ Some elements not found! Check HTML structure.");
    return;
  }

  // Update status display
  function updateStatusED(status) {
    statusDivED.textContent = `Status: ${status}`;
    statusDivED.className =
      status === "Enabled" ? "status-enabled" : "status-disabled";
  }

  // Initial status - no autocomplete yet
  updateStatusED("Disabled");

  // Enable button handler - creates and enables autocomplete
  enableBtnED.addEventListener("click", () => {
    if (!autoEnableDisable) {
      autoEnableDisable = createAutocomplete();
      console.log("✅ Autocomplete created and enabled!");
    } else {
      autoEnableDisable.enable();
      console.log("✅ Autocomplete re-enabled!");
    }
    updateStatusED("Enabled");
  });

  // Disable button handler
  disableBtnED.addEventListener("click", () => {
    if (autoEnableDisable) {
      autoEnableDisable.disable();
      updateStatusED("Disabled");
      console.log("❌ Autocomplete disabled");
    } else {
      console.log("❌ No autocomplete to disable");
    }
  });

  // Fill input button handler
  fillBtnED.addEventListener("click", () => {
    const input = document.getElementById("enable-disable");
    const randomItem =
      dataEnableDisable[Math.floor(Math.random() * dataEnableDisable.length)];
    input.value = randomItem.name;
    console.log("📝 Filled input with:", randomItem.name);

    // If autocomplete exists, trigger search
    if (autoEnableDisable) {
      autoEnableDisable.rerender(randomItem.name);
      console.log("🔍 Triggered search for:", randomItem.name);
    } else {
      console.log("ℹ️ No autocomplete instance - just filled input");
    }
  });

  // Log input events to show when search is triggered
  document.getElementById("enable-disable").addEventListener("input", (e) => {
    if (e.target.value.length >= 1) {
      console.log("Search triggered by user input:", e.target.value);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEnableDisableExample);
} else {
  initEnableDisableExample();
}
