const modal = document.querySelector('.modal');
const modalSearch = document.querySelector('.modal-search');

new Autocomplete('modal-example', {
  onSearch: ({ currentValue }) => {
    // local data
    const data = [
      { name: 'Walter White' },
      { name: 'Jesse Pinkman' },
      { name: 'Skyler White' },
      { name: 'Walter White Jr.' },
    ];
    return data
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((element) => {
        return element.name.match(new RegExp(currentValue, 'i'));
      });
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(''),

  // add 'active' class to modal div
  onOpened: () => {
    modal.classList.add('active');
    modalSearch.setAttribute('style', 'z-index: 2');
  },

  // delete 'active' class from modal if closing results
  onClose: () => {
    modal.classList.remove('active');
    modalSearch.removeAttribute('style');
  },
});
