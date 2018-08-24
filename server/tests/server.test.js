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
  it('should create a new product', (done) => {
    var name = 'Test Product text';
    var body = 'Test product body to make sure it is correct';

    request(app)
      .post('/products')
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

  it('should not create product with invalid body data', (done) => {
    request(app)
      .post('/products')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Product.find().then((products) => {
          expect(products.length).toBe(2);
          done()
        }).catch((e) => done(e))
      })
  })

  it('should not create product with incomplete body data', (done) => {
    var name = 'Folarin'

    request(app)
      .post('/products')
      .set('x-auth', users[0].tokens[0].token)
      .send({name})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Product.find().then((products) => {
          expect(products.length).toBe(2);
          done()
        }).catch((e) => done(e))
      })
  })

})

describe('GET/ products', () => {
  it('should get all products', (done) => {
    request(app)
      .get('/products')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.products.length).toBe(1)
      })
      .end(done)
  })
})


describe('GET/ products/:id', () => {
  it('should return products doc', (done) => {
    request(app)
      .get(`/products/${products[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.product.name).toBe(products[0].name)
        expect(res.body.product.body).toBe(products[0].body)
      })
      .end(done)
  })

  it('should not create product doc created by another user', (done) => {
    request(app)
    .get(`/products/${products[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end(done)
  });

  it('should return a 404 if product not found', (done) => {
    const hexId = new ObjectID().toHexString()

    request(app)
      .get(`/products/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get(`/products/123abc`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
})

describe('DELETE /products/:id', () => {
  it('should remove a product', (done) => {
    var hexId = products[1]._id.toHexString();

    request(app)
      .delete(`/products/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.product._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Product.findById(hexId).then((product) => {
          expect(product).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });
});
