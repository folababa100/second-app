const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Product} = require('./../../models/product');
const {User} = require('./../../models/user');

const userOneId = ObjectID(); 
const userTwoId = ObjectID();

const users = [{
  _id: userOneId,
  email: "dekunbifola1@gmail.com",
  username: "folababa1",
  password: "UserOnePass",
  tokens: [{
    access: "auth",
    token: jwt.sign({id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: "dekunbifola2@gmail.com",
  username: "folababa2",
  password: "UserTwoPass",
  tokens: [{
    access: "auth",
    token: jwt.sign({id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const products = [{
  _id: new ObjectID(),
  name: 'First user',
  body: 'First user body',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  name: 'Second user',
  body: 'Second user body',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}]

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
