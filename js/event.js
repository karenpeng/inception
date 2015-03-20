var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Widget, EventEmitter);

function Widget() {
  this.isObserving = false;
  if (!(this instanceof Widget)) return new Widget();
}

Widget.prototype.detect = function (something) {
  // if (!this.alarm) {
  //   console.log(something, this.isObserving)
  // }
  if (this.isObserving && something !== null) {

    this.isObserving = false;
    //omg i made my own socket io message emitter! hurray:)
    var info = {
      id: something.id,
      name: something.name,
      destoryable: something.destoryable,
      index: something.myIndex
    }
    this.emit('hit', info);
  }
};

module.exports = Widget;