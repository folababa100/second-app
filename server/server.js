import express from 'express';
require('./config/config');
// const express = require('express');
const bodyParser = require('body-parser');
// const {authenticate} = require('./middleware/authenticate');
// const _ = require('lodash');
// const {mongoose} = require('./db/mongoose');
const { Todo } = require('./model/posts');
// const { User } = require('./model/user')

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/posts', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// app.post('/users', authenticate, (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var user = new User(body);

//   user.save().then(() => {
//     return user.generateAuthToken()
//   }).then((token) => {
//     res.header('x-auth', token).send(user);
//   }).catch((e) => {
//     res.status(400).send(e);
//   })
// })

app.listen(port, () => {
  console.log(`Server has started at ${port}`)
})
