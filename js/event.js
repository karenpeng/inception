var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Widget, EventEmitter);

function Widget() {
  this.alarm = false;
  if (!(this instanceof Widget)) return new Widget();
}

Widget.prototype.detect = function (something) {
  // if (!this.alarm) {
  //console.log(something, this.alarm)
  // }
  if (something !== null && !this.alarm) {
    //console.log('ouch!')
    //console.log(something.destoried)
    if (!something.destoried) {
      this.alarm = true;
      //console.log(something)
      this.emit('hit', something.id);
    }
  }
};

module.exports = Widget;