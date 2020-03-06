function matchAll(str, reg) {
  var res = {

  }
  res = str.match(reg);
  // while (match = reg.exec(str)) {
  //   res [match[1]] = match[2]
  // }
  return res
}
var obj = matchAll(" <div   ad='abc'  title='ab' > </div", /(\w*)=['"]([^'"]*)['"]/)

console.log('------------------------------------');
console.log(obj);
console.log('------------------------------------');