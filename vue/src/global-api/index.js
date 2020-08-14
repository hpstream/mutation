import { mergeOptions } from "../util";
import initExtend from "./extend";


export function initGlobalApi(Vue) {
  Vue.options = {};

  Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options,mixin)
  }
  // _base 就是Vue的构造函数
  Vue.options._base = Vue; // 存储构造函数
  Vue.options.components = {} // 存储全局组件
  
  initExtend(Vue)

  Vue.component = function (id, definition) {
      definition.name = definition.name || id;
      // 生成一个构造函数
      let ctor = this.options._base.extend(definition)

      this.options.components[id] = ctor;
  }

}