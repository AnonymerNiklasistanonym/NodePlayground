## Info: `promisify` (Promises)

With promises async behaviour can be made without a callback hell:

```js
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
```

```ts
function readFileAsnyc(filePath): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
          return reject(err)
      }
      return resolve(data)
    })
  })
}
// option 1
readFileAsnyc('file.txt').then(console.log).catch(console.error)
// option 2
try {
    await readFileAsnyc('file.txt').then(console.log)
} catch (err) {
    console.error(err)
}
```
