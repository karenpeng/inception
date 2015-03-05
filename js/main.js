var parse = require('./parse.js');
//var incept = require('./incept.js');

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
  //console.log('behold: ' + item[Object.keys(item)])
  console.log(item.value + ' ' + item.string)
})

var control = require('./es5.js');
var func = new control(history);

window.onkeydown = function (e) {
  //enter
  if (e.which === 13) {
    e.preventDefault();
    func.next();
  }
}

// var iterator = incept(history);
// //setInterval(function () {
// function callNext() {
//     var it = iterator.next();
//     if (it.done) return;
//   }
//   //}, 1000);
// exports.callNext = callNext();
// setInterval(function () {
//   func();
// }, 1000);