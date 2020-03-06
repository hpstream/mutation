let nextUnitOfWork = null;

function workLoop(deadline) {
  // 有任务，并且当前帧还没结束 
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 获取下⼀个任务单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

  }

  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  // 判断有没有dom，就不是入口，直接创建dom
  if (!fiber.dom) {
    fiber.dom = vdomToElement(fiber)
  }
  // fiber⽗父元素
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  // ⼦元素遍历， 把children数组，变成链表
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null
  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: {
        ...element.data,
        children: element.children,
        text: element.text
      },
      parent: fiber,
      dom: null,
      sibling: null
    }
    // 第⼀一个
    if (index === 0) {
      fiber.child = newFiber
    } else {
      // 其他通过sibling
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
    index++
  }

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function render(vdom, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [vdom],
    }
  }
}
function vdomToElement(vdom) {
  var type = vdom.type;
  var { key, on = {}, attrs = {}, children, text } = vdom.props;
  // 如果是文本节点
  if (text) {
    return createTextNode(vdom)
  }
  var ele = createElement(vdom);
  // 处理属性
  Object.keys(attrs).forEach((key) => {
    setAttr(ele, key, attrs[key])
  })
  // 处理事件
  Object.keys(on).forEach((key) => {
    setEvent(ele, key, on[key])
  })
  // // 处理孩子节点
  // children.forEach((child) => {
  //   ele.appendChild(vdomToElement(child))
  // })

  return ele
}

function setAttr(ele, key, val) {
  switch (key) {
    case 'className':
      key = 'class'
      break;

    default:
      break;
  }

  switch (ele.tagName.toLocaleLowerCase()) {
    case 'textarea':
    case 'input':
      ele.value = val || '';
      break;

    default:
      if (val) {
        ele.setAttribute(key, val)
      } else {
        ele.removeAttribute(key)
      }
      break;
  }
}

function setEvent(ele, key, val) {
  var fn;
  // ele.removeEventListener(key, val) 
  function go() {
    if (fn) {
      ele.removeEventListener(key, fn);
    }
    fn = val;
    ele.addEventListener(key, val, false)
  }
  go();
}
// 删除节点
function deleteElement(parent, node) {
  parent.removeChild(node);
}

// 创建文本节点
function createTextNode(vdom) {
  var elm = document.createTextNode(vdom.props.text)
  vdom.elm = elm;
  return elm;
}

function createElement(vdom) {
  var { type } = vdom;
  var elm = document.createElement(type)
  vdom.elm = elm;
  return elm;

}

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber =
    wipFiber.alternate &&
    wipFiber.alternate.child
  let prevSibling = null
  while (index < elements.length || oldFiber != null) {
    const element = elements[index] 
    let newFiber = null
    // 对⽐比old和new
    const sameType = oldFiber && element && element.type == oldFiber.type
    if (sameType) {
      // TODO update the node
    }
    if (element && !sameType) {
      // TODO add this node
    }
    if (oldFiber && !sameType) {
      // TODO delete the oldFiber's node
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber

    index++
  }
}


function useState(init) {
  const oldHook =
    wipFiber.base &&
    wipFiber.base.hooks &&
    wipFiber.base.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : init,
    queue: [],
  }
  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action
  })
  const setState = action => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      base: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }
  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}
export {
  render
}

