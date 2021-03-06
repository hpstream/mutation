import { initState } from "./state";
import { compileToFunction } from "./compiler";
import { mountComponent } from "./ lifecycle";
import { mergeOptions } from "./mergeOptions";

export function initMixins(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    vm.$options = options
    vm.$options = mergeOptions(vm.constructor.options||{}, options);
    // 初始化状态
    callHook(vm, 'beforeCreate');
     // 初始化状态,主要处理options api 上的 props,data,methods,等
    initState(vm);
    callHook(vm, 'created');
  }

  Vue.prototype.$mount = function(el) {
    let vm = this, render;
    const options = vm.$options;
    el = document.querySelector(el);
   
    // if (!el){
    //  console.error(new Error(`el 节点不存在`))
    // }
    // 处理参数： render ,template;

    if (!options.render) {
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;
      }
      // template => render方法
      // 1.处理模板变为ast树 2.标记静态节点 3.codegen=>return 字符串 4.new Function + with (render函数)
      const render = compileToFunction(template);
      options.render = render
    }

    // 需要挂载这个组件
    mountComponent(vm, el);
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm);
    }
  }
}