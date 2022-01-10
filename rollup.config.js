import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import cleanup from "rollup-plugin-cleanup";

import pkg from "./package.json";

const { PRODUCTION } = process.env;
const input = "sources/js/script.js";

const targets = {
  targets: {
    browsers: ["defaults", "not IE 11", "maintained node versions"],
  },
};

const targetsIE = {
  targets: {
    browsers: [">0.2%", "not dead", "not op_mini all"],
  },
};

const pluginsConfig = (target) => [
  babel({
    babelHelpers: "bundled",
    presets: [
      [
        "@babel/preset-env",
        {
          // debug: true,
          // useBuiltIns: 'usage',
          useBuiltIns: "entry",
          corejs: 3,
          loose: true,
          ...target,
        },
      ],
    ],
    plugins: [["@babel/proposal-class-properties", { loose: true }]],
  }),
  cleanup(),
];

export default [
  // --------------------------------------------------
  // iife
  {
    input,
    plugins: pluginsConfig(targets),
    watch: false,
    output: {
      name: "Autocomplete",
      format: "iife",
      file: pkg.main,
      sourcemap: true,
    },
  },
  {
    input,
    plugins: pluginsConfig(targets),
    watch: false,
    output: {
      name: "Autocomplete",
      format: "iife",
      sourcemap: false,
      file: "dist/js/autocomplete.min.js",
      plugins: [terser()],
    },
  },
  {
    input,
    plugins: pluginsConfig(targets),
    output: {
      name: "Autocomplete",
      format: "iife",
      sourcemap: true,
      file: "docs/js/autocomplete.min.js",
      plugins: [
        terser({
          mangle: true,
        }),
        !PRODUCTION && serve({ open: true, contentBase: ["docs"] }),
        !PRODUCTION && livereload(),
      ],
    },
  },
  // --------------------------------------------------
  // umd
  {
    input,
    watch: false,
    plugins: pluginsConfig(targets),
    output: [
      {
        name: "Autocomplete",
        format: "umd",
        sourcemap: true,
        file: "dist/js/autocomplete.umd.js",
      },
      {
        name: "Autocomplete",
        format: "umd",
        sourcemap: false,
        file: "dist/js/autocomplete.umd.min.js",
        plugins: [
          terser({
            mangle: true,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
  // --------------------------------------------------
  // esm
  {
    input,
    watch: false,
    plugins: pluginsConfig(targets),
    output: [
      {
        name: "Autocomplete",
        format: "es",
        sourcemap: true,
        file: "dist/js/autocomplete.esm.js",
      },
      {
        name: "Autocomplete",
        format: "es",
        sourcemap: false,
        file: "dist/js/autocomplete.esm.min.js",
        plugins: [
          terser({
            mangle: true,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
  // --------------------------------------------------
  // ie section
  {
    input,
    plugins: pluginsConfig(targetsIE),
    watch: false,
    output: {
      name: "Autocomplete",
      format: "iife",
      sourcemap: false,
      file: "dist/js/autocomplete.ie.min.js",
      plugins: [terser()],
    },
  },
  {
    input: "sources/js/polyfill.js",
    watch: false,
    output: {
      format: "es",
      file: "dist/js/polyfill.js",
    },
  },
];
