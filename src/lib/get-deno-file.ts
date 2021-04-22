import { readFile as nodeReadFile } from 'fs'

function readFile(filepath: string) {
	return new Promise<string>((resolve, reject) => {
		nodeReadFile(filepath, 'utf-8', (err, data) => {
			if (err) reject(`Could not load file://${filepath}`)
			else resolve(data)
		})
	})
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
