import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import cleanup from 'rollup-plugin-cleanup';

import pkg from './package.json';

const { PRODUCTION } = process.env;
const input = 'sources/js/script.js';

export default [
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
    plugins: [babel({ babelHelpers: 'bundled' }), cleanup()],
    watch: false,
    output: {
      name: 'Autocomplete',
      format: 'iife',
      sourcemap: false,
      file: 'dist/js/autocomplete.min.js',
      plugins: [terser()],
    },
  },
  {
    input,
    plugins: [babel({ babelHelpers: 'bundled' }), cleanup()],
    output: {
      name: 'Autocomplete',
      format: 'iife',
      sourcemap: true,
      file: 'docs/js/autocomplete.min.js',
      plugins: [
        terser({
          mangle: true,
        }),
        !PRODUCTION && serve({ open: true, contentBase: ['docs'] }),
        !PRODUCTION && livereload(),
      ],
    },
  },
  {
    input,
    watch: false,
    plugins: [babel({ babelHelpers: 'bundled' }), cleanup()],
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
        sourcemap: false,
        file: 'dist/js/autocomplete.umd.min.js',
        plugins: [
          terser({
            mangle: true,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
  {
    input,
    watch: false,
    plugins: [babel({ babelHelpers: 'bundled' }), cleanup()],
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
        sourcemap: false,
        file: 'dist/js/autocomplete.esm.min.js',
        plugins: [
          terser({
            mangle: true,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
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
