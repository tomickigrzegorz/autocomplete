const htmlTemplate = ({ match, matches, listItem }) => {
  const regex = new RegExp(matches[0], 'i');
  return `
    <li class='${listItem}'>
      <a href="${match.name}">
        ${match.name.replace(regex, str => `<b>${str}</b>`)}
      </a>
    </li>`;
};

export { htmlTemplate };
