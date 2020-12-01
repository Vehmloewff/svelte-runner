import commonjs from '@rollup/plugin-commonjs'
import pathUtils from 'path'
import { Plugin } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'

// @ts-ignore
import virtual from '@rollup/plugin-virtual'
// @ts-ignore
import sucrase from '@rollup/plugin-sucrase'

export const rollupPlugins = (entryFile: string, svelte: Plugin) => {
	return [
		entryFile.slice(-7) === '.svelte' &&
			virtual({
				'@Entry': `import App from "${pathUtils.relative(
					process.cwd(),
					entryFile
				)}"\nconst app = new App({ target: document.body })\nif (import.meta.hot) {
			import.meta.hot.dispose(() => {
			  app.$destroy()
			})
			import.meta.hot.accept()
		  }\nexport default app`,
			}),
		svelte,
		nodeResolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		sucrase({ transforms: ['typescript'] }),
	]
}
