import { readFileSync, readFile } from 'fs'
import { URL } from 'url'
import fetch from 'node-fetch'
import { version as svelteVersion } from 'svelte/package.json'
import pathUtils from 'path'
import { Plugin } from 'rollup'
import { ImportMap, resolve } from './import-map'

export function denoPlugin(importMapLocation: string): Plugin {
	const importMap = getImportMap(importMapLocation)

	return {
		name: 'deno-module-resolution',
		resolveId(specifier, importer) {
			let isEntry = false

			if (!importer) {
				importer = `file://${process.cwd()}/@Entry`
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
				const path = pathUtils.normalize(pathUtils.join(pathUtils.dirname(urlBreakdown.pathname), specifier))

				if (urlBreakdown.protocol === 'file:') return path
				return `${urlBreakdown.protocol}//${path}`
			}

			this.error(`Could not resolve '${specifier}'`)
		},
		async load(id) {
			if (id.startsWith('https://') || id.startsWith('http://'))
				return await fetch(id)
					.then(res => {
						if (res.ok) return res.text()
						this.error(`Could not load '${id}'`)
					})
					.catch(err => {
						this.error(`Could not download '${id}': ${err}`)
					})

			return await new Promise(resolve => {
				readFile(id, 'utf-8', (err, data) => {
					if (err) this.error(`Could not load file://${id}`)
					else resolve(data)
				})
			})
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
