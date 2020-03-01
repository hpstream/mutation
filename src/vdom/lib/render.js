var root = null;
export default function render(vdom,container) {
  if (root){
    patch(vdom, container)
  }else{
    mount(vdom, container)
  }
  
}

function mount(vdom, container) {
  root = container;
  container.appendChild(vdomToElement(vdom))
}

function patch(vdom, newVdom) {
  var elm = newVdom.elm = vdom.elm;
  if(!newVdom.isSameVNode(vdom, newVdom)){
    var parentNode = elm.parentNode;
    deleteElement(parentNode, elm)
    mount(newVdom, parentNode)
    return;
  }
  // 比较属性，
  var oldAttr = vdom.data.attrs;
  var newAttr = newVdom.data.attrs;;
  // 查看老属性，看看新的有没有如果没有就删除
  Object.keys(oldAttr).forEach((key) => { 
    if (!newAttr[key]){
      setAttr(elm, key,null)
    }
  })
  // 看看新的，在老的里面有没有，新的跟老的值不一样，重新设置值
  Object.keys(newAttr).forEach((key) => {
    if (newAttr[key] !== oldAttr[key]) {
      setAttr(elm, key, newAttr[key])
    }
  })

  // 处理事件
  var on =  newVdom.data.on||{}
  Object.keys(on).forEach((key) => {
    setEvent(ele, key, on[key])
  })

  // 比较孩子节点
  var oldchildren = vdom.children;
  var newchildren = newVdom.children;
  newchildren.forEach((newchild)=>{
      // 去老得数组里面找，可以复用的节点
    var oldindex = oldchildren.findIndex((oldchild) => {
      if (oldchild){
        return newchild.isSameVNode(oldchild, newchild)
      }
      return false;
    });
    if (oldindex>0){ // 知道了可以复用的点
      
      var oldVDom = oldchildren[oldindex];
      oldchildren[oldindex] = null;
      patch(oldVDom, newchild)
     
    }else { // 没有知道复用的点
      elm.appendChild(vdomToElement(newchild))
    }
  })

  oldchildren.forEach((oldchild)=>{
    if (oldchild){
      deleteElement(elm, oldchild.elm) 
    }
  })

}

function vdomToElement(vdom) {
  var { type, data, children, text} = vdom;
  var { key, on = {} ,attrs } = data;
  // 如果是文本节点
  if (text){
    return createTextNode(vdom)
  }
  var ele = createElement(vdom);
  // 处理属性
  Object.keys(attrs).forEach((key)=>{
    setAttr(ele, key, attrs[key])
  })
  // 处理事件
  Object.keys(on).forEach((key) => {
    setEvent(ele, key, on[key])
  })
  // 处理孩子节点
  children.forEach((child)=>{
    ele.appendChild(vdomToElement(child))
  })

  return ele
}

function setAttr(ele,key,val) {
 
  switch (ele.tagName.toLocaleLowerCase()) {
    case 'textarea':
    case 'input':
       ele.value =  val ||'';
      break;

    default:
      if (val){
        ele.setAttribute(key, val)
      }else{
        ele.removeAttribute(key)
      }
      break;
  }
}

function setEvent(ele, key, val) {
  var fn;
  // ele.removeEventListener(key, val) 
  function go() {
    if (fn){
      ele.removeEventListener(key, fn);
    }
    fn = val;
    ele.addEventListener(key, val, false) 
  }
  go();
}
// 删除节点
function deleteElement(parent,node) {
  parent.removeChild(node);
}

// 创建文本节点
function createTextNode(vdom) {
  var elm = document.createTextNode(vdom.text)
  vdom.elm = elm;
  return elm;
}

function createElement(vdom) {
  var { type} = vdom;
  var elm = document.createElement(type)
  vdom.elm = elm;
  return elm;

}