import Dep, { pushTarget, popTarget } from "./dep";
import { nextTick } from "../util";

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options = {}) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.deps = []; // watcher记录有多少dep依赖他
    this.depsId = new Set();
    this.lazy = options.lazy; // 计算属性的标记
    this.dirty = this.lazy ; // 计算属性是否可以修改的标记
      if(typeof exprOrFn == 'function') {
      this.getter = exprOrFn;
    }else {

      this.getter = function () {
        let path = exprOrFn.split('.')
        let obj = vm;
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]];
        }
        return obj;
      };
    }
    this.cb = cb;
    this.options = options;
    this.user = options.user; // 这是一个用户watcher
    this.id = id++;
    this.oldvalue = this.dirty ? void 0 : this.get();
  }
  get() {
    pushTarget(this);
    var newValue = this.getter.call(this.vm);
    popTarget()
    return newValue
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id)
    }
  }
  run() {
    var newValue = this.get();
    let oldValue = this.oldValue;
    this.oldValue = newValue; // 更新一下老值

    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
  evaluate(){   
    this.oldvalue = this.get()
    this.dirty = false;
  }
  update() {
    if(this.lazy){
      this.dirty = true;
    }else{
      queueWatcher(this)
    }
  
  }
  depend() {
    // 计算属性watcher 会存储 dep  dep会存储watcher

    // 通过watcher找到对应的所有dep，让所有的dep 都记住这个渲染watcher
    let i = this.deps.length;
    while (i--) { // 执行依赖手机
      this.deps[i].depend(); // 让dep去存储渲染watcher
    }
  }
}

let queue = [];
let has = {}
let padding = false;

function flushSchedulerQueue() {
  queue.forEach((w) => w.run())
  queue = [];
  has = {};
  padding = false;
}

function queueWatcher(watch) {
  const id = watch.id;
  if (!has[id]) {
    queue.push(watch);
    has[id] = true;
  }

  if (!padding) {

    nextTick(flushSchedulerQueue);
    padding = true;
  }



}





export default Watcher;