import pathUtils from 'path'

export interface ImportMap {
	imports: Record<string, string>
	scopes: Record<string, string>
}

export interface ResolveParams {
	importMap: ImportMap
	specifier: string
	importMapLocation: string
}

export function resolve(params: ResolveParams): string | null {
	for (const testSpecifier in params.importMap.imports) {
		const resultSpecifier = params.importMap.imports[testSpecifier as keyof typeof params.importMap.imports]

		// exact match case
		if (testSpecifier === params.specifier) return mergeResult(params.importMapLocation, resultSpecifier)

		// partial match
		if (testSpecifier.endsWith('/')) {
			if (params.specifier.slice(0, testSpecifier.length) === testSpecifier)
				return mergeResult(params.importMapLocation, params.specifier.slice(testSpecifier.length))
		}
	}

	return null
}

function mergeResult(importMapLocation: string, resultSpecifier: string) {
	if (!importMapLocation.startsWith('file://') && !pathUtils.isAbsolute(importMapLocation)) {
		importMapLocation = pathUtils.resolve(importMapLocation)
	}

	if (importMapLocation.startsWith('file://')) importMapLocation = importMapLocation.slice('file://'.length)

	if (resultSpecifier.startsWith('../') || resultSpecifier.startsWith('./'))
		return `file://${pathUtils.normalize(pathUtils.join(pathUtils.dirname(importMapLocation), resultSpecifier))}`

	if (resultSpecifier.startsWith('/')) return `file://${resultSpecifier}`
	return resultSpecifier
}
