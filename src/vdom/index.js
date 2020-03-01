
class Element {
  constructor(tag, props, children) {
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
}

export function createElement(tag, props, children) {
  return new Element(tag, props, children)
}

export function render(vdom, container) {
  // 第一次创建dom 
  if (vdom.ele) {
    patch(vdom, container)
  } else {
    mount(vdom, container)
  }

}
function mount(vdom, container) {
  var ele = vdomToDom(vdom);
  container.appendChild(ele);
}
function vdomToDom(vdom) {
  let { tag, props, children } = vdom;
  var el = document.createElement(tag);
  vdom.ele = el;
  Object.keys(props).forEach((key) => {
    setAttr(key, props[key], el)
  })
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(crateTextNode(child))
    } else {
      child.ele = vdomToDom(child)
      el.appendChild(child.ele)
    }
  });
  return el;

}

function setAttr(key, value, el) {
  switch (key) {
    case 'value':
      switch (el.tagName.toLocaleLowerCase()) {
        case 'textarea':
        case 'input':
          el.value = value;
          break;

        default:
          el.setAttribute(key, value)
          break;
      }
      break;

    default:
      el.setAttribute(key, value)
      break;
  }

}

function crateTextNode(vdom,el) {
  if (el){
    el.textContent = vdom
    return;
  }
  return document.createTextNode(vdom)
}

function diffAttr(oldVdom, newVdom,node) {
  var oldprops = oldVdom.props;
  var newprops = newVdom.props;
  // 老节点上有，新节点没有，删除
  for (var key in oldprops){
    if (!newprops[key]){
      setAttr(key, '', node)
    }
  }
  // 新节点上有，老节点没有,新节点有，老节点有也是重新设置值
  for (var key in newprops) {
   setAttr(key, newprops[key], node)
  }
}
function isStiring(el) {
  return typeof el === 'string'
}

function diffChildren(oldVdom, newVdom, node) {
  var oldchildren= oldVdom.children;
  var newchildren = newVdom.children;
  newchildren.forEach((newchild,i)=>{
    var oldchild = oldchildren[i];
    patch(oldchild, newchild, node) 
  })
}

function patch(oldVdom, newVdom, node) {
  /**
   *  1. 不跨级比较
   *  2. 同级别换位置了，不会删除节点而是调换节点。
   */
  if (isStiring(newVdom) && isStiring(oldVdom)){
    if (newVdom !== oldVdom) {
      crateTextNode(newVdom, node)
    }
    return;
  }

  // 新的是字符串，老得不是字符串
  if (isStiring(newVdom) && !isStiring(oldVdom)) {
    crateTextNode(newVdom, node)   
    return;
  }
  // 新的不是字符串，老得是字符串
  if (!isStiring(newVdom) && isStiring(oldVdom)) {
    node.removeChild(node.childNodes[0])
    mount(newVdom, node)
    return;
  }
  
  if (oldVdom.tag === newVdom.tag) {
    newVdom.ele = oldVdom.ele;
    diffAttr(oldVdom, newVdom, newVdom.ele)
    diffChildren(oldVdom, newVdom, newVdom.ele)

  } else {
    var parent = oldVdom.ele.parentNode;
    oldVdom.ele.remove();
    mount(newVdom, parent)
 
  }
}