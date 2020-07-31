/**
[
  { type: 'paren', value: '(' },
  { type: 'name', value: 'sub' },
  { type: 'whitespace', value: ' ' },
  { type: 'number', value: '4' },
  { type: 'whitespace', value: ' ' },
  { type: 'number', value: '3' },
  { type: 'paren', value: ')' }
]
*/
function parser(tokens) {
  //也是一个索引指针 ,指向当前的token
  let current = 0;
  function walk() {// (add 22 33)
    let token = tokens[current]
    if (token.type === 'paren' && token.value ==='(') {
      token = tokens[++current];//add
      let node = {
        type: 'CallExpression',
        name: token.value,//add
        params: []
      }
      token = tokens[++current];
      while (token.type === 'whitespace') {
        token = tokens[++current]
      }
      
      while (token.type != 'paren' || (token.type == 'paren' && token.value != ')')) {
        node.params.push(walk())
        token = tokens[current];
      }
      current++;//)
      return node;
    }
    if (token.type === 'whitespace') {
      current++;
       return walk();
    }

    if (token.type == 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }


  }
  let ast = {
    type: 'Program',
    body: []
  }
  while (current < tokens.length) {
    ast.body.push(walk());
  }
  return ast;
}
module.exports = parser;