class Dep {
  constructor() {
    this.subs = [];
  }
  depend() {
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