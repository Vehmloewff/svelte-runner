export * from './types'
export * from './dev'
export * from './prod'

// import { rollup } from 'rollup'
// import commonjs from '@rollup/plugin-commonjs'
// import resolve from '@rollup/plugin-node-resolve'
// import sveltePreprocess from 'svelte-preprocess'

// // @ts-ignore
// import svelte from 'rollup-plugin-svelte'

// export async function build(params: BuildParams = {}) {
// 	let css = ``
// 	let cssMap = ``

// 	const entryFile = params.entryFile || 'App.svelte'

// 	const bundle = await rollup({
// 		input: entryFile,
// 		plugins: [
// 			resolve(),
// 			commonjs(),
// 			svelte({
// 				css: cssObj => {
// 					css = cssObj.code
// 					cssMap = JSON.stringify(cssObj.map)
// 				},
// 				preprocess: sveltePreprocess(),
// 			}),
// 		],
// 	})

// 	const { output } = await bundle.generate({ format: 'iife', sourcemap: true })
// 	let main = output[0]

// 	if (entryFile.slice(-7) === '.svelte') {
// 		main.code = `var SvelteRootComponent = ${main.code};;new SvelteRootComponent({ target: document.body })`
// 	}

// 	return {
// 		jsCode: { 'sr-generated-main.js': main.code, 'sr-generated-main.js.map': main.map },
// 		css: { 'sr-generated-main.css': css, 'sr-generated-main.css.map': cssMap },
// 		html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${
// 			params.title || 'Svelte App'
// 		}</title><link rel="stylesheet" href="/sr-generated-main.css"><script defer src="/sr-generated-main.js"></script></head><body></body></html>`,
// 	}
// }

// function writeStatic() {}

// export async function prod() {}

// export async function dev() {
// 	const pkgManifest = {}

// 	console.warn(`Not supported at the moment.  For now, use 'build' instead.`)
// }
