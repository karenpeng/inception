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

  function zoomIn(value) {
    //zoomIn another world
    //graphic.zoomIn(value);
    graphic.speed = 1;
  }

  function changeValue(value) {
    graphic.speed = 0;
    graphic.changeValue(value);
  }

  function zoomOut() {
    //get back to the outter world
    //also change the value
    graphic.speed = -1;
  }

  for (var i = 0; i < history.length; i++) {
    if (typeof history[i].string === undefined) {
      yield zoomIn(history[i].value);
    } else {
      yield changeValue(history[i].value);
      yield zoomOut();
    }
  }
}