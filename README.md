# Svelte Runner

Run svelte components. Zero configuration necessary.

## Quick start

```
yarn global add svelte-runner
svelte-runner dev
```

Bundles `App.svelte` and all it's dependencies. It then serves up the bundled code on port `3000`, using HMR to instantly update the app when the source code is updated.

Want more customization than that? Don't worry, check out the docs down below. Customization is by no means overlooked.

## Why?

There's more than one reason...

I love things to be simple and efficient. Why not accomplish the work that is generally done by multiple configuration files in one cli command? It's also a lot easier to update one dependency, than to have to continually track `nollup`, `rollup`, `typescript`, `svelte`, `svelte-hmr`, etc., while always having to worry about their compatibility to each other.

It works well with deno projects.

## CLI Usage

```
Usage: svelte-runner [options] [command]

Options:
  -V, --version                 output the version number
  -e, --entry-file <file>       Initial file.  Code should be svelte, js, or ts (default: "App.svelte")
  -i, --icon <imageFile>        Path to the favicon
  -t, --title <string>          Title of the app
  -o, --open                    Open the app in default browser
  -p, --port <number>           Port to start the app on (default: "3000")
  --host <host>                 Host to bind to (default: "localhost")
  --real-favicon <fileOrJSON>   Json options for real-favicon
  --headers <fileOrTags>        Extra tags to be inserted into the <head> of the template
  --template <stringOrFile>     Custom template (index.html)
  --static-map <fileOrJSON>     Static map.  https://github.com/Vehmloewff/svelte-runner#static-map
  --deno                        Support the deno module resolution strategy
  --deno-import-map <filepath>  Import map for resolving deno modules.  Only valid if --deno is passed. (default: "./import-map.json")
  -n, --node-modules-path       Path to the location where the node_modules are installed.  Invalid if --deno is passed.
  --banner <codeOrFile>         Code to be inserted into the bundle before the svelte code
  --footer <codeOrFile>         Code to be inserted into the bundle after the svelte code
  -c, --css <file>              Additional stylesheet to be added to the head.  Can be supplied more than once.
  --add-script <file>           Path to an additional js file to be inserted into the app's head
  -h, --help                    display help for command

Commands:
  dev [options]                 Serves the app in a development environment
  prod [options]                Serves up the app in a production environment
  help [command]                display help for command
```

## Programmatic Usage

```sh
yarn add svelte-runner -D
```

```ts
import { dev, prod } from 'svelte-runner'

await dev(coreOptions, devOptions)
// or
await prod(coreOptions, prodOptions)
```

For more information on what the options are, check out [`src/types.ts`](src/types.ts).

## Static Map

Static maps tell `svelte-runner` how to serve up static content.

```json
{
	"/api/**": {
		"proxy": {
			"host": "localhost",
			"port": "8080"
		}
	},
	"/**": {
		"searchIn": "assets"
	},
	"GET /**": {
		"serve": "template"
	}
}
```

When a request comes in, `svelte-runner` will follow these steps:

-   If the path matches `/_sr-gen/main.js`, the compiled and bundled svelte code will be served. Otherwise
-   If the path matches `/_sr-gen/main.css`, the bundled css code will be served.
-   If the path matches the first pattern, `/api/**`, the request will be relayed to `localhost:8080`.
-   If the path matches the second pattern, `/**`, ask the folder `assets` if it contains a file whose path represents the part of the path represented by the wildcard (`**`). If a matching file is not found, continue.
-   If the method of the request is `GET`, serve up the app template (`index.html`).

## Known issues

-   "Additional watch scripts" support with live reloading does not work at present.
-   Weird warning: `[Svelte HMR] Setting css option to false (set hot.noDisableCss to true to bypass)`
-   Files imported from urls are not cached after being downloaded
