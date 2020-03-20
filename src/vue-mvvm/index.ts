import { MvvmOptions } from "./type/index";
import { Observer, proxy } from "./lib/Observer";
import Compile from "./lib/Compile/index";
import { h, render } from "./../vdom/index";

export default class Vue {
  private $options: MvvmOptions;
  private _data = {};
  private $data = {};
  public $el: Element;

  constructor(options: MvvmOptions) {
    this.$options = options;
    this._init();
  }
  _init() {
    // 1. 初始化方法
    this.initMethods();

    // 2. 初始化数据
    this.initData();

    // 3. 编译模版
    this._compile();

    // 4. 渲染都没
    this._update();
  }

  initMethods() {
    let selfMethods = this.$options.methods;
    if (selfMethods) {
      Object.keys(selfMethods).forEach(key => {
        this[key] = selfMethods[key].bind(this);
      });
    }
  }
  initData() {
    this._data = this.$options.data.call(this);
    new Observer(this._data);
    proxy(this._data,this);
    // proxy(this._data, this.$data);
    
    console.log(this)
  }
  _compile() {
       const { el } = this.$options;
       if (!this.$options.render) {
         this.$el = document.querySelector(el);
         this.$options.render = Compile.render(this.$el.outerHTML) as any;
         this.$el.innerHTML = ''
       }
  }
  _update() {
   var vnode = this.$options.render.call(this, h);
   console.log(vnode);
   render(vnode, this.$el);
  }
}
