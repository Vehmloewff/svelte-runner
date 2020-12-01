const { readFileSync, writeFileSync } = require('fs')

let cliBuild = readFileSync('dist/cli.js', 'utf-8')
let libBuild = readFileSync('dist/index.js', 'utf-8')

// Fix: Error: Cannot find module 'fsevents'
const fsEventsOnMacOnly = str => str.replace("require('fsevents')", "process.platform === 'darwin' ? require('fsevents') : undefined")
cliBuild = fsEventsOnMacOnly(cliBuild)
libBuild = fsEventsOnMacOnly(libBuild)

// Add a shebang above the cli file
cliBuild = '#!/usr/bin/env node\n' + cliBuild

writeFileSync('dist/cli.js', cliBuild)
writeFileSync('dist/index.js', libBuild)
