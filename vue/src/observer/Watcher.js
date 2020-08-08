import Dep from "./dep";
import { nextTick } from "../util";

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options = {}) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.deps = []; // watcher记录有多少dep依赖他
    this.depsId = new Set();
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
    this.oldvalue = this.get();
  }
  get() {
    Dep.target = this;
    var newValue = this.getter();
    Dep.target = null;
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
  update() {
    queueWatcher(this)
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