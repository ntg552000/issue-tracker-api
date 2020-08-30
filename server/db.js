require('dotenv').config();

const { MongoClient } = require('mongodb');

let db;
async function connectToDb() {
  const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  console.log(`Connected to MongoDB ${url}`);
  db = client.db();
}
function getDb() {
  return db;
}

async function getNextSequence(name) {
  const result = await db
    .collection('counter')
    .findOneAndUpdate(
      { _id: name },
      { $inc: { current: 1 } },
      { returnOriginal: false },
    );
  return result.value.current;
}

module.exports = { getDb, connectToDb, getNextSequence };
