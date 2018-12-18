const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const todos = [{
  text: 'First',
  _id: new ObjectID()
},{
  text: 'Second',
  _id: new ObjectID(),
  completed: true,
  completedAt: 333,
},
];

const populateTodos = (done) => {
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todos)
  }).then(() => done());
}

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]).then(() => done())
  })
}

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'alya@list.ru',
  password: 'usersOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'qwer1234').toString()
  }],
}, {
  _id: userTwoId,
  email: 'artem@mail.ru',
  password: 'userTwoPass',
}]

module.exports = {
  todos, populateTodos, users, populateUsers,
}