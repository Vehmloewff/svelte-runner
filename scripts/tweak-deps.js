const { readFileSync, writeFileSync } = require('fs')

// Fix: [!] Error: Could not resolve './lib-cov/stylus' from node_modules/stylus/index.js
const stylusIndex = readFileSync('node_modules/stylus/index.js', 'utf-8')
writeFileSync('node_modules/stylus/index.js', stylusIndex.replace('lib-cov', 'lib'))
