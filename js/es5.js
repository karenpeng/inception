var graphic = require('./graphic.js');
var stage = require('./stage.js');
//var w = graphic.Widget();

module.exports = Controller;

function Controller(_history) {
  var index = 0;
  var history = _history;
  var flag = 0;
  var task;

  graphic.w.on('hit', function () {
    //console.log(flag)
    if (flag === 1) {
      console.log('go back!')
      graphic.destoryText(0, stage.scene)
      graphic.goBackward()
      flag = 2
      graphic.w.alarm = false;
      return
    }

    if (flag === 2) {
      //console.log('ss')
      graphic.pause()
      graphic.changeText(task.value, task.string, 0, stage.scene);
      flag = 0;
      setTimeout(function () {
        next();
      }, 2000);
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
      graphic.addText(task.value, task.string, stage.scene);
      graphic.w.alarm = true;
      setTimeout(function () {
        next();
      }, 1200);

    } else {
      graphic.addText(task.string, task.string, stage.scene)
      flag = 1;
      graphic.w.alarm = false;
    }
  }

  next();
}