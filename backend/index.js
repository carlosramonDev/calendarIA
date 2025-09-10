const express = require('express');
const { connect } = require('./db');
const app = express();
const port = 3001;

let db;

connect().then(database => {
  db = database;
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
