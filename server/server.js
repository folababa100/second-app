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

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e)
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/products', (req, res) => {
  var product = new Product({
    name: req.body.name,
    body: req.body.body
  });

  product.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/products', (req, res) => {
  Product.find().then((products) => {
    res.send({products})
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/products/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Product.findById(id).then((product) => {
    if (!product) {
      return res.status(404).send()

    }
    res.send({product})
  }).catch((e) => {
    res.status(400).send(e)
  })
});


app.delete('/products/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Product.findByIdAndRemove(id).then((product) => {
    if (!product) {
      return res.status(404).send()
    }

    res.send(product)
  }).catch((e) => {
    res.status(400).send(e)
  })
});

app.patch('/products/:id', (req, res) => {
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

  Product.findByIdAndUpdate(id, {$set: body}, {$set: true}).then((product) => {
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
