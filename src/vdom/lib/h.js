import VNode from './VNode'

export default function h(tag,props ,...children){
 props = props||{}
  var tem = []
children.forEach((child) => {
    if (Array.isArray(child)) {
       tem = tem.concat(child);
      return ;
    }
    return tem.push(child)
  })
  children = tem.map((child)=>{
    if (isNotObject(child)){
      return new VNode('', '', '', child, null)
    }
   return child;
  })
  return new VNode(tag, props, children,'',null); 
}

function isString(tag) {
  return typeof tag ==='string'
}
function isNotObject(tag) {
  return typeof tag !== 'object'
}