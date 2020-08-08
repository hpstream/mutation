/* 
  <div id="app">
  <div>name:{{ name }}</div>
  <div>age:{{ age }}</div>
  </div> 
*/
// 正则表达式网站
// https://jex.im/regulex/#!flags=&re=%5Ba-zA-Z_%5D%5B%5C%5C-%5C%5C.0-9_a-z%5D*

import { generate } from "./generate";
import { ast } from "./ast";

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
let root, currentParent, stack = [];
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;
function createAstElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}
// stack 转成ast
function start(tagName, attrs) {
  let element = createAstElement(tagName, attrs);
  if (!root){
    root = element;
  }
  currentParent = element;
  stack.push(element)
  // root.children.push(element)
}
function end(tagName) {
 var element = stack.pop();
  currentParent = stack[stack.length - 1];
  if (currentParent) {
    element.parent = currentParent;
    currentParent.children.push(element);
  }
}
function chars(text) {
  text = text.replace(/\s/g, '');
  if (text) {
    currentParent.children.push({
      parent: currentParent,
      type: TEXT_TYPE,
      text
    })
  }
}
function parseHTML(html) {
  root = '';
  while (html) {
    // 判断 是否 < 开始
    let textEnd = html.indexOf('<')
    let text;
    if (textEnd > 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      chars(text);
      advance(text.length)
    }

    if (textEnd == 0) {
      // 截取标签
      var startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      }
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
  }

  return root;


  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length);
      let attr, end;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3]
        });
      }
      if (end) {
        advance(end[0].length);
        return match
      }
    }
  }

  function advance(n) {
    html = html.substring(n);
  }
}



export function compileToFunction(template) {
  let lexer = parseHTML(template);
  let vdom = ast(lexer); 
  let code = generate(vdom);
  let render = `with(this){return ${code}}`;
  let renderFn = new Function(render);
  return renderFn
}