import { initState } from "./state";
import { compileToFunction } from "./compiler";
import { mountComponent } from "./ lifecycle";

export function initMixins(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    vm.$options = options
    // 初始化状态,主要处理options api 上的 props,data,methods,等
    initState(vm)
  }

  Vue.prototype.$mount = function(el) {
    let vm = this, render;
    const options = vm.$options;
    el = document.querySelector(el);
   
    if (!el){
     console.error(new Error(`el 节点不存在`))
    }
    // 处理参数： render ,template;
    if (!vm.render){
      if(vm.template) {
        render = compileToFunction(vm.template);
      }else{
        render = compileToFunction(el.outerHTML);
      }
    }
    options.render = render

    console.log(vm,el)
    // 需要挂载这个组件
    mountComponent(vm, el);
  }
}

