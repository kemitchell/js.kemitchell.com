var assert = require('assert')
var challenges = require('./challenges')
var schema = require('./schema')
var AJV = require('ajv')

var validator = new AJV({allErrors: true})
validator.validate(schema, challenges)
assert.deepEqual(validator.errors, null)
challenges.forEach(function (challenge) {
  if (challenge.readOnly) {
    challenge.readOnly.forEach(function (line) {
      assert(
        typeof challenge.code[line] === 'string'
      )
    })
  }
})
