// function* fibonacci(n) {
//   yield {
//     args: n
//   }
//   if (n === 0) return 0
//   if (n === 1) return 1
//   return (
//     yield * fibonacci(n - 1)) + (
//     yield * fibonacci(n - 2))
// }

var falafel = require('falafel')
var inspect = require('object-inspect')

module.exports = wtf

function wtf(src) {
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
      // node.body.update('{' + '_enter(' + id + ',arguments);' + node.body.body
      //   .map(function (x) {
      //     return x.source()
      //   })
      //   .join(';\n')
      //   // + '_exit(' + id + ',null,"' + node.source() + '");' + '}'
      //   + '_exit(' + id + ');' + '}'
      // )
      node.body.update('yeild {args: ' + node.source() + '};\n' + node.body.body)
      nodes[id] = node
      id++
    } else if (node.type === 'ReturnStatement') {
      //console.log('??? ' + node.source());
      // node.argument.update(
      //   '_exit(' + id + ',' + node.argument.source() + ', "' + node.source() + '")'
      // );
      //console.log(node.source())
      node.update('return yield* ' + node.source().replace('return', ''))
      nodes[id] = node
      id++
    }
  }).toString()

  // var gen = fib(10);
  var stack = []
  var generatorFunction = function* () {}
  var GeneratorFunction = generatorFunction.constructor
  var plus = new GeneratorFunction([], out)

  // var gen = plus(1, 2)
  // gen.next()

  // function exit(id, value, source) {
  //   //return (yield* fibonacci(n -1)) + (yield* fibonacci(n-2))
  //   stack.pop()
  //   var indent = Array(stack.length + 1).join(' ')
  //   return value
  // }

  // function enter(id, args, source) {
  //   //yield {args: n}
  //   var indent = Array(stack.length + 1).join(' ')
  //   args = [].slice.call(args).map(inspect)
  //   stack.push(id)
  // }
  return plus
}

function fibonacci(num) {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

var test = wtf(fibonacci.toString())

test()