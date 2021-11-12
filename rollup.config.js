import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';

import pkg from './package.json';

const { PRODUCTION } = process.env;
const input = 'sources/js/script.js';

const plugins = () => {
  return [babel({ babelHelpers: 'bundled' }), cleanup()];
};
const terserConf = () => {
  return [
    terser({
      mangle: true,
      compress: { drop_console: true, drop_debugger: true },
    }),
  ];
};

const configs = [
  {
    input,
    plugins: [babel({ babelHelpers: 'bundled' }), cleanup()],
    watch: false,
    output: {
      name: 'Autocomplete',
      format: 'iife',
      file: pkg.main,
      sourcemap: true,
    },
  },
  {
    input,
    plugins: [plugins()],
    watch: false,
    output: {
      name: 'Autocomplete',
      format: 'iife',
      sourcemap: true,
      file: 'dist/js/autocomplete.min.js',
      plugins: [terserConf()],
    },
  },
  {
    input,
    plugins: [plugins()],
    output: {
      name: 'Autocomplete',
      format: 'iife',
      sourcemap: true,
      file: 'docs/js/autocomplete.min.js',
      plugins: [
        terserConf(),
        !PRODUCTION && serve({ open: true, contentBase: ['docs'] }),
        !PRODUCTION && livereload(),
      ],
    },
  },
  {
    input,
    watch: false,
    plugins: [plugins()],
    output: [
      {
        name: 'Autocomplete',
        format: 'umd',
        sourcemap: true,
        file: 'dist/js/autocomplete.umd.js',
      },
      {
        name: 'Autocomplete',
        format: 'umd',
        sourcemap: true,
        file: 'dist/js/autocomplete.umd.min.js',
        plugins: [terserConf()],
      },
    ],
  },
  {
    input,
    watch: false,
    plugins: [plugins()],
    output: [
      {
        name: 'Autocomplete',
        format: 'es',
        sourcemap: true,
        file: 'dist/js/autocomplete.esm.js',
      },
      {
        name: 'Autocomplete',
        format: 'es',
        sourcemap: true,
        file: 'dist/js/autocomplete.esm.min.js',
        plugins: [terserConf()],
      },
    ],
  },
  {
    input: 'sources/js/polyfill.js',
    watch: false,
    output: {
      format: 'es',
      file: 'dist/js/polyfill.js',
    },
  },
];

export default configs;
