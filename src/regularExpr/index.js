function parse(str) {
  var tokens = lexer(str);
  // console.log(tokens);
  return parser(tokens)
}
var Stack = [];
var currentTag;
function parser(tokens) {
  var children = [];
  for (let i = 0; i < tokens.length; i++) {
    let child = tokens[i];
    if (child.type === 'tag-start' || child.type === 'text') {
      if (!currentTag) {
        currentTag = {
          tagName: child.tagName,
          attrs: child.attrs,
          children: []
        }
      } else {
        if (child.type === 'text') {
          currentTag.text = child.text
        } else {
          Stack.push(currentTag);
          currentTag = {
            tagName: child.tagName,
            attrs: child.attrs,
            children: []
          }
        }
      }
    }

    if (child.type === 'tag-end') {
      var parent = Stack.pop();
      if (!parent){
        children.push(currentTag)
        currentTag = null;
        continue;
      }
      parent.children.push(currentTag)
      currentTag = parent;
    }
  }
  console.log('------------------------------------');
  console.log(children.length);
  console.log(JSON.stringify(children,null,2));
  console.log('------------------------------------');



}
// 定义数据结构
// type tag-start,text,tag-end,attrs
// attrs  存放属性
// close true,false
// text 文本 
// 记录位置 
//
var index = 0;
var tokens = [];
var tagExpr = /^(<[^>]*>)/ 
var startExpr = /^<([a-z]*)(\s*)/;
var attrsExpr = /(\s*)([a-z]*)=['"]{1}([^'"]*)['"]{1}(\s*)/;
var endExpr = /(\s*(?:<\/>|<\/([a-z]*)>))/;
var textExpr = /\s*([^<>]*)/;
function lexer(str) {
  index = 0;
  tokens = []

  while (index < str.length) {
    // 从字符串第0个位置开始进攻
    if (str.slice(index).indexOf('<')===0){
      lexTag(str.slice(index))
    }else{
      lextext(str.slice(index))
    }
  }
  return tokens;
}
function lexTag(str) {
  var tagArr = str.match(tagExpr)
  if (tagArr){
    if (tagArr[0].indexOf('</') === 0){
      lexTagEnd(tagArr[0])
    }else{
      lexTagstart(tagArr[0])
    }
  }
 
}
function lexTagstart(str) {
  var tempstr = str;
  // 获取到开头
  var startarr = tempstr.match(startExpr);
  if (startarr) {
    index += startarr[0].length;
    tempstr = tempstr.slice(startarr[0].length)
    var tagStart = {
      type: 'tag-start',
      tagName: startarr[1],
      attrs: {},
      close: false
    }
  }


  // 循环那到属性，处理属性
  var result = tempstr.match(attrsExpr);
  while (result) {
    index += result[0].length;
    tempstr = tempstr.slice(result[0].length)
    if (result) {
      tagStart.attrs[result[2]] = result[3]
    }
    if (tempstr.indexOf('>') === 0 || tempstr.indexOf('/>') === 0) {
      break;
    }
    result = tempstr.match(attrsExpr);
  }
  if (tagStart) {
    tokens.push(tagStart)
  }

  isCloseTag(tempstr);

}
function isCloseTag(str) {
  if (str.indexOf('>') === 0) {
    index += 1;
    return true;
  }
  if (str.indexOf('/>') === 0) {
    tokens.push({
      type: 'tag-end',
      tagName: 'xx',
      close: true,
    })
    index += 2;
    return true;
  }
  return false;
}
function lexTagEnd(str) {
  var endArr = str.match(endExpr);
  if (endArr) {
    index += endArr[0].length;
    tokens.push({
      type: 'tag-end',
      tagName: endArr[2],
      attrs: {},
      close: true
    })
  }
}

function lextext(str) {
  var textarr = str.match(textExpr);
  if (textarr[1].length > 0) {
    index += textarr[0].length;
    tokens.push({
      type: 'text',
      tagName: '',
      text: textarr[1]
    })
  }
}
// "<div class='abc'><img src='vvv' /><span>1</span><span>2</span></div>"
parse("<div class='abc'><img src='vvv' /><div><span>1</span></div><span>2</span></div><div class='abc1'><img src='vvv11' /><div><span>1</span></div><span>2</span></div>")
// export default parse