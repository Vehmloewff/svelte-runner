import { readFile as nodeReadFile } from 'fs'
import fetch from 'node-fetch'

async function readFile(filepath: string) {
	const read = (filepath: string) =>
		new Promise<string>((resolve, reject) => {
			nodeReadFile(filepath, 'utf-8', (err, data) => {
				if (err) reject(`Could not load file://${filepath}`)
				else resolve(data)
			})
		})

	try {
		return await read(filepath)
	} catch (_) {
		try {
			return await read(filepath + '.ts')
		} catch (_) {
			try {
				return await read(filepath + '.js')
			} catch (_) {
				throw `Could not load file://${filepath}`
			}
		}
	}
}

async function fetchFile(href: string) {
	return await fetch(href)
		.then(res => {
			if (res.ok) return res.text()
			throw `Could not load '${href}'`
		})
		.catch(err => {
			throw `Could not download '${href}': ${err}`
		})
}

export async function getDenoFile(href: string): Promise<string> {
	const url = new URL(href)

	if (url.protocol === 'file:') return await readFile(url.pathname)
	return await fetchFile(href)
}
