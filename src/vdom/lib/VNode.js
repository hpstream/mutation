
export default class VNode {
  constructor(type, data,children,text,elm){
    var { key, on, ...attrs } = data;
    this.type = type; // 如果是文本节点，把么type的值为空
    this.data = {
      key, on, attrs
    }
    this.children = children||[];
    this.text = text;
    this.elm = elm;
  }
  // 比较两个dom 是不是相同
  isSameVNode(oldVnode, newVnode) {
    return oldVnode.data.key === newVnode.data.key
      && oldVnode.type === newVnode.type;
  }
}