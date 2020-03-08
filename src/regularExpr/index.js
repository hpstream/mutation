function parse(str) {
  var tokens = lexer(str);
  // console.log(tokens);
  return parser(tokens)
}
var Stack = [];
var currentTag;
function parser(tokens) {
  var children = [];
  console.log(tokens);
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
        Stack.push(currentTag);
        if (child.type === 'text') {
          currentTag = {
            tagName: child.type,
            text: child.text,
            children: []
          }
        } else {
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
      parent.children.push(currentTag)
      currentTag = parent;
    }
  }
  console.log('------------------------------------');
  console.log(JSON.stringify(currentTag,null,2));
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
var startExpr = /^([a-z]*)(\s*)/;
var attrsExpr = /(\s*)([a-z]*)=['"]{1}([^'"]*)['"]{1}(\s*)/;
var endExpr = /(\s*(?:<\/>|<\/([a-z]*)>))/;
var textExpr = /\s*([^<>]*)/;
function lexer(str) {
  index = 0;
  tokens = []

  while (index < str.length) {
    // 从字符串第0个位置开始进攻
    lextext(str.slice(index))
    lexTag(str.slice(index))
    lexTagEnd(str.slice(index))
  }
  return tokens;
}
function lexTag(str) {
  var flag = true;

  while (flag) {
    lexTagstart(str.slice(index))
    if (str.slice(index).length === 0) {
      break;
    }
    flag = str.slice(index).indexOf('<') === 0
  }
  lextext(str.slice(index))
}
function lexTagstart(str) {
  var tempstr = str;
  // 获取到开头
  var startarr = tempstr.match(/^<([a-z]*)(\s*)/);
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
parse("<div class='abc'><img src='vvv' /><span>1</span><span>2</span></div>")
// export default parse