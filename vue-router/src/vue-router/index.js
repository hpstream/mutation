import install from "./install"
import HashHistory from "./history/hash";
import BrowserHistory from "./history/history";
import createMatcher from "./create-matcher";

class VueRouter {
  constructor(options) {
    // mode , routes
    var { mode, routes } = options
    // returen match addRouter 方法
    this.matcher = createMatcher(routes||[]) 

    switch (mode) {
      case 'hash':
        this.history = new HashHistory(this)
        break;
      case 'histroy':
        this.history = new BrowserHistory(this)
        break;
      default:
        break;
    }

    this.beforeHooks = [];
  }
  init(app) { 
    // 监听hash值变化 默认跳转到对应的路径中
    const history = this.history;
    const setUpHashListener = () => {
      history.setupListener(); // 监听路由变化 hashchange
    }
    // 初始化 会先获得当前hash值 进行跳转, 并且监听hash变化
    history.transitionTo(
      history.getCurrentLocation(), // 获取当前的位置
      setUpHashListener
    )
    history.listen((route) => { // 每次路径变化 都会调用此方法  订阅
      app._route = route;
    });
  }
  push(to) {
    this.history.push(to);
  }
  match(location) {
    return this.matcher.match(location);
  }
  beforeEach(fn) {
    this.beforeHooks.push(fn);
  }
}

VueRouter.install = install


export default VueRouter