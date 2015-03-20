var parse = require('./parse.js');
//var incept = require('./incept.js');
var graphic = require('./graphic.js');

//require('./editor.js').init();

function fibonacci(num) {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

var call = 'fibonacci(3)';

var test = fibonacci.toString().concat(call);

var history = parse(test).history;

history.forEach(function (item) {
  console.log(item.value + ' ' + item.string)
})

var control = require('./es5.js');

window.onkeydown = function (e) {
  //space
  if (e.which === 32) {
    e.preventDefault();
    graphic.switchCamera();
  }
  //b
  if (e.which === 66) {
    e.preventDefault();
    graphic.hideTrack();
  }
  //c
  if (e.which === 67) {
    e.preventDefault();
    //reverse = !reverse;
    graphic.swtichDirection();
  }
  //d
  if (e.which === 68) {
    e.preventDefault();
    // graphic.speed = 0;
    graphic.pause();
  }
  //enter
  if (e.which === 13) {
    e.preventDefault();
    //func.next();
    control(history)
  }
}