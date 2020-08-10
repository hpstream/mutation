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


  if (options.el) {
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


// 测试 diff 算法
import { compileToFunction } from "./compiler";
import { createElm, patch } from './vdom/patch'
let vm1 = new Vue({ data: { name: 'zf' } });
let render1 = compileToFunction(`<div>
   <li style="background:red" key="A">A</li>
</div>`);
let vnode1 = render1.call(vm1); // render方法返回的是虚拟dom

document.body.appendChild(createElm(vnode1))

let vm2 = new Vue({ data: { name: 'jw' } });
let render2 = compileToFunction(`<div>
   <li style="background:red" key="A">A</li>
</div>`);
let vnode2 = render2.call(vm2); // render方法返回的是虚拟dom

// 用新的虚拟节点对比老的虚拟节点，找到差异 去更新老的dom元素


setTimeout(() => {
  patch(vnode1, vnode2); // 传入新的虚拟节点和老的 做一个对比
}, 3000);


export default Vue;