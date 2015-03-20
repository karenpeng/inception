// var editor2

// module.exports = {

//   init: function () {
//     var editor1 = ace.edit("editor1");
//     editor1.setTheme("ace/theme/monokai");
//     editor1.getSession().setMode("ace/mode/javascript");

//     editor2 = ace.edit("editor2");
//     editor2.setTheme("ace/theme/monokai");
//     editor2.getSession().setMode("ace/mode/javascript");

//     // var editor3 = ace.edit("editor3");
//     // editor3.setTheme("ace/theme/monokai");
//     // editor3.getSession().setMode("ace/mode/javascript");
//   },

//   getValue: function (name) {
//     switch (name) {
//     case '1':
//       return editor1.getValue();
//     case '2':
//       return editor2.getValue();
//     }
//   },

//   getLineNum: function (string) {
//     var lines = editor1.session.getAllLines();
//     var stringNum = [];
//     for (var i = 0; i < lines.length; i++) {
//       if (lines[i].indexOf(string) !== -1) stringNum.push(i);
//     }
//     return stringNum;
//   },

//   addMarker: function () {

//   },

//   editor2: editor2
// }
var editor2

function init() {
  var editor1 = ace.edit("editor1");
  editor1.setTheme("ace/theme/monokai");
  editor1.getSession().setMode("ace/mode/javascript");

  editor2 = ace.edit("editor2");
  editor2.setTheme("ace/theme/monokai");
  editor2.getSession().setMode("ace/mode/javascript");

  // var editor3 = ace.edit("editor3");
  // editor3.setTheme("ace/theme/monokai");
  // editor3.getSession().setMode("ace/mode/javascript");
}

init()

module.exports = editor2