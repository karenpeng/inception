var graphic = require('./graphic.js');
var stage = require('./stage.js');
//var w = graphic.Widget();

module.exports = Controller;

function Controller(_history) {
  var index = 0;
  var history = _history;
  var flag = 0;
  var task;
  //}

  graphic.w.on('hit', function () {
        //console.log(flag)
        if (flag === 1) {
          console.log('go back!')
            //graphic.pause()
            //graphic.destoryText(index - 1);
          graphic.destoryText(0, stage.scene)
          graphic.goBackward()
            //setTimeout(function(){
          flag = 2
          graphic.w.alarm = false;
          return
          //}, 100)

        }

        if (flag === 2) {
          console.log('ss')
          graphic.pause()
          graphic.changeText(task.value, task.value, 0, stage.scene);
          flag = 0;
          setTimeout(function () {
            next();
          }, 2000);
        }

  });

  function next() {

    //wrong... you should at least wait untill it hits the final result 1
    if (history.length < 1) return;

    task = history.shift()
    graphic.goForward();

    if (task.string === undefined) {

      graphic.addText(task.value, task.value, stage.scene);
      graphic.w.alarm = true;
      setTimeout(function () {
        next();
      }, 1200);

    } else {
      //zoomIn(history[index].string)
      //graphic.pause()
      graphic.addText(task.string, task.value, stage.scene)
      flag = 1;
      graphic.w.alarm = false;
      console.log(task.string)
        //graphic.goBackward()
    }
  }

  next();
}

// Controller.prototype.next = function () {
//     //if (!history.length) return;
//     // if (history[index + 1].string === undefined) {
//     //   graphic.goForward();

//     // } else {
//     //   graphic.pause();
//     // }
//     if(this.history.length < 1) return;

//     var task = this.history.shift()

//     if (task.string === undefined) {
//       graphic.addText(task.value, stage.scene);
//       graphic.goForward()
//       //graphic.w.alarm = false;
//       var self = this;
//       setTimeout(function () {
//         self.next();
//       }, 1000);

//     }else{
//       //zoomIn(history[index].string)
//       //graphic.pause()
//       graphic.addText(task.string, stage.scene)
//       this.flag = 1
//       console.log('ds '+this.flag)
//       //graphic.w.alarm = false;
//       //graphic.goBackward()
//     }

//   }