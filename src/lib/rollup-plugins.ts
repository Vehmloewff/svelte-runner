import commonjs from '@rollup/plugin-commonjs'
import pathUtils from 'path'
import { Plugin } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'

// @ts-ignore
import virtual from '@rollup/plugin-virtual'
// @ts-ignore
import sucrase from '@rollup/plugin-sucrase'

export interface RollupPluginsParams {
	entryFile: string
	svelte: Plugin
	nodeModulesPath: string
	banner: () => Promise<string>
	footer: () => Promise<string>
}

export const rollupPlugins = ({ entryFile, svelte, nodeModulesPath, banner, footer }: RollupPluginsParams) => {
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
			customResolveOptions: {
				moduleDirectory: nodeModulesPath,
			},
		}),
		commonjs(),
		sucrase({ transforms: ['typescript'] }),
		{
			name: 'svelte-runner:add-banner-and-footer',
			banner,
			footer,
		},
	]
}
