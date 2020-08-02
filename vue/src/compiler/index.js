/* 
  <div id="app">
  <div>name:{{ name }}</div>
  <div>age:{{ age }}</div>
</div> 
*/

function parseHTML(html) {

  while (html) {
    // 判断 是否 < 开始
    let textEnd = html.indexOf('<')
    if ( textEnd===0) {
      const startTagMatch = parseStartTag();
    }
  }




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
        match.attrs.push({ name: attr[1], value: attr[3] });
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
  parseHTML(template);
  return function () { }
}