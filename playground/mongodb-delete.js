const { MongoClient, ObjectID } = require('mongodb');

const obj = new ObjectID();
console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log('unable to connect to mongodb server');
  console.log('connected to mongodb');

  const db = client.db('TodoApp');

  db.collection('Todos').findOneAndDelete({text: 'go for potato'}).then((result) => {
    console.log('result: ', result);
  }, err => {
console.log('error: ', err)
  });



  //client.close();
});
