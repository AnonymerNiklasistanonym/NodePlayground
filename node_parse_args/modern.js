// node modern.js --verbose --name "Niklas" x
// { name: 'Niklas', verbose: true, additionalArguments: [ 'x' ] }
// node modern.js --verbose --name "Niklas" x -h
// -> help
// node modern.js --verbose --nae "Niklas" x
// -> error & help

import { parseArgs } from 'node:util';

const help = `
Usage:
  myapp [options] [positionals]

Options:
  -n, --name <name>   Name to use
  -v, --verbose       Enable verbose output
  -h, --help          Show this help
`

let args
try {
  args = parseArgs({
    strict: true,
    options: {
      name: { type: 'string', short: 'n' },
      verbose: { type: 'boolean', short: 'v' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
  })
} catch(e) {
  console.error(e.message)
  console.log(help)
  process.exit(-1)
}
const { values: options, positionals } = args

if (options.help) {
  console.log(help)
  process.exit(0)
} else {
  console.log("options", options)
  console.log("positionals", positionals)
}
