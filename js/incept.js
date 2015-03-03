var graphic = require('./graphic.js');

//something i know from here:
//1.how many layers are there
//2.when to zoomIn
//3.when to return value
//4.when to zoomOut
//so...maybe i could write instruction to build the world from here?

module.exports = function* (history) {

  //graphic.makeCubes(history.length);
  //console.log('hey')

  function zoomIn(history) {
    //zoomIn another world
    //graphic.zoomIn(value);
    console.log(Object.keys(graphic))
    graphic.speed = 1;
    graphic.addText(history.value, history.string);
    setInterval(function () {
      //graphic.addGate();
    }, 600);
  }

  function changeValue(history, callback) {
    graphic.speed = 0;
    graphic.changeText(history.value, history.string);
    setTimeout(function () {
      callback();
    }, 2000);
  }

  function zoomOut() {
    //get back to the outter world
    //also change the value
    graphic.speed = -1;
  }

  for (var i = 1; i < history.length; i++) {
    if (history[i].string === undefined) {
      yield zoomIn(history[i]);
    } else {
      yield changeValue(history[i], zoomOut);
      //yield zoomOut();
    }
  }
}