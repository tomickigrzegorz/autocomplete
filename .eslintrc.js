module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  plugins: ['html'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    babelOptions: {
      configFile: './babelrc',
    },
  },
  rules: {
    'linebreak-style': ['error', 'windows'],
    'class-methods-use-this': 'off',
    quotes: ['error', 'single'],
    'no-param-reassign': [
      2,
      {
        props: false,
      },
    ],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
  },
  parser: 'babel-eslint',
};
