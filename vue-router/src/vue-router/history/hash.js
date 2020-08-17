import { History } from "./base";

class HashHistory extends History {
  constructor(router) {
    super(router);
    this.router = router;
    // 确保hash模式下 有一个/路径
  }
  getCurrentLocation() {
    // 这里也是要拿到hash值
  
  }
}

export default HashHistory