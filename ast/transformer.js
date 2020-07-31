let traverse = require('./traverse');
/**
 * 语法树的转换有两种思路
 * 1. 修修补补 在老树上直接 修改 适合什么应用场景?
 * 2. 完全重建 完全 直接 搞一个新的ast树
 */

function transformer(program) {
  let newAst = {
    type: 'Program',
    body: []
  }
  //让老树的context指向新树的body
  program.context = newAst.body;
  traverse(program, {
    CallExpression(node, parent) {
      let callExpression = {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: node.name },//add
        arguments: []
      }
      //让老的callExpression的context指向新的callExpression的arguments
      node.context = callExpression.arguments;
      //
      parent.context.push(callExpression);
    },
    NumberLiteral(node, parent) {
      parent.context.push(node);
    }
  });
  return newAst;
}
module.exports = transformer;


/* function transformer(ast){
    traverse(ast,{
        NumberLiteral(node,parent){
            node.value = parseInt(node.value)*2+"";
        }
    });
    return ast;
} */