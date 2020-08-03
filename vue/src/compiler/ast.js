import { parseText } from "./parsers/parseText";

export function ast(lexers) {
  

  // 处理事件

  let { children = []  } = lexers;

  parseText(lexers)

  children.forEach((child)=>{
    // 处理差值表达式{{}}
    ast(child)
    
  })
  return lexers;
}