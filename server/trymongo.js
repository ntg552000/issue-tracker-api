const {
  MongoClient,
} = require('mongodb');

const url = 'mongodb://localhost/issuetracker';
const client = new MongoClient(url, {
  useNewUrlParser: true,
});
client.connect((connErr, connClient) => {
  if (connErr) throw connErr;
  console.log('connected');
  const db = connClient.db();
  const employees = db.collection('employees');
  const employee = {
    id: 9,
    name: 'A. Callback',
    age: 23,
  };
  employees.insertOne(employee, (employeeErr, res) =>{
    if (!employeeErr) {
      console.log('Result of insert:\n', res.insertedId);
      employees.find({
        _id: res.insertedId,
      }).toArray((err, docs) => {
        if (err) throw err;
        console.log('Result of find:\n', docs);
      });
    }
    connClient.close();
  });
});
