import { makeTemplate } from './lib/make-template'
import { server } from './server'
import { CoreOptions, DevOptions } from './types'
import { RollupOptions } from 'rollup'
import svelte from 'rollup-plugin-svelte-hot'
import sveltePreprocess from 'svelte-preprocess'
import { defaultCoreOptions } from './lib/default-core-options'
import { generatedLocations } from './lib/generated-locations'

// @ts-ignore
import makeNollupMiddleware from 'nollup/lib/dev-middleware'
import { rollupPlugins } from './lib/rollup-plugins'

export async function dev(coreOptions: Partial<CoreOptions> = {}, devOptions: DevOptions = {}) {
	const options = Object.assign({}, defaultCoreOptions, coreOptions) as CoreOptions

	const hmrOptions: any = {
		optimistic: true,
		noPreserveState: false,
		compatNollup: true, // Bug in plugin.  Option is called `nollup` in the docs
	}

	let cssMap = ``
	let cssCode = ``

	const config: RollupOptions = {
		input: '@Entry',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: generatedLocations.js,
		},

		plugins: rollupPlugins({
			entryFile: options.entryFile,
			svelte: svelte({
				// @ts-ignore
				dev: true,
				hot: devOptions.disableHMR ? false : hmrOptions,
				css: devOptions.disableHMR
					? css => {
							cssCode = css.code + `\n\n//# sourceMappingUrl=${generatedLocations.cssMap}`
							cssMap = JSON.stringify(css.map)
					  }
					: false,
				preprocess: sveltePreprocess(),
			}),
			nodeModulesPath: options.nodeModulesPath,
			banner: options.banner,
			footer: options.footer,
		}),
		watch: {
			clearScreen: false,
		},
	}

	await server({
		staticMap: options.staticMap,
		host: options.host,
		open: options.open,
		port: options.port,
		template: makeTemplate(!!devOptions.disableHMR, options),
		css: devOptions.disableHMR ? () => ({ code: cssCode, map: cssMap }) : null,
		serveBuild(app) {
			return makeNollupMiddleware(app, config, {
				hot: devOptions.disableHMR ? false : true,
			})
		},
		stylesheets: options.additionalStylesheets,
		scripts: options.additionalScripts,
	})
}
