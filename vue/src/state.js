import { observe } from "./observer";
import { nextTick } from "./util";
import Watcher from "./observer/Watcher";

export function initState(vm) {
  const opts = vm.$options
  // props
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.data) {
    // 初始化data
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

function initProps() { }
function initMethod(vm) {
  let methods = vm.$options.methods
  for (let key in methods){
    vm[key] = methods[key].bind(this)
  }
 }
function initData(vm) { 
  
  // 转换成响应式数据
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm):data;

  for(let key in data){ // 将数据代理到vm 上
    proxy(vm,'_data',key)
  }
  observe(data)

}
function initComputed(vm) {

  let computedfn =  vm.$options.computed;
  
  Object.keys(computedfn).forEach((key)=>{
    Object.defineProperty(vm, key,{
      get(){
        return computedfn[key].call(vm)
      },
      set(value){
        throw new Error('计算属性不能修改')
      }
    })
  })
}
function initWatch(vm) {
  let watchfn = vm.$options.watch

  Object.keys(watchfn).forEach((key) => {
    vm.$watch(key, watchfn[key])
  })
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key,{
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    }
  })
}

export function stateMixin(Vue) {
  Vue.prototype.$nextTick = function (cb) {
    nextTick(cb);
  }


  Vue.prototype.$watch = function (exprOrFn, cb, options = {}) {
    let watcher = new Watcher(this, exprOrFn, cb, { ...options, user: true });
    if (options.immediate) {
      cb(); // 如果是immdiate应该立刻执行
    }
  }
  
}