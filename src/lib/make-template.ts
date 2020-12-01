import { CoreOptions } from '../types'
import { generatedLocations } from './generated-locations'

export function makeTemplate(separateStyles: boolean, coreOptions: CoreOptions) {
	const headTags = [
		`<meta charset="UTF-8">`,
		`<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
		`<title>${coreOptions.title || 'Svelte App'}</title>`,
		`<script defer src="${generatedLocations.js}"></script>`,
	]

	if (separateStyles) headTags.push(`<link rel="stylesheet" href="${generatedLocations.css}">`)

	if (coreOptions.additionalScripts)
		headTags.push(
			...coreOptions.additionalScripts.map(file => `<script defer src="${generatedLocations.additionalScript(file)}"></script>`)
		)

	if (coreOptions.headers) headTags.push(coreOptions.headers)

	return `<!DOCTYPE html><html lang="en"><head>${headTags.join('')}</head><body></body></html>`
}
