// node old.js --verbose --name "Niklas" x
// { name: 'Niklas', verbose: true, additionalArguments: [ 'x' ] }

// Remove executable and path from args
const args = process.argv.slice(2)

let name = null
let verbose = false
const additionalArguments = []

for (var i = 0; i < args.length; i++) {
  if (args[i] === "--verbose") {
    // toggle
    verbose = true
  }
  else if (args[i] === "--name" && (i + 1) < args.length) {
    // followup argument
    name = args[i + 1]
    i++
  }
  else {
    additionalArguments.push(args[i])
  }
}

console.log({
  name: name,
  verbose: verbose,
  additionalArguments
})
