var graphic = require('./graphic.js');
var stage = require('./stage.js');
//var w = graphic.Widget();

module.exports = Controller;

function Controller(_history) {
  var index = 0;
  var history = _history;
  var flag = 0;
//}

graphic.w.on('hit', function(){
  console.log(flag)
   if (flag === 1) {

      //graphic.pause()
      //graphic.destoryText(index - 1);
      graphic.destoryText(0, stage.scene)
      graphic.goBackward()
      flag = 2
    }

    if(flag ===2){
      graphic.pause()
      graphic.changeText(history.value, 0, stage.scene);
      flag = 0;

      setTimeout(function () {
        next();
      }, 1000);
    }

  });


  function next(){

    if(history.length < 1) return;

    var task = history.shift()

    if (task.string === undefined) {
      graphic.addText(task.value, stage.scene);
      graphic.goForward()
      graphic.w.alarm = true;
      setTimeout(function () {
        next();
      }, 1000);

    }else{
      //zoomIn(history[index].string)
      //graphic.pause()
      graphic.addText(task.string, stage.scene)
      flag = 1
      console.log('ds '+flag)
      graphic.w.alarm = false;
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

