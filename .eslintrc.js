module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier", "plugin:testcafe/recommended"],
  plugins: ["prettier", "testcafe"],
  rules: {
    "prettier/prettier": "error",
    "comma-dangle": ["error", "only-multiline"],
    "linebreak-style": ["error", "windows"],
    "no-param-reassign": [2, { props: false }],
  },
  parser: "@babel/eslint-parser",
};
