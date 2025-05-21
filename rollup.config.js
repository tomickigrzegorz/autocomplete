import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import cleanup from "rollup-plugin-cleanup";
import copy from "rollup-plugin-copy";

import pkg from "./package.json";

const banner = `/*!\n* @name autocomplete\n* @version ${pkg.version}\n* @author ${pkg.author}\n* @link https://github.com/tomickigrzegorz/autocomplete\n* @license MIT\n*/`;

const { PRODUCTION } = process.env;
const input = "sources/js/script.js";

const targets = {
  targets: {
    browsers: ["last 2 versions", "not dead", "> 0.2%"],
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

const terserConfig = {
  mangle: {
    properties: {
      regex: /^_/,
    },
  },
};

export default [
  // --------------------------------------------------
  // iife
  {
    input,
    watch: false,
    plugins: pluginsConfig(targets),
    output: {
      banner,
      file: pkg.main,
      format: "iife",
      name: "Autocomplete",
      sourcemap: !PRODUCTION,
    },
  },
  {
    input,
    watch: false,
    plugins: pluginsConfig(targets),
    output: {
      banner,
      file: "dist/js/autocomplete.min.js",
      format: "iife",
      name: "Autocomplete",
      sourcemap: false,
      plugins: [
        terser({
          ...terserConfig,
          compress: { drop_console: true, drop_debugger: true },
        }),
      ],
    },
  },
  {
    input,
    plugins: [
      pluginsConfig(targets),
      !PRODUCTION && serve({ open: true, contentBase: ["docs"] }),
      !PRODUCTION && livereload(),
    ],
    output: {
      banner,
      file: "docs/js/autocomplete.min.js",
      format: "iife",
      name: "Autocomplete",
      sourcemap: !PRODUCTION,
      plugins: [terser({ ...terserConfig })],
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
        banner,
        file: "dist/js/autocomplete.umd.js",
        format: "umd",
        name: "Autocomplete",
        sourcemap: !PRODUCTION,
      },
      {
        banner,
        name: "Autocomplete",
        file: "dist/js/autocomplete.umd.min.js",
        format: "umd",
        sourcemap: !PRODUCTION,
        plugins: [
          terser({
            ...terserConfig,
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
    plugins: [
      ...pluginsConfig(targets),
      copy({
        targets: [
          {
            src: "sources/js/script.d.ts",
            dest: "dist/js",
            rename: "autocomplete.d.ts",
          },
        ],
        hook: "writeBundle",
        verbose: true,
      }),
    ],
    watch: false,
    output: [
      {
        banner,
        file: "dist/js/autocomplete.esm.js",
        format: "es",
        name: "Autocomplete",
        sourcemap: !PRODUCTION,
      },
      {
        banner,
        file: "dist/js/autocomplete.esm.min.js",
        format: "es",
        name: "Autocomplete",
        sourcemap: !PRODUCTION,
        plugins: [
          terser({
            ...terserConfig,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
];
