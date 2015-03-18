var graphic = require('./graphic.js');
var stage = require('./stage.js');
//var w = graphic.Widget();

module.exports = Controller;

function Controller(_history) {
  var index = 0;
  var history = _history;
  var flag = 0;
  var task;

  graphic.w.on('hit', function (info) {

    //hit 'return 1' or hit 'return 0' or 'return fib(n-1) + fib(n-2)'
    if (flag === 1) {
      if (info.name === 'return fibonacci(num - 1) + fibonacci(num - 2);') {
        flag = 3;
      } else {
        flag = 2
      }
      graphic.destoryText(info.id, stage.scene)
      graphic.goBackward()
      graphic.w.isObserving = true;

    } else if (flag === 2) {

      flag = 0;
      graphic.pause()
      graphic.changeText(task.value, task.string, info.id, stage.scene, false);
      setTimeout(function () {
        next();
      }, 1000);

    }

    //hits 1 and 0 and then fib(2)
    else if (flag === 3) {
      if (!info.destoryable) {
        graphic.destoryText(info.id, stage.scene)
        graphic.goBackward()
        graphic.w.isObserving = true;
      } else {
        flag = 0;
        console.log('ouch!')
        graphic.pause()
        graphic.changeText(task.value, task.string, info.id, stage.scene, false)
        setTimeout(function () {
          next();
        }, 1000);
      }
    }

  });

  function next() {

    if (history.length < 1) {
      graphic.goBackward();
      return;
    }

    graphic.goForward();
    task = history.shift()

    if (task.string === undefined) {
      graphic.addText(task.value, task.string, stage.scene, true);
      setTimeout(function () {
        next();
      }, 1200);

    } else {
      flag = 1;
      graphic.addText(task.string, task.string, stage.scene, true)
      graphic.w.isObserving = true;
    }
  }

  next();
}