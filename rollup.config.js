import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import sucrase from '@rollup/plugin-sucrase'
import json from '@rollup/plugin-json'
import command from 'rollup-plugin-command'

import pkg from './package.json'

const testing = process.env.NODE_ENV === 'test'
const watching = process.env.ROLLUP_WATCH
const plainTests = process.env.BLAND_TESTS

const plugins = [resolve(), commonjs(), json(), sucrase({ transforms: ['typescript'] })]

const watch = {}
const external = id => !id.startsWith('.') && !id.startsWith('/')
const onwarn = (warning, defaultHandler) => {
	if (warning.code === 'CIRCULAR_DEPENDENCY' || warning.code === 'EVAL') return
	if (warning.code === 'UNRESOLVED_IMPORT') {
		if (warning.source === 'fsevents') return
	}
	if (warning.code === 'SOURCEMAP_ERROR' && warning.id.endsWith('/node_modules/depd/index.js')) return
	defaultHandler(warning)
}

const build = [
	{
		input: `./src/index.ts`,
		external,
		output: [{ file: pkg.main, format: 'cjs' }],
		plugins,
		watch,
		onwarn,
	},
	{
		input: `./src/cli.ts`,
		output: [{ file: 'dist/cli.js', format: 'cjs' }],
		external,
		plugins,
		watch,
		onwarn,
	},
]

const test = {
	input: `tests/index.test.ts`,
	output: { file: pkg.main, format: 'cjs' },
	plugins: [
		...plugins,
		command(plainTests ? `` : `zip-tap-reporter ` + `node ${pkg.main}`, {
			exitOnFail: !watching,
		}),
	],
}

export default testing ? test : build
