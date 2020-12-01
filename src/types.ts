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
