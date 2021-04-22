export interface CoreOptions {
	/**
	 * Entry file.  Should be a '.svelte', '.js', or '.ts' file.
	 * @default 'App.svelte'
	 */
	entryFile: string

	/**
	 * Path to favicon
	 * @default null
	 */
	icon: string | null

	/**
	 * The initial title of the page to be rendered
	 * @default 'Svelte App'
	 */
	title: string

	/**
	 * Open the served app in default browser
	 * @default false
	 */
	open: boolean

	/**
	 * The port to serve the app on
	 * @default 3000
	 */
	port: number

	/**
	 * The host to bind to
	 * @default 'localhost'
	 */
	host: string

	/**
	 * Real favicon.  Javascript object for real-favicon options
	 * Ref: https://github.com/RealFaviconGenerator/cli-real-favicon
	 * @default null
	 */
	realFavicon: any | null

	/**
	 * Additional tags to be inserted into template's head
	 */
	headers: string

	/**
	 * Custom template (index.html)
	 * If specified, `title`, `icon`, and `additionalScripts` will not work.
	 */
	template: string | null

	/**
	 * Static map.  Controls which files are to be served over which
	 * @default { '/**': { serve: 'template' }}
	 */
	staticMap: StaticMap

	/**
	 * Path to additional JavaScript files to be included in the app
	 * @default []
	 */
	additionalScripts: string[]

	/**
	 * Path to additional stylesheets to be added to the head
	 */
	additionalStylesheets: string[]

	/**
	 * Use the deno module resolution strategy
	 *
	 * @default false
	 */
	deno: boolean

	/**
	 * The optional import map to use for deno module resolution.  Only valid if `deno` is true.
	 *
	 * @default './import-map.json'
	 */
	denoImportMap: string

	/**
	 * Where the node_modules folder is located.
	 *
	 * Only valid if `deno` is false or unspecified.
	 *
	 * @default "./node_modules"
	 */
	nodeModulesPath: string

	/**
	 * Code to be inserted into the bundle before the svelte code
	 */
	banner(): Promise<string>

	/**
	 * code to be inserted into the bundle after the svelte code
	 */
	footer(): Promise<string>
}

export interface DevOptions {
	/**
	 * Like `CoreOptions.additionalScripts`, except the scripts are watched,
	 * and the app is reloaded when they are modified.
	 */
	additionalWatchScripts?: string[]

	/**
	 * If `true`, hot module replacement will be disabled.
	 * @default false
	 */
	disableHMR?: boolean
}

export interface ProdOptions {
	/**
	 * If `true`, the generated code will be minified
	 * @default false
	 */
	minify?: boolean
}

export interface BuildOptions {
	/**
	 * If `true`, only the javascript and css bundles will be emitted.
	 * Template, favicon, etc. will all be omitted.
	 *
	 * @default false
	 */
	coreOnly?: boolean
}

export interface StaticMap {
	[path: string]: {
		file?: string
		search?: {
			folder: string
			removeSegments: number
		}
		serve?: 'template'
		proxy?: { host: string; port: string }
	}
}
