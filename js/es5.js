var graphic = require('./graphic.js');
//var w = graphic.Widget();

module.exports = function (history) {
  var index = 0;
  var history = history;

  //wait until hits it
  graphic.w.on('hit', function () {
    if (history[index].string !== undefined) {
      changeValue(history[index]);
      index++;
    }
  });

  this.next = function () {
    //if (!history.length) return;
    if (history[index].string === undefined) {
      zoomIn(history[index]);
      index++;
      graphic.w.alarm = false;
    }
    var self = this;
    setTimeout(function () {
      self.next();
    }, 1000);
  }
}

function zoomIn(history) {
  //zoomIn another world
  //graphic.zoomIn(value);
  //console.log('wat ' + Object.keys(graphic))
  graphic.speed = 1;
  graphic.addText(history.value, history.string);
  for (var i = 0; i < 10; i++) {
    setTimeout(function () {
      graphic.addGate();
    }, i * 400);
  }
}

function changeValue(history, callback) {
  graphic.speed = 0;
  graphic.changeText(history.value, history.string);
  // setTimeout(function () {
  //   callback();
  // }, 2000);
  zoomOut();
}

function zoomOut() {
  //get back to the outter world
  //also change the value
  graphic.speed = -1;
}