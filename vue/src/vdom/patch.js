export function patch(oldVnode, vnode) {
  if(!oldVnode){
    return createElm(vnode)
  }
  // 将虚拟节点转化成真实节点
  if (oldVnode.nodeType === 1) {
    let el = createElm(vnode); // 产生真实的dom 
    let parentElm = oldVnode.parentNode; // 获取老的app的父亲 =》 body
    parentElm.insertBefore(el, oldVnode.nextSibling); // 当前的真实元素插入到app的后面
    parentElm.removeChild(oldVnode); // 删除老的节点
    return el
  } else {
    diff(oldVnode, vnode)
  }

}
function createComponent(vnode) {
  // 调用hook中init方法 
  let i = vnode.data;
  if ((i = i.hook) && (i = i.init)) { // i就是init方法
    i(vnode); // 内部会去new 组件 会将实例挂载在vnode上
  }
  if (vnode.componentInstance) { // 如果是组件返回true
    return true;
  }
}
export function createElm(vnode) {
  
  let { tag, children, key, data, text } = vnode;
  if (typeof tag == 'string') { // 创建元素 放到vnode.el上


    if (createComponent(vnode)) { // 组件渲染后的结果 放到当前组件的实例上 vm.$el
      return vnode.componentInstance.$el; // 组件对应的dom元素
    }
    vnode.el = document.createElement(tag);
    updateProperties(vnode)
    children.forEach(child => { // 遍历儿子 将儿子渲染后的结果扔到父亲中
      // 处理属性
      vnode.el.appendChild(createElm(child));
    })
  } else { // 创建文件 放到vnode.el上
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function updateProperties(vnode, oldProps = {}) {
  let el = vnode.el;
  let newProps = vnode.data;
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAtrribute(key);
    }
  }

  if (!newProps) return;
  Object.entries(newProps).forEach(attrs => {
    var [key, value] = attrs
    switch (key) {

      case 'click':
        el.addEventListener('click', value, false)
        break;
      case 'style':
        var styleArr = [];
        for (let key in value) {
          styleArr.push(`${key}:${value[key]}`)
        }
        el.style = styleArr.join(';')
        break;
      default:
        el.setAttribute(key, value)
    }
  })
}

// vue 的渲染流程 =》 先初始化数据 =》 将模板进行编译 =》 render函数 =》 生成虚拟节点 =》 生成真实的dom  =》 扔到页面上

function diff(oldVnode, vnode) {

  if (oldVnode.tag !== vnode.tag) {
    return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
  }

  if (!oldVnode.tag) {
    if (vnode.text != oldVnode.text) {
      return oldVnode.el.textContent = vnode.text;
    }
  }
  var el = vnode.el = oldVnode.el;

  updateProperties(vnode, oldVnode.data)

  var oldChildren = oldVnode.children || [];
  var newChildren = vnode.children || [];
  if (oldChildren.length > 0 && newChildren.length > 0) {
    updateChildren(oldChildren, newChildren, el);
  } else if (oldChildren.length > 0) {
    oldChildren.innerHTML = '';
  } else if (newChildren.length > 0) {
    for (let index = 0; index < newChildren.length; index++) {
      el.appendChild(createElm(newChildren[index]))
    }
  }
}
function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag == newVnode.tag) && (oldVnode.key == newVnode.key);
}
function updateChildren(oldChildren, newChildren, el) {
  var oldStartIndex = 0;
  var oldEndIndex = oldChildren.length - 1;
  var oldStartVnode = oldChildren[0];
  var oldEndVnode = oldChildren[oldEndIndex]


  var newStartIndex = 0;
  var newEndIndex = newChildren.length - 1;
  var newStartVnode = newChildren[0];
  var newEndVnode = newChildren[newEndIndex]
  var map = makeIndexByKey(oldChildren)
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) { // 指针指向了null 跳过这次的处理
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode);
      el.insertBefore(oldStartVnode.el, oldStartVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode);
      el.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else {
      let moveIndex = map[newStartVnode.key];
      if (moveIndex == undefined) { // 不需要移动说明没有key复用的
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else {
        console.log(moveIndex)
        let moveVNode = oldChildren[moveIndex]; // 这个老的虚拟节点需要移动
        oldChildren[moveIndex] = null;
        el.insertBefore(moveVNode.el, oldStartVnode.el);
        patch(moveVNode, newStartVnode); // 比较属性和儿子
      }
      newStartVnode = newChildren[++newStartIndex]; // 用新的不停的去老的里面找
    }

  }

  // 老节点的儿子，比新节点多。
  if (oldStartIndex <= oldEndIndex) {
    for (let index = oldStartIndex; index <= oldEndIndex; index++) {
      let oldVnode = oldChildren[index];
      if (oldVnode) {
        el.removeChild(oldVnode.el);
      }
    }
  }

  // 新节点的儿子，比老节点多
  if (newStartIndex <= newEndIndex) {
    for (let index = newStartIndex; index <= newEndIndex; index++) {
      let newVnode = newChildren[index];
      let ele = newChildren[index + 1] == null ? null : newChildren[index + 1].el;
      el.insertBefore(createElm(newVnode), ele);
    }

  }


}

function makeIndexByKey(children) {
  let map = {}
  children.forEach((item, index) => {
    if (item.key) {
      map[item.key] = index; // {A0,B:1,c:2,d:3}
    }
  });
  return map;
}