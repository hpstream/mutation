import { observe } from "./observer";
import { nextTick } from "./util";
import Watcher from "./observer/Watcher";
import Dep from "./observer/dep";

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
  for (let key in methods) {
    vm[key] = methods[key].bind(this)
  }
}
function initData(vm) {

  // 转换成响应式数据
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  for (let key in data) { // 将数据代理到vm 上
    proxy(vm, '_data', key)
  }
  observe(data)

}
function initComputed(vm) {

  let computedfn = vm.$options.computed;
  let computedWatcher = vm._computedWatcher = {}

  Object.keys(computedfn).forEach((key) => {
    var setter = computedfn[key];
    computedWatcher[key] = new Watcher(vm, setter, () => { }, { lazy: true })
    defineComputed(vm, key, setter)

  })
}
function defineComputed(targe, key, fn) {
  var handle = {
    enumerable: true,
    configurable: true,
    get: createComputedGetter(key)

  }
  Object.defineProperty(targe, key, handle)

}
function createComputedGetter(key) {
  return function () {

    const watcher = this._computedWatcher[key]; // 拿到这个属性对应watcher
  
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate(); // 对当前watcher求值
      }
      if (Dep.target){
        watcher.depend();
      }
     
      return watcher.oldvalue
    }
  }
}
function initWatch(vm) {
  let watchfn = vm.$options.watch

  Object.keys(watchfn).forEach((key) => {
    vm.$watch(key, watchfn[key])
  })
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
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