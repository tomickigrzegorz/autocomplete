const unmountInput = document.getElementById("unmount");
const unmountStatus = document.getElementById("status-unmount");

const unmountOptions = {
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
};

// delay used when the instance is (re)created
let unmountDelay = 500;

// the input element can be passed instead of its id
let autocompleteUnmount = new Autocomplete(unmountInput, {
  ...unmountOptions,
  delay: unmountDelay,
});

const updateUnmountStatus = () => {
  const mounted = autocompleteUnmount !== null;
  unmountStatus.textContent = mounted
    ? `Status: mounted (delay ${unmountDelay}ms)`
    : "Status: unmounted — a plain input, the typed text stays";
  unmountStatus.className = mounted ? "status-enabled" : "status-disabled";
};

updateUnmountStatus();

// unmount — removes the dropdown, clear button and all listeners,
// but keeps the input value (unlike destroy())
document.getElementById("unmount-btn").addEventListener("click", () => {
  if (!autocompleteUnmount) return;
  autocompleteUnmount.unmount();
  autocompleteUnmount = null;
  updateUnmountStatus();
});

// mount — create a new instance on the same input
document.getElementById("mount-btn").addEventListener("click", () => {
  if (autocompleteUnmount) return;
  autocompleteUnmount = new Autocomplete(unmountInput, {
    ...unmountOptions,
    delay: unmountDelay,
  });
  updateUnmountStatus();
});

// re-create with new options — unmount() + new Autocomplete()
document.getElementById("remount-btn").addEventListener("click", () => {
  unmountDelay = unmountDelay === 500 ? 0 : 500;
  autocompleteUnmount?.unmount();
  autocompleteUnmount = new Autocomplete(unmountInput, {
    ...unmountOptions,
    delay: unmountDelay,
  });
  updateUnmountStatus();
});
