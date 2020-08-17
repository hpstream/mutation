import install from "./install"
import HashHistory from "./history/hash";
import BrowserHistory from "./history/history";
import createMatcher from "./create-matcher";

class VueRouter {
  constructor(options) {
    // mode , routes
    var { mode, routes } = options
    this.mather = createMatcher(routes||[]) 

    switch (mode) {
      case 'hash':
        this.history = new HashHistory()
        break;
      case 'histroy':
        this.history = new BrowserHistory()
        break;
      default:
        break;
    }
  }
  init(app) { 
    console.log(app)
  }
}

VueRouter.install = install


export default VueRouter