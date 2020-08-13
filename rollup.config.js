import copy from 'rollup-plugin-copy';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const { PRODUCTION } = process.env;

export default {
  input: 'sources/js/script.js',
  output: {
    file: 'docs/autosuggest.min.js',
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
        { src: './static/users.json', dest: 'docs/' },
      ],
    }),
    (!PRODUCTION && serve({ open: true, contentBase: ['docs', 'sources'] })),
    (!PRODUCTION && livereload()),
  ],
};
