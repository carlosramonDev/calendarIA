const express = require('express');
const { connect } = require('./db');
const eventsRouter = require('./routes/events');
const authRouter = require('./routes/auth');
const nlpRouter = require('./routes/nlp');
const notificationsRouter = require('./routes/notifications');

const app = express();
const port = 3001;

let db;

connect().then(database => {
  db = database;
});

app.use(express.json());
app.use('/events', eventsRouter);
app.use('/auth', authRouter);
app.use('/nlp', nlpRouter);
app.use('/notifications', notificationsRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
