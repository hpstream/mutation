import { initMixins } from "./init";


function Vue(options) {
  this.$options = options;

  this._init(options);

}

// 在原型上添加 _init 方法
initMixins(Vue)


export default Vue;