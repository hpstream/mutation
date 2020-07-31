let tokenizer = require('./tokenizer');
let parser = require('./parser');
let transformer = require('./transformer');
let codeGenerator = require('./codeGenerator');
let tokens = tokenizer('(add 4 (sub 4 3))');


let ast = parser(tokens);
let newAst = transformer(ast);
let newCode = codeGenerator(newAst);
console.log(newCode);