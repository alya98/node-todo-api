const { MongoClient, ObjectID } = require('mongodb');

const obj = new ObjectID();
console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log('unable to connect to mongodb server');
  console.log('connected to mongodb');

  const db = client.db('TodoApp');
//   db.collection('Todos').find().count().then((count) => {
//     console.log('todos count:', count);
//   }, err => {
// console.log('error: ', err)
//   });

  db.collection('Users').find({name: 'Alya'}).toArray().then((users) => {
    console.log('users:', users);
  }, err => {
console.log('error: ', err)
  });
  //client.close();
});
