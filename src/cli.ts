import { dev, prod } from '.'
import { program } from 'commander'
import { version } from '../package.json'
import { CoreOptions, DevOptions, ProdOptions } from './types'
import * as fs from 'fs'
import { defaultCoreOptions } from './lib/default-core-options'

program.name('svelte-runner').version(version)

program.helpOption('-h, --help')

program
	.option('-e, --entry-file <file>', 'Initial file.  Code should be svelte, js, or ts', defaultCoreOptions.entryFile)
	.option('-i, --icon <imageFile>', 'Path to the favicon')
	.option('-t, --title <string>', 'Title of the app')
	.option('-o, --open', 'Open the app in default browser')
	.option('-p, --port <number>', 'Port to start the app on', String(defaultCoreOptions.port))
	.option('--host <host>', 'Host to bind to', defaultCoreOptions.host)
	.option('--real-favicon <fileOrJSON>', 'Json options for real-favicon')
	.option('--headers <fileOrTags>', 'Extra tags to be inserted into the <head> of the template')
	.option('--template <stringOrFile>', 'Custom template (index.html)')
	.option('--static-map <fileOrJSON>', 'Static map.  https://github.com/Vehmloewff/svelte-runner#static-meta')

let additionalScripts: string[] = []
let additionalWatchScripts: string[] = []

program.option('--add-script <file>', "Path to an additional js file to be inserted into the app's head", value => {
	additionalScripts.push(value)
})

let disableHMR = false

program
	.command('dev')
	.option(
		'--add-watch-script <file>',
		'Like --add-script, but the file is watched and the app is reloaded when it the script changes',
		value => {
			additionalWatchScripts.push(value)

			// All additional scripts to be watched must also be added to the template
			if (additionalScripts.indexOf(value) === -1) additionalScripts.push(value)
		}
	)
	.option('--no-hmr', 'Disables hot module replacement', () => (disableHMR = true))
	.description('Serves the app in a development environment')
	.action(async () => dev(await getCoreOptions(), await getDevOptions()))

program
	.command('prod')
	.option('--minify', 'Minify the generated code')
	.description('Serves up the app in a production environment')
	.action(async () => prod(await getCoreOptions(), await getProdOptions()))

program.parse(process.argv)

async function getCoreOptions(): Promise<Partial<CoreOptions>> {
	const res: Partial<CoreOptions> = {
		entryFile: program.entryFile,
		icon: program.icon,
		title: program.title,
		open: program.open,
		port: program.port ? Number(program.port) : undefined,
		host: program.host,
		realFavicon: program.realFavicon
			? parseJSON(await readIfFilepath(program.realFavicon), 'Could not load realFavicon meta:')
			: undefined,
		template: program.realFavicon ? await readIfFilepath(program.template) : undefined,
		staticMap: program.staticMap ? parseJSON(await readIfFilepath(program.staticMap), 'Could not load static map:') : undefined,
		additionalScripts: additionalScripts.length ? additionalScripts : undefined,
	}

	Object.keys(res).forEach(key => {
		// @ts-ignore
		if (res[key] === undefined) delete res[key]
	})

	return res
}

export async function getDevOptions(): Promise<DevOptions> {
	return {
		additionalWatchScripts,
		disableHMR,
	}
}

export async function getProdOptions(): Promise<ProdOptions> {
	return {
		minify: program.minify,
	}
}

async function readIfFilepath(maybePath: string): Promise<string> {
	if (maybePath.startsWith('{') || maybePath.startsWith('[')) return maybePath

	return await new Promise(resolve => {
		fs.readFile(maybePath, 'utf-8', (err, data) => {
			if (err) resolve(maybePath)
			else resolve(data)
		})
	})
}

function parseJSON(json: string, errorMsg: string): any {
	try {
		JSON.parse(json)
	} catch (e) {
		throw new Error(`${errorMsg}\n${e}\nJSON Dump: ${json}`)
	}
}
