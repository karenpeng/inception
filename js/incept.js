var graphic = require('./graphic.js');

module.exports = function* (history) {
  function zoomIn(value) {
    //zoomIn another world
    graphic.zoomIn(value);
  }

  function changeValue(value) {
    graphic.changeValue(value);
  }

  function zoomOut() {
    //get back to the outter world
    //also change the value
    graphic.zoomOut();
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