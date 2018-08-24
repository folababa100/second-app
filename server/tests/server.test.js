const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb')

const {app} = require('./../server');
const {Product} = require('./../models/product');
const {User} = require('./../models/user');
const {users, products, populateProducts, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateProducts);

describe('POST/ products', () => {
  it('should create a new todo', (done) => {
    var name = 'Test todo text';
    var body = 'Test product body to make sure it is correct';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({name, body})
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(name);
        expect(res.body.body).toBe(body)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Product.find({body, name}).then((products) => {
          expect(products.length).toBe(1);
          expect(products[0].body).toBe(body);
          expect(products[0].name).toBe(name);
          done();
        }).catch((e) => done(e));
      });
  });

})
