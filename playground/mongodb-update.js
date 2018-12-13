const { MongoClient, ObjectID } = require('mongodb');

const obj = new ObjectID();
console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log('unable to connect to mongodb server');
  console.log('connected to mongodb');

  const db = client.db('TodoApp');

//   db.collection('Todos').findOneAndUpdate({
//     _id: new ObjectID("5c125b2eae83d25778ec9cd5"), 
//   }, {
//     $set: {
//       completed: true
//     }
//   }, {
//     returnOriginal: false
//   }).then((result) => {
//     console.log('result: ', result);
//   }, err => {
// console.log('error: ', err)
//   });

  db.collection('Users').findOneAndUpdate({
    _id: 123, 
  }, {
    $set: {
      name: 'Sasha',
    },
    $inc: {
      age: 1,
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log('result: ', result);
  }, err => {
console.log('error: ', err)
  });

  //client.close();
});
