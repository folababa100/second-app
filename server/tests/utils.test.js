const utils = require('../playground/utils');
const expect = require('expect');

it('it should add two numbers', () => {
  var res = utils.add(33, 11)

  expect(res).toBe(44)
  expect(typeof res).toBe('number')
})
