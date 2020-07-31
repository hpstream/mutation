//esprima estraverse escodegen
//esprima=tokenizer parser 转成语法树
//estraverse=traverser
//这个用的是访问器模式 visitor里有用很多钩子函数
//当你需要处理特定类型的节点,但是又不知道对方数据结构的话
function traverse(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(node => traverseNode(node, parent));
  }
  function traverseNode(node, parent) {
    let visitorObject = visitor[node.type];
    let enter, leave;

    if (typeof visitorObject === 'function') {
      enter = visitorObject;
    } else if (visitorObject) {
      enter = visitorObject.enter;
      leave = visitorObject.leave;
    }
    if (enter)//如果在visitor中有对应的访问器方法,则进行调用,如果没有,则跳过
      enter(node, parent);
    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node);
        break;
      case 'CallExpression':
        traverseArray(node.params, node);
        break;
      case 'NumberLiteral':
        break;
    }
    if (leave)//如果在visitor中有对应的访问器方法,则进行调用,如果没有,则跳过
      leave(node, parent);
  }
  traverseNode(ast, null);
}
module.exports = traverse;