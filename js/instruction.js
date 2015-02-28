module.exports = instruction;

function* instruction(arr) {
  var stack = [];

  function zoomIn() {
    //zoomIn another world
    stack.push(arr[i]);
  }

  function zoomOut() {
    //get back to the outter world
    //also change the value
    stack.pop();
  }

  function changeValue(value) {
    stack[stack.length - 1] = value;
  }

  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'string') {
      yield zoomIn();
    } else {
      yield changeValue(arr[i]);
      yield zoomOut();
    }
  }
}