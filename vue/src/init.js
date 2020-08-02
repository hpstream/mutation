import { initState } from "./state";

export function initMixins(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    vm.$options = options
    // 初始化状态,主要处理options api 上的 props,data,methods,等
    initState(vm)
  }
}

