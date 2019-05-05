const htmlTemplate = ({ match, matches, listItem, searchBy }) => {
  const regex = new RegExp(matches[0], 'i');
  return `
    <li class='${listItem}'>
      <a href="${match[searchBy]}">
        ${match[searchBy].replace(regex, str => `<b>${str}</b>`)}
      </a>
    </li>`;
};

export { htmlTemplate };
