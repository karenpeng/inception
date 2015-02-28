module.exports = update;

function* update(arr, stack) {
  console.log(arr);

  function pushPush() {
    stack.push(arr[i]);
  }

  function changeValue() {
    stack[stack.length - 1] = arr[i] + '';
  }

  function popPop() {
    stack.pop();
  }

  for (var i = 0; i < arr.length; i++) {
    //this is bad b/c what if it dose not return number? T_T
    //if (arr[i]['func']) {
    //if it returns a function
    if (typeof arr[i] !== 'string') {
      //if (arr[i]['return']) {
      yield changeValue;
      yield popPop;
      //if it does not return a function, it should be value i guess
    } else {
      yield pushPush;
    }
  }
}