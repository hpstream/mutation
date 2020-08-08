export function patch(oldVnode, vnode) {
  // 将虚拟节点转化成真实节点
  let el = createElm(vnode); // 产生真实的dom 
  let parentElm = oldVnode.parentNode; // 获取老的app的父亲 =》 body
  parentElm.insertBefore(el, oldVnode.nextSibling); // 当前的真实元素插入到app的后面
  parentElm.removeChild(oldVnode); // 删除老的节点
  return el
}

function createElm(vnode) {
  let { tag, children, key, data, text } = vnode;
  if (typeof tag == 'string') { // 创建元素 放到vnode.el上
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

function updateProperties(vm) {
  let el = vm.el;
  let attrs = vm.data;
  if (!attrs) return;
  Object.entries(attrs).forEach(attrs => {
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