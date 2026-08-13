// npm run server (in another terminal)
// node .
try {
    const response = await fetch('http://localhost:3000/users')
    if (response.ok) {
        const data = await response.json()
        console.log(data)
    } else {
        const text = await response.text()
        console.error(response.status, text)
    }
} catch (err) {
    console.error(err.message)
}

try {
    const response = await fetch('http://localhost:3000/add_user', {
        body: JSON.stringify({
            name: "Guido"
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST"
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
    } else {
        const text = await response.text()
        console.error(response.status, text)
    }
} catch (err) {
    console.error(err.message)
}
