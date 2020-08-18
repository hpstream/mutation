import link from "./components/link";
import view from "./components/view";

export let Vue ;

export default function install(_Vue) {
  Vue = _Vue;


  Vue.mixin({
    beforeCreate() {
      if(this.$options.router){
        // 跟节点
        this._routerRoot = this;
        this._router = this.$options.router
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      }else{
        this._routerRoot = this.$parent && this.$parent._routerRoot;
      }
    },
    
  })
  Vue.component('router-link',link);
  Vue.component('router-view', view);

  // 代表路由中所有的属性
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route; // path  matched
    }
  })
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router; // 方法 push go repace..
    }
  });

}