import { CoreOptions } from '../types'
import { generatedLocations } from './generated-locations'

export function makeTemplate(separateStyles: boolean, coreOptions: CoreOptions) {
	const headTags = [
		`<meta charset="UTF-8">`,
		`<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
		`<title>${coreOptions.title || 'Svelte App'}</title>`,
	]

	if (separateStyles) headTags.push(`<link rel="stylesheet" href="${generatedLocations.css}">`)

	headTags.push(...coreOptions.additionalScripts.map(file => `<script defer src="${generatedLocations.encodePath(file)}"></script>`))
	headTags.push(...coreOptions.additionalStylesheets.map(file => `<link rel="stylesheet" href="${generatedLocations.encodePath(file)}">`))

	headTags.push(`<script defer src="${generatedLocations.js}"></script>`)

	if (coreOptions.headers) headTags.push(coreOptions.headers)

	return `<!DOCTYPE html><html lang="en"><head>${headTags.join('')}</head><body></body></html>`
}
