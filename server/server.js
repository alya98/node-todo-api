require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate')

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user.id
  });
  todo.save().then((doc) => {
    res.send(doc)
  }, err => {
    res.status(400).send(err);
  })
console.log(req.body);
})

app.get('/todos', authenticate, (req,res) => {
  Todo.find({_creator: req.user._id}).then(todos => {
    res.send({todos})
  }, err => {
    res.status(400).send(err);
  })
})

app.get('/todos/:id', authenticate, (req,  res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    res.status(404).send('id is not valid');
  } else {
    Todo.findOne({_id: id, _creator: req.user._id}).then(todo => {
      if (todo) res.send({todo})
      else res.status(404).send('there is no todo with this id')
    }, err => res.status(400).send(err))
  }
})

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  if(!ObjectID.isValid(id)) {
    res.status(404).send('id is not valid');
  }
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then(todo => {
    if (!todo) res.status(404).send();
    res.send({todo})
  }).catch(e => res.status(400).send());
});

app.post('/users', (req, res) => {
  const user =  new User(_.pick(req.body, ['email', 'password']));

  user.save().then( () => {
    return user.generateAuthToken()
  }, err => {
    res.status(400).send(err);
  }).then(token => res.header('x-auth', token).send(user))
console.log(req.body);
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
});

app.post('/users/login', (req, res) => {
  User.findByCredentials(req.body.email, req.body.password).then(user => {
    return user.generateAuthToken().then(token => {
      res.header('x-auth', token).send(user);
    })
  }).catch(e => res.status(400).send())
})

app.delete('/users/me/token', authenticate, (req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
})

app.listen(port, () => {
  console.log('server is running on port ',  port)
})

module.exports = { app }