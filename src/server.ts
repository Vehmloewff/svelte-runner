import { StaticMap } from './types'
import express, { Handler, Application } from 'express'
import openPath from 'open'
import { pathIsPattern } from './lib/path-is-pattern'
import { join as joinPath, resolve as makePathAbsolute } from 'path'
import { isFile } from 'path-type'
import { generatedLocations } from './lib/generated-locations'
import httpProxy from 'http-proxy'

export interface ServerParams {
	staticMap: StaticMap
	template: string
	serveBuild: (app: Application) => Handler
	port: number
	host: string
	open: boolean
	css: null | (() => { code: string; map: string })
}

export async function server({ staticMap, template, serveBuild, port, host, open, css }: ServerParams) {
	const app = express()

	app.use(serveBuild(app))

	const proxy = httpProxy.createProxyServer()

	if (css) {
		app.get(generatedLocations.css, (_, res) => {
			res.contentType('.css')
			res.send(css().code)
		})
		app.get(generatedLocations.cssMap, (_, res) => {
			res.send(css().map)
		})
	}

	app.use(async (req, res, next) => {
		const resolution = await resolveStaticMap(staticMap, req.path, req.method)

		if (!resolution) return next()

		if (resolution.file) res.sendFile(makePathAbsolute(resolution.file))
		else if (resolution.serve) {
			if (resolution.serve === 'template') {
				res.contentType('.html')
				res.send(template)
			} else {
				res.status(400)
				res.send('Invalid serve type')
			}
		} else if (resolution.proxy) {
			proxy.web(req, res, { target: `http://${resolution.proxy.host}:${resolution.proxy.port}`, ws: true })
		}
	})

	await new Promise<void>(resolve => {
		app.listen(port, host, async () => {
			const addr = `http://${host}:${port}`

			console.log(`Listening on ${addr}`)

			if (open) await openPath(addr)

			resolve()
		})
	})
}

async function resolveStaticMap(staticMap: StaticMap, path: string, method: string): Promise<Omit<StaticMap[string], 'search'> | null> {
	let patternFound: Omit<StaticMap[string], 'search'> | null = null

	for (let pattern in staticMap) {
		if (pattern.startsWith(method.toUpperCase() + ' ')) pattern = pattern.slice(method.length).trim()
		if (!pattern.startsWith('/')) continue

		const value = staticMap[pattern]

		const doesMatch = pathIsPattern(pattern, path)

		if (!doesMatch) continue

		if (!value.search) {
			patternFound = value
			break
		}

		let searchFile = path.split('/').slice(value.search.removeSegments).join('/')
		if (searchFile.startsWith('/')) searchFile = searchFile.slice(1)

		const searchPath = joinPath(value.search.folder, searchFile)

		if (await isFile(searchPath)) {
			patternFound = {
				file: searchPath,
			}
			break
		}
	}

	return patternFound
}
