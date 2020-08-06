import { patch } from "./vdom/patch";
import Watcher from "./observer/Watcher";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    vm.$el = patch(vm.$el, vnode)
  }
}


export function mountComponent(vm, el) {
  // 调用render方法去渲染 el属性
  // 先调用render方法创建虚拟节点，在将虚拟节点渲染到页面上
  vm.$el = el;
  callHook(vm, 'beforeMount')
  let updateComponent = () => {
    // 将虚拟节点 渲染到页面上
    vm._update(vm._render());
  }
  new Watcher(vm, updateComponent, () => { 
    callHook(vm, 'beforeUpdate')
  }, true);
  callHook(vm, 'mounted');

}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]; // vm.$options.created  = [a1,a2,a3]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm); // 更改生命周期中的this
    }
  }
}