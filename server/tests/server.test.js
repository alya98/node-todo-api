const expect = require('expect');
const {ObjectID} = require('mongodb');
const request = require('supertest');

const { app } = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers,} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe( 'POST /todos', () => {
  it('should cteate a new todo', done => {
    const text = 'First'

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect( res => {
      expect(res.body.text).toBe(text)
    })
    .end((err, res) => {
      if(err) {
        return done(err)
      }
      Todo.find().then(todos => {
        expect(todos.length).toBe(3);
        expect(todos[0].text).toBe(text)
        done();
      }).catch(e => done(e));
    });
  });

  it('should not create todo with invalid body data', done => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err) {
        return done(err)
      }
      Todo.find().then(todos => {
        expect(todos.length).toBe(2);
        done();
      }).catch(e => done(e));
    })
  })
})

describe( 'GET /todos', () => {
  it('should return todos', done => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2)
    })
    .end(done);
  });

  it('should return todo by id', done => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done);
  });

  it('should return 404 if todo was not found', done => {
    const id = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .expect(res => expect(res.status).toBe(404))
    .end(done);
  });

  it('should return 404 for invalid ids', done => {
    const id = 123;
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .expect(res => expect(res.status).toBe(404))
    .end(done);
  });
})

describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    const id = todos[0]._id.toHexString();
    request(app)
    .patch(`/todos/${id}`)
    .send({completed: true
    })
    .expect(200)
    .expect(res => {
      expect(res.body.todo.completed).toBe(true);
      expect(typeof res.body.todo.completedAt).toBe('number');
    })
    .end(done)
  });
  it('should clear completedAt when todo is not completed', done => {
    const id = todos[0]._id.toHexString();
    request(app)
    .patch(`/todos/${id}`)
    .send({completed: false})
    .expect(200)
    .expect(res => {
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeFalsy();
    })
    .end(done)
  });
})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect(res => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done)
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect(res => {
      expect(res.body).toEqual({})
    })
    .end(done)
  }) 
})

describe('POST /users', () => {
  it('should create a user', done => {
    const email = 'example@sd.cc';
    const password = 'qweasd';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect(res => {
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end(err => {
      if(err) return done(err);

      User.findOne({email}).then(user => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      })
    })
  });

  it('should return validation errors if request invalid', done => {
    const email = 'example.cc';
    const password = 'qweasd';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done)
  });

  it('should rnot create email in use', done => {
    request(app)
    .post('/users')
    .send({email: users[0].email, password: 'sdasda'})
    .expect(400)
    .end(done)
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[1].email, password: users[1].password})
    .expect(200)
    .expect(res => {
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((err,res) => {
      if (err) return done(err);

      User.findById(users[1]._id).then(user => {
        expect(user.tokens[0]).toMatchObject({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch(err => done(err));
    });
  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[1].email, password: users[0].password})
    .expect(400)
    .expect(res => {
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end((err,res) => {
      if (err) return done(err);

      User.findById(users[1]._id).then(user => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch(err => done(err));
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should login remove auth token on log out', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect(res => {
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end((err,res) => {
      if (err) return done(err);

      User.findById(users[0]._id).then(user => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch(err => done(err));
    });
  });
});
