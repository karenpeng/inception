var parse = require('./parse.js');
var incept = require('./incept.js');

require('./editor.js').init();

function fibonacci(num) {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

var call = 'fibonacci(3)';

var test = fibonacci.toString().concat(call);
var history = parse(test).history;

//console.log(history)

history.forEach(function (item) {
  console.log(item)
})

var iterator = incept(history);
setInterval(function () {
  var it = iterator.next();
  if (it.done) return;
}, 1000);