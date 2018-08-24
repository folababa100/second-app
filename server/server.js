require('./config/config')
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const moment = require('moment');
// eslint-disable-next-line
const {mongoose} = require('./db/mongoose');
const { ObjectID } = require('mongodb');
const {Product} = require('./models/product');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT;

// app.use(function(req, res, next) {

// });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
})

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'username']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e)
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e)
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.post('/products', authenticate, (req, res) => {
  var product = new Product({
    name: req.body.name,
    body: req.body.body,
    _creator: req.user._id
  });

  product.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// app.get('/products', (req, res) => {
//   Product.find().then((products) => {
//     res.send({products})
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

app.get('/products', authenticate, (req, res) => {
  Product.find({
    _creator: req.user._id
  }).then((products) => {
    res.send({products})
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/products/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Product.findById({
    _id: id,
    _creator: req.user._id
  }).then((product) => {
    if (!product) {
      return res.status(404).send()

    }
    res.send({product})
  }).catch((e) => {
    res.status(400).send(e)
  })
});


app.delete('/products/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Product.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((product) => {
    if (!product) {
      return res.status(404).send()
    }

    res.send(product)
  }).catch((e) => {
    res.status(400).send(e)
  })
});

app.patch('/products/:id', authenticate, (req, res) => {
  var id = req.params.id;

  var body = _.pick(req.body, ['name', 'body', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = moment().valueOf();
  } else {
    body.completed = false;
  }

  Product.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {$set: true}).then((product) => {
    if (!product) {
      return res.status(404).send()
    }

    res.send({product})
  }).catch((e) => {
    res.status(400).send(e)
  })

})

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});

module.exports = {app}
