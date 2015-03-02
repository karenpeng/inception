var parse = require('./parse.js');
var incept = require('./incept.js');

function fibonacci(num) {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

var call = 'fibonacci(2)';

var test = fibonacci.toString().concat(call);
var history = parse(test).history;

//console.log(history)

// var iterator = incept(history);
// iterator.next();
history.forEach(function (item) {
  console.log(item)
})