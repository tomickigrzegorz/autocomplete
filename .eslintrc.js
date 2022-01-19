module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "comma-dangle": ["error", "only-multiline"],
    "linebreak-style": ["error", "windows"],
    "no-param-reassign": [2, { props: false }],
  },
  parser: "@babel/eslint-parser",
};
