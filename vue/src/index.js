import { initMixins } from "./init";
import { lifecycleMixin } from "./ lifecycle";
import { renderMixin } from "./vdom";

// 模版编译，响应式，domdiff
function Vue(options) {
  this.$options = options;

  this._init(options);

  if(options.el){
    this.$mount(options.el)
  }

}

// 在原型上添加 _init 方法
initMixins(Vue)
lifecycleMixin(Vue); // 混合生命周期 渲染
renderMixin(Vue);


export default Vue;