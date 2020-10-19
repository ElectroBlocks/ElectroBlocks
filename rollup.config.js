import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import svg from "rollup-plugin-svg-import";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	(warning.code === 'THIS_IS_UNDEFINED') ||
	onwarn(warning);

export default {
	client: {
		input: config.client.input().replace(/.js$/, '.ts'),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
			    'process.bucket_name': 'electroblocks-lesson-test'
			}),
			svelte({
				dev,
				hydratable: true,
				preprocess: sveltePreprocess(),
				emitCss: true
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			copy({
        targets: [
          {
            src: "node_modules/avrgirl-arduino/dist/avrgirl-arduino.global.js",
            dest: "static/",
            rename: "avrgirl-arduino.js",
			},
			{
            src: "node_modules/ng-tutorial-web-component/public/build/ng-tutorial-component.js",
            dest: "static/",
            rename: "ng-tutorial-web-component.js",
          },
        ],
      }),
      json(),
      svg({
        // process SVG to DOM Node or String. Default: false
        stringify: true,
      }),
			commonjs(),
			typescript({ sourceMap: dev }),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input: { server: config.server.input().server.replace(/.js$/, ".ts") },
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.bucket_name': 'electroblocks-lesson-test'
			}),
			svelte({
				generate: 'ssr',
				hydratable: true,
				preprocess: sveltePreprocess(),
				dev
			}),
			      svg({
        // process SVG to DOM Node or String. Default: false
        stringify: true,
      }),
      json(),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs(),
			typescript({ sourceMap: dev })
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),

		preserveEntrySignatures: 'strict',
		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input().replace(/.js$/, '.ts'),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			typescript({ sourceMap: dev }),
			!dev && terser()
		],

		preserveEntrySignatures: false,
		onwarn,
	}
};