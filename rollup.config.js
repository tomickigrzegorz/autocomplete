import copy from 'rollup-plugin-copy';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const { PRODUCTION } = process.env;

export default {
  input: 'sources/js/script.js',
  output: {
    file: pkg.main,
    format: 'iife',
    name: 'Autosuggest',
    sourcemap: !PRODUCTION,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    terser(),
    copy({
      targets: [
        { src: './static/characters.json', dest: 'docs/' },
        { src: './static/github-corner.js', dest: 'docs/' },
      ],
    }),
    !PRODUCTION && serve({ open: true, contentBase: 'docs' }),
    !PRODUCTION && livereload(),
  ],
};
