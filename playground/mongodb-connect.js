const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log('unable to connect to mongodb server');
  console.log('connected to mongodb');

const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'order a bottle for water',
  //   completed: false
  // }, (err, result) => {
  //   if (err) return console.log('unable to insert to todo');
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })
  db.collection('Users').insertOne({
    name: 'Alya',
    age: 20,
    location: 'France',
    _id: 123,
  }, (err, result) => {
    if (err) return console.log('unable to insert user');
    console.log(JSON.stringify(result.ops, undefined, 2))
  })

  client.close();
});
