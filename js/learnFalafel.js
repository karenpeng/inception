var falafel = require('falafel')
var inspect = require('object-inspect')

function test(src) {

  var out = falafel(src, function (node) {
    if ('FunctionDeclaration' || node.type === 'FunctionExpression') {
      console.log('1node source ' + node.source())
      console.log('1node body ' + node.body)
    } else if (node.type === 'ReturnStatement') {
      console.log('2node source ' + node.source())
      console.log('2node argument ' + node.argument)
    }
  }).toString()
  console.log(out)
}

function fibonacci(num) {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

test(fibonacci.toString())