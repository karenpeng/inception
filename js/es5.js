var graphic = require('./graphic.js');
var stage = require('./stage.js');
//var w = graphic.Widget();

module.exports = Controller;

function Controller(_history) {
  var history = _history;
  var flag = 0;
  var task;

  graphic.w.on('hit', function (info) {

    //hit 'return 1' or hit 'return 0' or 'return fib(n-1) + fib(n-2)'
    if (flag === 1) {
      graphic.destoryText(info.id, stage.scene)
      graphic.goBackward()
      if (info.name === 'return fibonacci(num - 1) + fibonacci(num - 2);') {
        flag = 3;
      } else {
        flag = 2;
      }
      setTimeout(function () {
        graphic.w.isObserving = true;
      }, 200);

      //after 'return 0' or 'return 1'
    } else if (flag === 2) {
      //flag = 0;
      graphic.pause();
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
        setTimeout(function () {
          graphic.w.isObserving = true;
        }, 200);
      } else {
        flag = 0;
        //console.log('ouch!')
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
    task = history.shift();

    if (task.string === undefined) {

      graphic.addText(task.value, task.string, stage.scene, true);
      flag = 0;
      graphic.w.isObserving = false;
      setTimeout(function () {
        next();
      }, 1000);

    } else {

      graphic.addText(task.string, task.string, stage.scene, true);
      flag = 1;
      setTimeout(function () {
        graphic.w.isObserving = true;
      }, 100);

    }
  }

  next();
}