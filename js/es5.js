var graphic = require('./graphic.js');
var stage = require('./stage.js');
//var w = graphic.Widget();

module.exports = function (history) {
  var index = 0;
  var history = history;

  //wait until hits it
  //console.log(graphic.w)
  graphic.w.on('hit', function () {
    console.log(index)
    if (history[index].string !== undefined) {
      //graphic.pause()
      //graphic.destoryText(index - 1);
      graphic.goBackward()
      graphic.changeText(history.value, index, stage.scene);
      index++;
    }
  });

  this.next = function () {
    //if (!history.length) return;
    // if (history[index + 1].string === undefined) {
    //   graphic.goForward();

    // } else {
    //   graphic.pause();
    // }

    if (history[index].string === undefined) {
      graphic.addText(history[index].value, stage.scene);
      graphic.goForward()
      index++;
      graphic.w.alarm = false;

    }else{
      //zoomIn(history[index].string)
      //graphic.pause()
      graphic.addText(history[index].string, stage.scene)
      //graphic.goBackward()
    }

    var self = this;
    setTimeout(function () {
      self.next();
    }, 1000);
  }
}

// addText

// addText

// addReturn

// hitReturn

// comeback

// hit the last one

// stop

// change it

// comeback

// destory it

