var textReg = /([^{]*){{([^}]*)}}/

export function parseText(ast) {
  if(ast.type === 3){ // 代表是文本节点
    let result = ast.text.match(textReg)
    let text = ast.text;
    let textArr = []
    if (!result){ // 如果不包涵差值表达式，直接放入
      textArr.push({
        type: 'text',
        value: text
      })
    }
    while (result) {
      textArr.push({
        type:'text',
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