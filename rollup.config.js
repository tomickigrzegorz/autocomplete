import copy from 'rollup-plugin-copy';
import babel from '@rollup/plugin-babel';
import pkg from "./package.json";
import { terser } from 'rollup-plugin-terser';

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
    }),
    terser(),
    copy({
      targets: [
        { src: './static/characters.json', dest: 'docs/' },
        { src: './static/github-corner.js', dest: 'docs/' },
      ],
    })
  ],
};