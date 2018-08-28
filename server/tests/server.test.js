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
          expect(product).toBeFalsy()
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not remove a product', (done) => {
    var hexId = products[0]._id.toHexString();

    request(app)
      .delete(`/products/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Product.findById(hexId).then((product) => {
          expect(product).toBeTruthy();
          done()
        }).catch((e) => done(e))
      })
  })

  it('should return 404 if products not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/products/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('should return 401 if object id is invalid', (done) => {
    request(app)
      .delete('/products/123abc')
      .send('x-auth', users[1].tokens[0].token)
      .expect(401)
      .end(done)
  })
});

describe('PATCH/ products/:id', () => {
  it('should update the products', (done) => {
    const hexId = products[0]._id.toHexString();
    const name = 'Testing';

    request(app)
      .patch(`/products/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        name,
        completed: true
      })
      .expect(200)
      .expect((res) => {

        expect(res.body.product.completed).toBe(true);
        expect(res.body.product.name).toBe(name);
      })
    .end(done)
  })

  it('should not update a products created by another user', (done) => {
    const hexId = products[0]._id.toHexString()
    const name = 'Testing';

      request(app)
        .patch(`/products/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
          completed: true,
          name
        })
        .expect(404)
        .end(done)
  })

  it('should clear completedAt if products is not completed', (done) => {
    const hexId = products[1]._id.toHexString();
    const name = 'Testing';

    request(app)
      .patch(`/products/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        name
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.product.name).toBe(name)
        expect(res.body.product.completedAt).toBeFalsy();
        expect(res.body.product.completed).toBe(false)
      })
      .end(done)
  })
})

describe('GET/ users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST/ users', () => {
  it('should create a user', (done) => {
    const email = 'shaku@gmail.com';
    const password = '123abc';
    const username = 'shakushaku'

    request(app)
      .post('/users')
      .send({email, password, username})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy()
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          done()
        }).catch((e) => done(e))
      })
  })

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'hi',
        password: '12'
      })
      .expect(400)
      .end(done)
  })

  it('should create user if email is already in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        username: 'helloworld',
        password: 'wassupboy'
      })
      .expect(400)
      .end(done)
  })
})

describe('POST/ users/login', () => {
  it('should login user and return the auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy()
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens[1].token).toBe(res.headers['x-auth'])
          expect(user.tokens[1].access).toBe('auth')
          done()
        }).catch((e) => done(e));
      })
  })

  it('should not login with invalid login details', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[0].email,
        password: users[0].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy()
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(1)
          done();
        }).catch((e) => done(e))
      })
  })
})

describe('DELETE/ users/me/token', () => {
  it('should remove auth token on login', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0)
          done()
        }).catch((e) => done(e))
      })
  })
})
