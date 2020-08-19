import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import typescript from '@wessberg/rollup-plugin-ts';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import svg from 'rollup-plugin-svg-import';
import copy from 'rollup-plugin-copy';

const svelteOptions = require('./svelte.config');

const production = !process.env.ROLLUP_WATCH;

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === 'CIRCULAR_DEPENDENCY' &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      copy({
        targets: [
          {
            src: 'node_modules/avrgirl-arduino/dist/avrgirl-arduino.global.js',
            dest: 'static/',
            rename: 'avrgirl-arduino.js',
          },
        ],
      }),
      svg({
        // process SVG to DOM Node or String. Default: false
        stringify: true,
      }),
      svelte({
        ...svelteOptions,
        dev,
        hydratable: true,
        emitCss: true,
      }),
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript(),

      legacy &&
        babel({
          extensions: ['.js', '.mjs', '.html', '.svelte'],
          runtimeHelpers: true,
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead',
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      svg({
        // process SVG to DOM Node or String. Default: false
        stringify: true,
      }),
      svelte({
        ...svelteOptions,
        generate: 'ssr',
        dev,
      }),
      resolve(),
      commonjs(),
      typescript(),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules ||
        Object.keys(process.binding('natives'))
    ),

    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      commonjs(),
      !dev && terser(),
    ],

    onwarn,
  },
};
