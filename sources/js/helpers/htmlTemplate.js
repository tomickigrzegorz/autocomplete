const htmlTemplate = ({ match, matches, searchBy }) => {
  const regex = new RegExp(matches[0], 'i');
  return `
    <li>
      <a href="${match[searchBy]}">
        ${match[searchBy].replace(regex, (str) => `<b>${str}</b>`)}
      </a>
    </li>`;
};

export default htmlTemplate;
