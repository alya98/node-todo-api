const {ObjectID} = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user')

const id = '5c139bf2ae83d25778ec9d0c';

// if(ObjectID.isValid(id)) {
//   console.log('id is not valid')
// }

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log('Todos', todos)
// })

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log('Todo', todo)
// })
// Todo.findById(id).then((todo) => {
//   if(!todo) return console.log('id not found')
//   console.log('todo by id', todo)
// }).catch(err => console.log(err))

User.findById(id).then((user) => {
  if(!user) return console.log('user was not found')
  console.log('user by id', JSON.stringify(user,undefined,2))
}).catch(err => console.log(err))