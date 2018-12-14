const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc)
  }, err => {
    res.status(400).send(err);
  })
console.log(req.body);
})

app.get('/todos', (req,res) => {
  Todo.find().then(todos => {
    res.send({todos})
  }, err => {
    res.status(400).send(err);
  })
})

app.get('/todos/:id', (req,  res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    res.status(404).send('id is not valid');
  } else {
    Todo.findById(id).then(todo => {
      if (todo) res.send({todo})
      else res.status(404).send('there is no todo with this id')
    }, err => res.status(400).send(err))
  }
})

app.listen(port, () => {
  console.log('server is running on port ',  port)
})

module.exports = { app }