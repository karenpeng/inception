var graphic = require('./graphic.js');
//var w = graphic.Widget();

module.exports = function (history) {
  var index = 1;
  var history = history;
  return function () {
    if (history[index].string === undefined) {
      zoomIn(history[index]);
      index++;
      graphic.w.alarm = false;
    } else {
      //wait until hits it
      graphic.w.on('hit', function () {
        changeValue(history[index]);
        index++;
      });
    }
  }

  function zoomIn(history) {
    //zoomIn another world
    //graphic.zoomIn(value);
    console.log('wat ' + Object.keys(graphic))
    graphic.speed = 1;
    graphic.addText(history.value, history.string);
    setInterval(function () {
      //graphic.addGate();
    }, 600);
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

}