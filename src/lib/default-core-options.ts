import { template } from '@babel/core'
import { CoreOptions } from '../types'

export const defaultCoreOptions: CoreOptions = {
	title: 'Svelte App',
	entryFile: 'App.svelte',
	additionalScripts: [],
	additionalStylesheets: [],
	headers: ``,
	host: 'localhost',
	icon: null,
	open: false,
	port: 3000,
	realFavicon: null,
	staticMap: {
		'/**': {
			serve: 'template',
		},
	},
	template: null,
	deno: false,
	denoImportMap: './import-map.json',
	nodeModulesPath: './node_modules',
	banner: async () => ``,
	footer: async () => ``,
}
