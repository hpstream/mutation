

let LETTERS = /[a-z]/i; // 单词匹配
let NUMBERS = /[0-9]/i; // 匹配数字
let WHITE_SPACE = /\s/i; // 匹配空格
function tokenizer(input) {
  let currentIndex = 0;
  let tokens = [];
  while (currentIndex < input.length) {
    if (input[currentIndex] === '(') {
      tokens.push({ type: 'paren', value: '(' })
      currentIndex++;

    } else if (input[currentIndex] === ')') {
      tokens.push({ type: 'paren', value: ')' })
      currentIndex++;

    } else if (LETTERS.test(input[currentIndex])) {
      let letters = '';
      while (LETTERS.test(input[currentIndex])) {
        letters += input[currentIndex];
        currentIndex++;
      }
      tokens.push({ type: 'name', value: letters })
    } else if (NUMBERS.test(input[currentIndex])) {
      let number = '';
      while (NUMBERS.test(input[currentIndex])) {
        number += input[currentIndex];
        currentIndex++;
      }
      tokens.push({ type: 'number', value: number })

    } else if (WHITE_SPACE.test(input[currentIndex])){
      let spaceValue = '';
      while (WHITE_SPACE.test(input[currentIndex])) {
        spaceValue += ' ';
        currentIndex++;
      }
      tokens.push({ type: 'whitespace', value: spaceValue })

    }
  }
  return tokens;
}

// console.log(tokenizer('(add 1 (sub 4 3))'))

module.exports = tokenizer;
