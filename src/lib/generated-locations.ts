import pathUtils from 'path'

export const generatedLocations = {
	js: '/_sr-gen/main.js',
	jsMap: '/_sr-gen/main.js.map',
	css: '/_sr-gen/main.css',
	cssMap: '/_sr-gen/main.css.map',
	additionalScript: (path: string) => pathUtils.join('/_sr-gen', path),
}
