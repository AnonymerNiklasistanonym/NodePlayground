import fs from 'fs/promises'

//await fs.rmdir('users')
await fs.rm('users', { recursive: true, force: true })
await fs.mkdir('users/something', { recursive: true })

const user = {
  name: 'Guido',
  age: 30
}

await fs.writeFile(
  'users/user.json',
  JSON.stringify(user, null, 2)
)
await fs.writeFile('data.txt', 'Hello world!')

try {
  await fs.access('data.txt')
  console.log('File exists')
  const content = await fs.readFile('data.txt')
  console.log(`File content: ${content}`)
} catch {
  console.log('File does not exist')
}

const stat = await fs.stat('users')
console.log(`users isFile: ${stat.isFile()}`)
console.log(`users isDirectory: ${stat.isDirectory()}`)

try {
  await fs.stat('usersa')
} catch {
  console.log('usersa does not exist')
}

import { execFile } from 'child_process'
import { promisify } from 'util'

await fs.writeFile('users/input.md', '# README\n\nNothing yet')
const execFileAsync = promisify(execFile)
const pandoc = 'pandoc'
const pandocArguments = [
  'input.md',
  '-o',
  'output.pdf'
]
console.log("run", pandoc, pandocArguments)
const { stdout, stderr } = await execFileAsync(pandoc, pandocArguments, {
    cwd: 'users'
})
console.log(stdout)
console.error(stderr)
