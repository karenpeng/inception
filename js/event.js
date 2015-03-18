var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Widget, EventEmitter);

function Widget() {
  this.alarm = false;
  if (!(this instanceof Widget)) return new Widget();
}

Widget.prototype.detect = function (something) {

  // if (!this.alarm) {
  //   console.log(something, this.alarm)
  // }
  if (something !== null && !this.alarm) {
    //console.log('ouch!')
    this.alarm = true;
    this.emit('hit');
  }
};

module.exports = Widget;