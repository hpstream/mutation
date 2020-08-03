var textReg = /([^{]*){{([^}]*)}}/

export function parseText(ast) {
  if(ast.type === 3){ // 代表是文本节点
    var text = '434:';
    let result = text.match(textReg)
    let textArr = []
    if (!result){ // 如果不包涵差值表达式，直接放入
      textArr.push({
        type: 'express',
        value: text
      })
    }
    while (result) {
      textArr.push({
        type:'normal',
        value: result[1]
      })
      textArr.push({
        type: 'express',
        value: result[2]
      })
      text = text.slice(result[0].length)
      result = text.match(textReg)
    }

    ast.text = textArr
  }
}