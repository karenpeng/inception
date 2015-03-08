var falafel = require('falafel')
var inspect = require('object-inspect')

module.exports = function (src) {
  var id = 0
  var nodes = {}
  var _obj = require('./dataStructure.js')

  var out = falafel(src, function (node) {
    if (node.type === 'FunctionDeclaration') {
      _obj.functionName = node.id.name
      _obj.paramNumber = node.params.length
    }

    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      //console.log('!!! ' + node.source());
      //node.body.update('{' + '_enter(' + id + ', arguments ,"' + node.source() + '");' + node.body.body
      node.body.update('{' + '_enter(' + id + ',arguments);' + node.body.body
        .map(function (x) {
          return x.source()
        })
        .join(';\n')
        // + '_exit(' + id + ',null,"' + node.source() + '");' + '}'
        + '_exit(' + id + ');' + '}'
      )
      nodes[id] = node
      id++
    } else if (node.type === 'ReturnStatement') {
      //console.log('??? ' + node.source());
      node.argument.update(
        '_exit(' + id + ',' + node.argument.source() + ', "' + node.source() + '")'
      );
      nodes[id] = node
      id++
    }
  }).toString()

  // var gen = fib(10);
  var stack = []
  var generatorFunction = function* () {}
  var GeneratorFunction = generatorFunction.constructor
  var plus = new GeneratorFunction((['_exit', '_enter'], out)(exit, enter))

  // var gen = plus(1, 2)
  // gen.next()

  function exit(id, value, source) {
    //return (yield* fibonacci(n -1)) + (yield* fibonacci(n-2))
    stack.pop()
    var indent = Array(stack.length + 1).join(' ')
    return value
  }

  function enter(id, args, source) {
    //yield {args: n}
    var indent = Array(stack.length + 1).join(' ')
    args = [].slice.call(args).map(inspect)
    stack.push(id)
  }
}

function* fibonacci(n) {
  yield {
    args: n
  }
  if (n === 0) return 0
  if (n === 1) return 1
  return (
    yield * fibonacci(n - 1)) + (
    yield * fibonacci(n - 2))
}