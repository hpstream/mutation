let jsx = `let element=<h1>hello</h1>`;


/**
 Identifier : let ,element
 operator : = 
 JSXElement:
 whitespace
 */
function lexical(code) {
  const tokens = [];
  for (i = 0; i < code.length; i++) {
    debugger
    var char = code[i];
    if (char === '=') {
      tokens.push({ type: 'operator', value: char })
    }
    if (/\s/.test(char)) {
      var spaceChar = char
      i++;
      while (/\s/.test(code[i])) {
        spaceChar += code[i]
        i++;
      }
      --i;
      tokens.push({ type: 'whitespace', value: spaceChar })
    }

    if (char === '<') {
      let j = code.length - 1;
      while (code[j] !== '>') {
        j--;
      }
      tokens.push({ type: 'JSXElement', value: code.slice(i, i + j) })

      i = i + j
    }

    if (/[a-zA-z0-9]/.test(char)) {
      let identifierChar = char
      i++;
      while (/[a-zA-z0-9]/.test(code[i])) {

        identifierChar += code[i]
        i++;
      }
      --i;
      tokens.push({ type: 'Identifier', value: identifierChar })
    }


  }
  return tokens;
}




let result = lexical(jsx);
console.log(result);