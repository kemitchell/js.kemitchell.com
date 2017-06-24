module.exports = []

// Annoying, redundant, and necessary, so Browserify can
// detect the targets and bundle them.
add('console-log', require('./console-log'))
add('variable-basics', require('./variable-basics'))
add('string-basics', require('./string-basics'))
add('string-equality', require('./string-equality'))
add('boolean-basics', require('./boolean-basics'))
add('conditionals', require('./conditionals'))
add('boolean-expressions', require('./boolean-expressions'))
add('number-basics', require('./number-basics'))
add('arithmetic', require('./arithmetic'))
add('number-comparison', require('./number-comparison'))
add('string-indexing', require('./string-indexing'))
add('while-loops', require('./while-loops'))
add('variable-increment', require('./variable-increment'))
add('string-iteration', require('./string-iteration'))
add('array-basics', require('./array-basics'))
add('array-indexing', require('./array-indexing'))
add('array-iteration', require('./array-iteration'))
add('array-mutation', require('./array-mutation'))
add('array-non-identity', require('./array-non-identity'))
add('array-comparison', require('./array-comparison'))
add('object-basics', require('./object-basics'))
add('object-mutation', require('./object-mutation'))
add('object-iteration', require('./object-iteration'))
add('object-comparison', require('./object-comparison'))
add('nullary-procedures', require('./nullary-procedures'))
add('unary-procedures', require('./unary-procedures'))
add('n-ary-procedures', require('./n-ary-procedures'))
add('functions', require('./functions'))
add('closure-basics', require('./closure-basics'))
add('closure-with-mutation', require('./closure-with-mutation'))
add('functions-within-functions', require('./functions-within-functions'))
add('functions-taking-functions', require('./functions-taking-functions'))
add('functions-returning-functions', require('./functions-returning-functions'))
add('typeof', require('./typeof'))

function add (name, challenges) {
  if (challenges[0]) {
    if (challenges[0].codenames) {
      challenges[0].codenames.push(name)
    } else {
      challenges[0].codenames = [name]
    }
  }
  module.exports = module.exports.concat(challenges)
}
