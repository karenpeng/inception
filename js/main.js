var parse = require('./parse.js');
//var instruction = require('./instruction.js');

// var editor1 = ace.edit("editor1");
// editor1.setTheme("ace/theme/monokai");
// editor1.getSession().setMode("ace/mode/javascript");

// var editor2 = ace.edit("editor2");
// editor2.setTheme("ace/theme/monokai");
// editor2.getSession().setMode("ace/mode/javascript");

function fibonacci(num) {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

var call = 'fibonacci(6)';

var test = fibonacci.toString().concat(call);
parse(test)