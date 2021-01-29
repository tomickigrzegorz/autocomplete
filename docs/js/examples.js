window.addEventListener('DOMContentLoaded', () => {

  // basic
  new Autocomplete('basic', {
    onSearch: (input) => {
      const api = `https://breakingbadapi.com/api/characters?name=${encodeURI(input)}`;
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
    onResults: (matches, input) => {
      return matches
        .map((el, index) => {
          return `
                  <li>${el.name}</li>`;
        }).join('');
    },
  });


  // complex example example
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
    onSearch: (input) => {
      // static file
      // const api = './characters.json';

      // OR -------------------------------

      // your REST API
      const api = `https://breakingbadapi.com/api/characters?name=${encodeURI(input)}`;
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
    onResults: (matches, input, className) => {
      // const regex = new RegExp(^${input}`, 'gi'); // start with
      const regex = new RegExp(input, 'gi');

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
      return matches === 0 ? input : matches
        .sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name))
        .map((el, index, array) => {
          // we create an element of the group
          let group = el.status !== array[index - 1]?.status
            ? `<li class="${className}">${el.status} ${count(el.status)}</li>`
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
    onSubmit: (matches, input) => {
      console.table('complex', input, matches);
      // window.open(`https://www.imdb.com/find?q=${encodeURI(input)}`)
    },

    // get index and data from li element after
    // hovering over li with the mouse or using
    // arrow keys ↓ | ↑
    onSelectedItem: (index, matches) => {
      console.log('onSelectedItem:', index, matches);
    },

    // the method presents no results
    noResults: (input, resultRender) => resultRender(`<li>No results found: "${input}"</li>`)
  });



  // no-results
  new Autocomplete('no-results', {
    onSearch: (input) => {
      const api = './characters.json';
      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            const result = data.sort((a, b) => a.name.localeCompare(b.name))
              .filter(element => {
                return element.name.match(new RegExp(input, 'gi'))
              })
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },
    onResults: (matches, input) => {
      // checking if we have results if we don't
      // take data from the noResults method
      return matches === 0 ? input : matches
        .map((el, index) => {
          return `
                <li>${el.name}</li>`;
        }).join('');
    },
    noResults: (input, resultRender) => resultRender(`<li>No results found: "${input}"</li>`)
  });


  // static file
  new Autocomplete('static', {
    clearButton: true,
    // selectFirst: true,
    howManyCharacters: 1,
    // onSearch
    onSearch: (input) => {
      // static file
      const api = './characters.json';

      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            const result = data.sort((a, b) => a.name.localeCompare(b.name))
              .filter(element => {
                return element.name.match(new RegExp(input, 'gi'))
              })
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    onResults: (matches, input) => {
      return matches
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((el) => {
          return `
                  <li class="loupe">
                    <p>${el.name.replace(new RegExp(input, 'gi'), (str) => `<b>${str}</b>`)}</p>
                  </li>`;
        })
        .join('');
    }
  });

  // static file
  new Autocomplete('static-file-data', {
    clearButton: true,
    selectFirst: true,
    howManyCharacters: 1,

    // onSearch
    onSearch: (input) => {
      // static file
      const api = './characters.json';

      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            const result = data
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter((element) => {
                return element.name.match(new RegExp(input, 'gi'));
              });
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    onResults: (matches, input) => {
      return matches.map(({ name, status }) => {
        return `
          <li class="loupe">
            <p>${name.replace(new RegExp(input, 'gi'), (str) => `<b>${str}</b>`)}</p>
            <small>status - ${status}</small>
          </li>`;
      }).join('');
    },
    // event onsubmit
    onSubmit: (matches, input) => {
      console.table('static-file-data', input, matches);

      const { name, status, img } = matches;

      const template = `
        <p>name - ${name}</p>
        <p>status - ${status}</p>
        <div class="image"><img src="${img}"></div>`;

      const info = document.querySelector('.info-d');
      info.classList.add('active-data');
      info.innerHTML = template;

      // console.log('static: ', matches, input);
      // window.open(`https://www.imdb.com/find?q=${encodeURI(input)}`)
    },

    // get index and data from li element after
    // hovering over li with the mouse or using
    // arrow keys  ↓ | ↑
    onSelectedItem: (index, matches) => {
      console.log('onSelectedItem:', index, matches);
    },

  });


  // Group
  new Autocomplete('group', {
    clearButton: true,
    howManyCharacters: 1,

    // enter a class name, this class will
    // be added to the group name elements
    classGroup: 'group-by',

    onSearch: (input) => {
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
                return element.name.match(new RegExp(input, 'gi'))
              })
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },
    onResults: (matches, input, className) => {

      // counting status elements
      function count(status) {
        let count = {};
        matches.map(el => {
          count[el.status] = (count[el.status] || 0) + 1;
        });
        return `<small>${count[status]} items</small>`;
      }

      return matches === 0 ? input : matches
        .map((el, index, array) => {

          // we create an element of the group
          let group = el.status !== array[index - 1]?.status
            ? `<li class="${className}">${el.status} ${count(el.status)}</li>`
            : '';

          return `
            ${group}
            <li class="loupe">
              <p>${el.name.replace(new RegExp(input, 'gi'), (str) => `<b>${str}</b>`)}</p>
            </li>`;
        }).join('');
    },
    onSubmit: (matches, input) => {
      console.log(`You selected ${input}`);
    },
    onSelectedItem: (index, matches) => {
      console.log('onSelectedItem:', index, matches);
    },
    noResults: (input, resultRender) => resultRender(`<li>No results found: "${input}"</li>`),
  });


  // local data
  new Autocomplete('local', {
    howManyCharacters: 1,

    onSearch: (input) => {

      // local data
      const data = [
        { "name": "Walter White" },
        { "name": "Jesse Pinkman" },
        { "name": "Skyler White" },
        { "name": "Walter White Jr." }
      ];
      return data.sort((a, b) => a.name.localeCompare(b.name))
        .filter(element => {
          return element.name.match(new RegExp(input, 'i'))
        })
    },
    onResults: (matches) => {
      return matches
        .map((el) => {
          return `
        <li>${el.name}</li>`;
        }).join('');
    }
  });

});