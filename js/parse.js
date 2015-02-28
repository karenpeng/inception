var falafel = require('falafel');
var inspect = require('object-inspect');

module.exports = function (src) {

  var id = 0;
  var nodes = {};
  var _obj = require('./dataStructure.js');

  var out = falafel(src, function (node) {
    if (node.type === 'FunctionDeclaration') {
      _obj.functionName = node.id.name;
      _obj.paramNumber = node.params.length;
    }
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      //node.body.update('{' + '_enter(' + id + ',arguments,"' + node.source() + '");' + node.body.body
      node.body.update('{' + '_enter(' + id + ',arguments);' + node.body.body
        .map(function (x) {
          return x.source()
        })
        .join(';\n')
        // + '_exit(' + id + ',null,"' + node.source() + '");' + '}'
        + '_exit(' + id + ');' + '}'
      );
      nodes[id] = node;
      id++;
    } else if (node.type === 'ReturnStatement') {
      node.argument.update(
        //'_exit(' + id + ',' + node.argument.source() + ', "' + node.source() + '")'
        '_exit(' + id + ',' + node.argument.source() + ')'
      );
      nodes[id] = node;
      id++;
    }
  }).toString();

  // console.log(out);
  // console.log(nodes);

  var stack = [];
  Function(['_exit', '_enter'], out)(exit, enter);

  function exit(id, value, source) {
    stack.pop();
    var indent = Array(stack.length + 1).join(' ');
    console.log(indent + value);
    // _obj.history.push({
    //   string: source,
    //   wat: indent + value
    // });
    return value;
  }

  function enter(id, args, source) {
    var indent = Array(stack.length + 1).join(' ');
    args = [].slice.call(args).map(inspect);
    console.log(indent + nodes[id].id.name + '(' + args.join(', ') + ')');

    var str = indent + nodes[id].name + '(' + args.join(', ') + ')';
    console.log('wtf ' + str);
    // _obj.history.push({
    //   string: source,
    //   wat: str
    // });
    stack.push(id);
  }

  //console.log(_obj);
  //console.log('stack ' + stack);
  return _obj;

}