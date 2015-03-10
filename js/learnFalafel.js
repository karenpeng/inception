var falafel = require('falafel')
var inspect = require('object-inspect')

function test(src) {
  // var _obj = {}
  var id = 0
    // var funcName, argName
  var out = falafel(src, function (node) {
    //   var id = 0;
    //   var nodes = {};
    //   var _obj = require('./dataStructure.js');
    console.log(id)
    console.log(node)
    console.log('\n')
    id++
    // if (node.type === 'ReturnStatement') {
    //   console.log(id)
    //     //console.log(node)
    //   console.log(node.source())
    //   console.log('\n')
    //   id++
    // }
    //if (node.parent && node.parent.type === 'ReturnStatement') {
    // console.log(id)
    //   //console.log(node)
    // console.log(node.source())
    // console.log('\n')
    // id++
    //node.update('yield* ')
    //}
  })
}

// function* enter(id, args, source) {
//   yield args
// }

// function* exit(id, args, source) {
//   yield 0
// }

function fibonacci(num) {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

test(test.toString())