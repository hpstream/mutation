import { initMixins } from "./init";
import { lifecycleMixin, callHook } from "./ lifecycle";
import { renderMixin } from "./vdom";
import { initGlobalApi } from "./global-api";
import { stateMixin } from "./state";

// 模版编译，响应式，domdiff
function Vue(options) {
  this.$options = options;
  // 初始化数据 data;
  this._init(options);


  if(options.el){
    this.$mount(options.el)
  }

}

// 在原型上添加 _init 方法
initMixins(Vue)
lifecycleMixin(Vue); // 混合生命周期 渲染
renderMixin(Vue);
stateMixin(Vue)


// 静态方法 Vue.component Vue.directive Vue.extend Vue.mixin ...
initGlobalApi(Vue)


export default Vue;