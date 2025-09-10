const { MongoClient } = require('mongodb');
const { db } = require('./config');

const client = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db();
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

module.exports = { connect };
