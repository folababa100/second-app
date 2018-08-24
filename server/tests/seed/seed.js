const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Product} = require('./../../models/product');
const {User} = require('./../../models/user');

const userOneId = new ObjectID(); 
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  username: 'folababa0',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  username: 'Folababa1',
  email: 'jen@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const products = [{
  _id: new ObjectID(),
  name: 'First test todo',
  body: 'First test todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  name: 'Second test todo',
  body: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

const populateProducts = (done) => {
  Product.remove({}).then(() => {
    return Product.insertMany(products)
  }).then(() => done())
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {users, products, populateProducts, populateUsers}
