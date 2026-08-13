import express from "express";

const app = express();
const users = [{
    name: "Niklas"
}, {
    name: "Alice"
}, {
    name: "Bob"
}]

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Hello World!");
})

app.get("/users", (_req, res) => {
  res.send({ users })
})

app.post("/add_user", (req, res) => {
  const name = req?.body?.name
  if (name) {
    if (users.find(a => a.name === name)) {
        return res.status(409).send("User with this name already exists")
    }
    users.push({ name })
    res.send({ users })
  } else {
    throw Error("Missing Error")
  }
})

app.use((_req, res, _next) => {
  res.status(404).send("Not Found")
})

app.use((err, _req, res, _next) => {
  if (err instanceof Error) {
    res.status(500).send(err.message)
  } else {
    res.status(500).send("Internal Error")
  }
})

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
