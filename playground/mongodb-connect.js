const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log('unable to connect to mongodb server');
  console.log('connected to mongodb');

const db = client.db('TodoApp');

  client.close();
});
