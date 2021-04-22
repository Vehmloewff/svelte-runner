import { rollup } from 'rollup'
import { CoreOptions, ProdOptions } from './types'
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess'
import { terser } from 'rollup-plugin-terser'
import { defaultCoreOptions } from './lib/default-core-options'
import { server } from './server'
import { makeTemplate } from './lib/make-template'
import { Application, Handler } from 'express'
import { generatedLocations } from './lib/generated-locations'
import { rollupPlugins } from './lib/rollup-plugins'

// @ts-ignore
import svelte from 'rollup-plugin-svelte'

export async function prod(coreOptions: Partial<CoreOptions> = {}, prodOptions: ProdOptions = {}) {
	const options = Object.assign({}, defaultCoreOptions, coreOptions) as CoreOptions

	const { css, js, jsMap } = await getJSAndCSS(options, prodOptions)

	const { staticMap, host, template, open, port } = options

	const serveBuild = (app: Application): Handler => (req, res, next) => {
		if (req.path === generatedLocations.js) {
			res.contentType('application/js')
			res.setHeader('SourceMap', generatedLocations.jsMap)
			res.send(js)
		} else if (req.path === generatedLocations.jsMap) res.send(jsMap)
		else next()
	}

	await server({
		staticMap,
		template: template || makeTemplate(true, options),
		css,
		host,
		open,
		port,
		serveBuild,
		stylesheets: options.additionalStylesheets,
		scripts: options.additionalScripts,
	})
}

async function getJSAndCSS(options: CoreOptions, prodOptions: ProdOptions = {}) {
	let css = ``
	let cssMap = ``

	const bundle = await rollup({
		input: options.entryFile.slice(-7) === '.svelte' ? '@Entry' : options.entryFile,
		plugins: rollupPlugins({
			entryFile: options.entryFile,
			svelte: svelte({
				css: cssObj => {
					css = cssObj.code
					cssMap = JSON.stringify(cssObj.map)
				},
				preprocess: sveltePreprocess(),
			}),
			deno: options.deno,
			denoImportMap: options.denoImportMap,
			nodeModulesPath: options.nodeModulesPath,
			banner: options.banner,
			footer: options.footer,
		}).concat(prodOptions.minify && terser()),
	})

	const isSvelteEntry = options.entryFile.slice(-7) === '.svelte'

	const { output } = await bundle.generate({ format: 'iife', sourcemap: true, name: isSvelteEntry ? 'SvelteRootComponent' : 'app' })
	let main = output[0]

	if (isSvelteEntry) main.code = `${main.code};;new SvelteRootComponent({ target: document.body })`

	return {
		js: main.code,
		jsMap: main.map,
		css: () => ({ code: css, map: cssMap }),
	}
}
