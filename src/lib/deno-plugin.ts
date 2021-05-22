import { readFileSync } from 'fs'
import { URL } from 'url'
import { version as svelteVersion } from 'svelte/package.json'
import pathUtils from 'path'
import { Plugin } from 'rollup'
import { ImportMap, resolve } from './import-map'
import { getDenoFile } from './get-deno-file'

export function denoPlugin(importMapLocation: string): Plugin {
	const importMap = getImportMap(importMapLocation)

	return {
		name: 'deno-module-resolution',
		resolveId(specifier, importer) {
			let isEntry = false

			if (!importer || /virtual:@Entry/.test(importer)) {
				importer = `file://${process.cwd()}/@CliEntry`
				isEntry = true
			}

			if (specifier.startsWith('http://') || specifier.startsWith('https://')) return specifier
			if (specifier.startsWith('file://')) return specifier.slice('file://'.length)

			const fromImportMap = resolve({ importMap, importMapLocation, specifier })
			if (fromImportMap) {
				if (fromImportMap.startsWith('file://')) return fromImportMap.slice('file://'.length)
				return fromImportMap
			}

			if (pathUtils.isAbsolute(specifier)) return specifier

			if (isEntry || specifier.startsWith('./') || specifier.startsWith('../')) {
				const urlBreakdown = new URL(importer.startsWith('/') ? `file://${importer}` : importer)
				const path = pathUtils.normalize(pathUtils.join(urlBreakdown.host, pathUtils.dirname(urlBreakdown.pathname), specifier))

				if (urlBreakdown.protocol === 'file:') return path
				return `${urlBreakdown.protocol}//${path}`
			}

			this.error(`Could not resolve '${specifier}'`)
		},
		async load(id) {
			if (id.startsWith('/')) id = `file://${id}`

			return await getDenoFile(id)
		},
	}
}

const SVELTE_INTERNAL_URL = `https://cdn.jsdelivr.net/npm/svelte@${svelteVersion}/internal/index.mjs`

function getImportMap(path: string): ImportMap {
	let importMapRaw: string | null = null

	try {
		importMapRaw = readFileSync(path, 'utf-8')
	} catch (_) {}

	let parsedImportMap: ImportMap = {
		imports: { 'svelte/internal': SVELTE_INTERNAL_URL },
		scopes: {},
	}

	if (importMapRaw !== null) {
		try {
			parsedImportMap = JSON.parse(importMapRaw)
		} catch (_) {
			throw new Error(`Could not parse import map at: ${path}`)
		}
	}

	if (parsedImportMap?.imports && typeof parsedImportMap.imports['svelte/internal'] !== 'string') {
		if (!parsedImportMap.imports) parsedImportMap.imports = {}
		parsedImportMap.imports['svelte/internal'] = SVELTE_INTERNAL_URL
	}

	return parsedImportMap
}
