function createRoute(record, location) {
  var res = [];

  while (record) {
    res.unshift(record)
    record=record.parent
  }

  return {
    ...location,
    matched: res
  }
}
function runQueue(queue, iterator, cb) {
  // 异步迭代
  function step(index) { // 可以实现中间件逻辑
    if (index >= queue.length) return cb();
    let hook = queue[index]; // 先执行第一个 将第二个hook执行的逻辑当做参数传入
    iterator(hook, () => step(index + 1));
  }
  step(0);
}
class History {
  constructor(router) {
    this.router = router;// router 实例
    this.current = createRoute(null, { // 存放路由状态的
      path: '/'
    });
  }
  transitionTo(location, onComplete){
    //location  a/b/c
    //onComplete 函数
    // 路径变化了 视图还要刷新 ，  响应式的数据原理
    let route = this.router.match(location); // {'/'.matched:[]}
    if (location == this.current.path && route.matched.length == this.current.matched.length) { // 防止重复跳转
      return
    }
    let queue = [].concat(this.router.beforeHooks); // 拿到了注册方法 

    const iterator = (hook, next) => {
      hook(this.current, route, () => {
        next();
      })
    }
    runQueue(queue, iterator, () => {
      // 在更新之前先调用注册好的导航守卫

      this.updateRoute(route);
      // 根据路径加载不同的组件  this.router.matcher.match(location)  组件 
      // 渲染组件
      onComplete && onComplete();
    })

  }
  updateRoute(route) {
    // 每次你更新的是current
    this.current = route; // 每次路由切换都会更改current属性
    this.cb && this.cb(route); // 发布
    // 视图重新渲染有几个要求? 1.模板中要用  2.current得是响应式的
  }
  listen(cb) {
    this.cb = cb;
  }
}

export {
  History,
  createRoute
}