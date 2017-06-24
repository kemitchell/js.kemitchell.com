var assert = require('assert')
var challenges = require('./challenges')
var schema = require('./schema')
var AJV = require('ajv')

var validator = new AJV({allErrors: true})
validator.validate(schema, challenges)
if (validator.errors) {
  console.error(JSON.stringify(validator.errors, null, 2))
}
assert.deepEqual(validator.errors, null)
var codenames = []
challenges.forEach(function (challenge) {
  if (challenge.readOnly) {
    challenge.readOnly.forEach(function (line) {
      assert(
        typeof challenge.code[line] === 'string'
      )
    })
  }
  if (challenge.codenames) {
    challenge.codenames.forEach(function (codename) {
      assert.equal(
        codenames.indexOf(codename), -1,
        'codename "' + codename + '" used more than once'
      )
      codenames.push(codename)
    })
  }
})
