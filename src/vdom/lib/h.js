import VNode from './VNode'

export default function h(tag,props,children){

 children = children.map((child)=>{
    if (isString(child)){
      
      return new VNode('', '', '', child, null)
    }
   return child;
  })
  
  return new VNode(tag, props, children,'',null); 
}

function isString(tag) {
  return typeof tag ==='string'
}