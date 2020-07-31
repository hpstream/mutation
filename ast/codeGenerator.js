

function codeGenerator(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(codeGenerator).join('\n');
    case 'CallExpression':   // add(1,2,3)
      return codeGenerator(node.callee) + `(${node.arguments.map(codeGenerator).join(',')})`;
    case 'Identifier':
      return node.name;
    case 'NumberLiteral':
      return node.value;
  }
}

module.exports = codeGenerator;