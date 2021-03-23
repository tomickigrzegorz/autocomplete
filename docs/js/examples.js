window.addEventListener('DOMContentLoaded', () => {

  /**
   * BASIC
   */

  new Autocomplete('basic', {

    onSearch: ({ currentValue }) => {
      const api = `https://breakingbadapi.com/api/characters?name=${encodeURI(currentValue)}`;
      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    onResults: ({ matches }) => {
      return matches
        .map(el => {
          return `
            <li>${el.name}</li>`;
        }).join('');
    },
  });

  /**
   * COMPLEX EXAMPLE
   */

  new Autocomplete('complex', {
    // search delay
    delay: 1000,

    // add button 'x' to clear the text from
    // the input filed
    clearButton: true,

    // default selects the first item in
    // the list of results
    selectFirst: true,

    // add text to the input field as you move through
    // the results with the up/down cursors
    insertToInput: true,

    // the number of characters entered
    // should start searching
    howManyCharacters: 1,

    // enter the name of the class by
    // which you will name the group element
    classGroup: 'group-by',

    // Function for user input. It can be a synchronous function or a promise
    // you can fetch data with jquery, axios, fetch, etc.
    onSearch: ({ currentValue }) => {
      // static file
      // const api = './characters.json';

      // OR -------------------------------

      // your REST API
      const api = `https://breakingbadapi.com/api/characters?name=${encodeURI(currentValue)}`;
      /**
        * jquery
        * If you want to use jquery you have to add the
        * jquery library to head html
        * https://cdnjs.com/libraries/jquery
        */
      // return $.ajax({
      //   url: api,
      //   method: 'GET',
      // })
      //   .done(function (data) {
      //     return data
      //   })
      //   .fail(function (xhr) {
      //     console.error(xhr);
      //   });

      // OR ----------------------------------

      /**
        * axios
        * If you want to use axios you have to add the
        * axios library to head html
        * https://cdnjs.com/libraries/axios
        */
      // return axios.get(api)
      //   .then((response) => {
      //     return response.data;
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      // OR ----------------------------------

      /**
        * Promise
        */
      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    // this part is responsible for the number of records,
    // the appearance of li elements and it really depends
    // on you how it will look
    onResults: ({ currentValue, matches, template, classGroup }) => {
      // const regex = new RegExp(^${input}`, 'gi'); // start with
      const regex = new RegExp(currentValue, 'gi');

      // counting status elements
      function count(status) {
        let count = {};
        matches.map(el => {
          count[el.status] = (count[el.status] || 0) + 1;
        });
        return `<small>${count[status]} items</small>`;
      }

      // checking if we have results if we don't
      // take data from the noResults method
      return matches === 0 ? template : matches
        .sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name))
        .map((el, index, array) => {
          // we create an element of the group
          let group = el.status !== array[index - 1]?.status
            ? `<li class="${classGroup}"><span>${el.status}</span> ${count(el.status)}</li>`
            : '';

          // this part is responsible for the appearance
          // in the drop-down list - see the example in index.html
          // remember only the first element from <li> is put
          // into the input field, in this case the text
          // from the <p> element
          return `
            ${group}
            <li>
              <h2 style="margin-bottom: 10px;">
                ${el.name.replace(regex, (str) => `<b style="color: red;">${str}</b>`)}
              </h2>
              <div style="display: flex;">
                <div style="margin-right: 10px;">
                  <img src="${el.img}" style="max-width: 67px;max-height:95px">
                </div>
                <div class="info">
                  <h4>${el.name}</h4>
                  <div><b>nickname:</b> - ${el.nickname}</div>
                  <div><b>birthday:</b> - ${el.birthday}</div>
                  <div><b>status:</b> - ${el.status}</div>
                </div>
              </div>
            </li>`;
        }).join('');
    },

    // the onSubmit function is executed when the user
    // submits their result by either selecting a result
    // from the list, or pressing enter or mouse button
    onSubmit: ({ index, element, object, results }) => {
      console.log('complex: ', index, element, object, results);
      // window.open(`https://www.imdb.com/find?q=${encodeURI(input)}`)
    },

    // get index and data from li element after
    // hovering over li with the mouse or using
    // arrow keys ↓ | ↑
    onSelectedItem: ({ index, element, object }) => {
      console.log('onSelectedItem:', index, element.value, object);
    },

    // the method presents no results
    noResults: ({ element, template }) => {
      template(`<li>No results found: "${element.value}"</li>`)
    }
  });


  /**
   * NO-RESULTS
   */

  new Autocomplete('no-results', {
    onSearch: ({ currentValue }) => {
      const api = './characters.json';
      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            const result = data.sort((a, b) => a.name.localeCompare(b.name))
              .filter(element => {
                return element.name.match(new RegExp(currentValue, 'gi'))
              })
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    onResults: ({ matches, template }) => {
      // checking if we have results if we don't
      // take data from the noResults method
      return matches === 0 ? template : matches
        .map(el => {
          return `
          <li>${el.name}</li>`;
        }).join('');
    },

    noResults: ({ element, template }) => template(`<li>No results found: "${element.value}"</li>`)
  });


  /**
   * STATIC FILE
   */

  new Autocomplete('static', {
    clearButton: true,

    // onSearch
    onSearch: ({ currentValue }) => {
      // static file
      const api = './characters.json';

      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            const result = data.sort((a, b) => a.name.localeCompare(b.name))
              .filter(element => {
                return element.name.match(new RegExp(currentValue, 'gi'))
              })
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    onResults: ({ currentValue, matches }) => {
      return matches
        .map(el => {
          return `
          <li class="loupe">
            <p>${el.name.replace(new RegExp(currentValue, 'gi'), (str) => `<b>${str}</b>`)}</p>
          </li>`;
        })
        .join('');
    }
  });


  /**
   * STATIC FILE
   */

  new Autocomplete('static-file-data', {
    clearButton: true,
    selectFirst: true,

    // onSearch
    onSearch: ({ currentValue }) => {
      // static file
      const api = './characters.json';

      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            const result = data
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter((element) => {
                return element.name.match(new RegExp(currentValue, 'gi'));
              });
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    onResults: ({ currentValue, matches }) => {
      return matches.map(({ name, status }) => {
        return `
        <li class="loupe">
          <p>${name.replace(new RegExp(currentValue, 'gi'), (str) => `<b>${str}</b>`)}</p>
          <small>status - ${status}</small>
        </li>`;
      }).join('');
    },

    // event onsubmit
    onSubmit: ({ index, element, object }) => {
      const { name, status, img } = object;

      console.table('static-file-data', index, element, object);

      const template = `
      <p>name - ${name}</p>
      <p>status - ${status}</p>
      <div class="image"><img src="${img}"></div>`;

      const info = document.querySelector('.info-d');
      info.classList.add('active-data');
      info.innerHTML = template;
    },

    // get index and data from li element after
    // hovering over li with the mouse
    onSelectedItem: ({ index, element, object }) => {
      console.log('onSelectedItem:', index, element.value, object);
    },

  });

  /**
   * GROUP
   */

  new Autocomplete('group', {
    clearButton: true,

    // enter a class name, this class will
    // be added to the group name elements
    classGroup: 'group-by',

    onSearch: ({ currentValue }) => {
      const api = './characters.json';
      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {

            // first, we sort by our group, in our case
            // it will be the status, then we sort by name
            // of course, it is not always necessary because
            // such soroting may be obtained from REST API
            const result = data
              .sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name))
              .filter(element => {
                return element.name.match(new RegExp(currentValue, 'gi'))
              })
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    onResults: ({ currentValue, matches, template, classGroup }) => {

      // counting status elements
      function count(status) {
        let count = {};
        matches.map(el => {
          count[el.status] = (count[el.status] || 0) + 1;
        });
        return `<small>${count[status]} items</small>`;
      }

      return matches === 0 ? template : matches
        .map((el, index, array) => {

          const icons = `${el.status.toLowerCase().replace(/\s/g, '-')}`;
          // we create an element of the group
          let group = el.status !== array[index - 1]?.status
            ? `<li class="${classGroup}"><span>${el.status}</span> ${count(el.status)}</li>`
            : '';

          return `
            ${group}
            <li class="icon ${icons}">
              <p>${el.name.replace(new RegExp(currentValue, 'gi'), (str) => `<b>${str}</b>`)}</p>
            </li>`;
        }).join('');
    },

    onSelectedItem: ({ index, element, object }) => {
      console.log(index, element, object)
    },

    noResults: ({ currentValue, template }) => template(`<li>No results found: "${currentValue}"</li>`),
  });


  /**
   * local data
   */

  new Autocomplete('local', {
    onSearch: ({ currentValue }) => {

      // local data
      const data = [
        { "name": "Walter White" },
        { "name": "Jesse Pinkman" },
        { "name": "Skyler White" },
        { "name": "Walter White Jr." }
      ];
      return data.sort((a, b) => a.name.localeCompare(b.name))
        .filter(element => {
          return element.name.match(new RegExp(currentValue, 'i'))
        })
    },

    onResults: ({ matches }) => {
      return matches
        .map(el => {
          return `
            <li>${el.name}</li>`;
        }).join('');
    }
  });


  /**
   * LOCAL DATA
   */

  let firstArray = [];
  const countNumber = document.querySelector('.count-number');

  new Autocomplete('select', {
    clearButton: true,

    onSearch: ({ currentValue }) => {
      const api = './characters.json';
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
              .filter(element => {
                return element.name.match(new RegExp(currentValue, 'gi'))
              })
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    onResults: ({ matches }) => {
      return matches
        .map(el => {
          return `
            <li>${el.name}</li>`;
        }).join('');
    },

    onOpened: ({ results }) => {
      // if the elements from the 'array' are identical to those
      // from the rendered elements add the 'selected' class
      [].slice.call(results.children).map(item => {
        if (firstArray.includes(item.textContent)) {
          item.classList.add('selected');
        }
      });
    },

    onSubmit: ({ element, results }) => {
      if (firstArray.includes(element.value)) {
        return;
      };

      // add the selected item to the array
      firstArray.push(element.value);

      // the place where we will add selected elements
      const selectedItem = document.querySelector('.selected-item');

      // create elements with names and buttons
      const button = document.createElement('button');
      button.type = 'button'
      button.className = 'remove-item';
      button.insertAdjacentHTML('beforeend', '<svg aria-label="Remove name" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>');

      const item = document.createElement('div');
      item.className = 'item';

      // add each item in the array to the div selectedItem
      firstArray.map(itemText => {
        item.textContent = itemText;
        item.insertAdjacentElement('beforeend', button);
        selectedItem.appendChild(item);
      });

      function setAttributeType(type) {
        [].slice.call(results.children).map(item => {
          if (item.textContent === button.parentNode.textContent) {
            item.classList[type === 'remove' ? 'remove' : 'add']('selected')
          }
        });
      }

      // update number count
      countNumber.textContent = firstArray.length;

      // remove selected element
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const parentElement = button.parentNode;

        // remove element from array
        firstArray.splice(firstArray.indexOf(parentElement.textContent), 1);

        // remove disabled attr
        setAttributeType('remove');

        // update number count
        countNumber.textContent = firstArray.length;

        // remove element from div
        parentElement.parentNode.removeChild(parentElement);
      });

      // add disabled attr
      setAttributeType();
    },

    onReset: (element) => {
      const selectedItem = document.querySelector('.selected-item');
      selectedItem.innerHTML = '';
      // after clicking the 'x' button,
      // clear the table
      firstArray = [];

      // remove count number
      countNumber.textContent = 0;
    }
  });


  /**
   * MULTIPLE VALUES
   */

  // array initialization
  let secondArray = [];
  new Autocomplete('multiple-values', {
    clearButton: true,

    onSearch: ({ element }) => {
      // first get all the items and split with a comma
      const lastElement = element.value.split(',').pop().trim();
      // if the last item is 0 then we don't do a search
      if (lastElement.length === 0) return;

      const data = [
        { "name": "Grzesiek" },
        { "name": "Andrzej" },
        { "name": "Monika" },
        { "name": "Wiesława" },
        { "name": "Waldemar" },
        { "name": "Włodzimierz" },
        { "name": "Adam" },
        { "name": "Agnieszka" },
        { "name": "Paweł" },
        { "name": "Tadeusz" },
        { "name": "Tymoteusz" },
        { "name": "Łucja" },
        { "name": "Nela" }
      ];
      return data.sort((a, b) => a.name.localeCompare(b.name))
        .filter(element => {
          return element.name.match(new RegExp(lastElement, 'gi'))
        })
    },

    onResults: ({ matches }) => {
      return matches
        .map(el => {
          return `
            <li class='loupe'>${el.name}</li>`;
        }).join('');
    },

    onOpened: ({ element, results }) => {
      // type - two values 'results' and 'showItems',
      // 'resutls' first rendering of the results
      // 'showItems' only showing the results when clicking on the input field
      // resultList all results rendered containing ul and li
      // input - root input

      // get the data from the input field and divide by the
      // decimal point, then remove the empty last element
      const currentValue = element.value.split(', ').splice(0, element.value.length - 1);

      // leave in the array only those elements that are in the input field
      secondArray = secondArray.filter(el => currentValue.includes(el));

      // check if the table 'multipleArr' contains selected elements from 
      // the input field, if so we add the 'selected' class to the 'li' element,
      // if not, remove the 'selected' class from the li element
      [].slice.call(results.children).map(item => {
        item.classList[secondArray.includes(item.textContent) ? 'add' : 'remove']('selected')
      });

    },

    onSubmit: ({ index, element, object, results }) => {
      if (secondArray.includes(element.value)) {
        return;
      };

      console.log('index: ', index, 'object: ', object, 'results: ', results);

      // each click on the li element adds data to the array
      secondArray.push(element.value.trim());

      // check if the table includes selected items from
      // the list, if so, add the 'selected' class
      [].slice.call(results.children).map(item => {
        if (secondArray.includes(item.textContent)) {
          item.classList.add('selected');
        }
      });

      // add the elements from the array separated by commas
      // to the 'input' field, also add a comma to the last element
      element.value = `${secondArray.join(', ')}${secondArray > 2 ? secondArray.pop()[secondArray.length - 1] : ', '}`;

      // after selecting an item, set the
      // focus to the input field
      element.focus();
    },

    onReset: (element) => {
      // after clicking the 'x' button,
      // clear the table
      secondArray = [];
    }
  });


  /**
   * Checkboxes
   */

  let checkbox = [];
  const countNumberCheckbox = document.querySelector('.count-number-checkbox');

  // the place where we will add selected elements
  const selectedItem = document.querySelector('.selected-item-checkbox');

  new Autocomplete('checkbox', {
    clearButton: true,

    // wyłączenie zamukania jeżeli wybierzemy element
    disableCloseOnSelect: true,

    onSearch: ({ currentValue }) => {
      const api = './characters.json';
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
              .filter(element => {
                return element.name.match(new RegExp(currentValue, 'gi'))
              })
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    onResults: ({ matches }) => {
      return matches
        .map(el => {
          return `
            <li class="custom-element">
              <label>
                <input type="checkbox" value="${el.name}">
                <div class="checkbox">${el.name}</div>
              </label>
            </li>`;
        }).join('');
    },

    onOpened: ({ results }) => {
      // if the elements from the 'array' are identical to those
      // from the rendered elements add the 'selected' class

      console.log(checkbox);
      [].slice.call(results.children).map((item, idx) => {
        let inputElement = results.children[idx].firstElementChild.children[0];
        if (checkbox[idx]?.val == item.textContent.trim()) {
          inputElement.checked = true;
        }
      });
    },

    onSubmit: ({ index, element, object, results }) => {
      if (checkbox.includes(element.value)) {
        return;
      };

      let inputElement = results.children[index].firstElementChild.children[0];

      if (inputElement.checked) {
        // set false checbox
        inputElement.checked = false;
        // remove from array object
        checkbox.splice(checkbox.indexOf({ index, val: element.val }), 1);
        // remove from div button
        const dataElement = document.querySelector(`[data-index="${index}"]`);
        dataElement.parentNode.removeChild(dataElement);
        return
      }

      inputElement.checked = true;

      // add the selected item to the array
      checkbox.push({ index, val: element.value });

      // create elements with names and buttons
      const button = document.createElement('button');
      button.type = 'button'
      button.className = 'remove-item';
      button.insertAdjacentHTML('beforeend', '<svg aria-label="Remove name" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>');

      const item = document.createElement('div');
      item.className = 'item';
      item.dataset.index = index;

      // add each item in the array to the div selectedItem
      checkbox.map(object => {
        const { val } = object;
        item.textContent = val;
        item.insertAdjacentElement('beforeend', button);
        selectedItem.appendChild(item);
      });

      function setAttributeType(type) {
        [].slice.call(results.children).map(item => {
          if (item.textContent.trim() === button.parentNode.textContent) {
            item.classList[type === 'remove' ? 'remove' : 'add']('selected')
          }
        });
      }

      // update number count
      countNumberCheckbox.textContent = checkbox.length;

      // remove selected element
      button.addEventListener('click', (e) => {
        e.preventDefault();

        const parentElement = button.parentNode;

        const element = e.target.closest('.item');
        const index = element.dataset.index;

        // remove element from array
        // checkbox.splice(checkbox.indexOf(parentElement.textContent), 1);
        checkbox.splice(checkbox.indexOf({ index, val: element.textContent }), 1);

        [].slice.call(results.children).map((item, idx) => {
          console.log(item);
          let inputElement = results.children[idx].firstElementChild.children[0];
          inputElement.checked = false;
          if (checkbox[idx]?.val == item.textContent.trim()) {
            inputElement.checked = true;
          }
        });

        // remove disabled attr
        setAttributeType('remove');

        // update number count
        countNumberCheckbox.textContent = checkbox.length;

        // remove element from div
        parentElement.parentNode.removeChild(parentElement);
      });

      // add disabled attr
      if (!inputElement.checked) {
        setAttributeType();
      }
    },

    onReset: (element) => {
      selectedItem.innerHTML = '';
      // after clicking the 'x' button,
      // clear the table
      checkbox = [];

      // remove count number
      countNumberCheckbox.textContent = 0;
    },

    noResults: ({ element, renderTemplate }) => renderTemplate(`No results found: "${element.value}"`)
  });

});