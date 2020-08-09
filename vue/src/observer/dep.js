var id = 0;
class Dep {
  constructor() {
    this.subs = [];
    this.id = id++;
  }
  depend() {
    // watch 增加deep 依赖关系
    Dep.target.addDep(this);
    this.addSub(Dep.target)
  }
  addSub(watcher) {
    var flag = this.subs.find(sub => sub.id === Dep.target.id)
    if (!flag) {
      this.subs.push(Dep.target)
    }
  }
  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}

export default Dep;

let stack = [];
export function pushTarget(watcher) {
  Dep.target = watcher;// 保留watcher
  stack.push(watcher); // 有渲染watcher 其他的watcher

}

export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1]; // 将变量删除掉
}