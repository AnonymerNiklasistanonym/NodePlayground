import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.get("/home", (_req, res) => {
  res.send("Hello World! [HOME]");
});

app.use((_req, res, _next) => {
  res.status(404).send("Not Found");
});

export default app;
