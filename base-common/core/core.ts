export interface WbPlugin {
  name: string;
  fn:Function
}


export class Core {
  // 插件注册
  install(name: string, Fn: Function) {
    return  this
  }
  use(wbPlugins: WbPlugin[]) {}
}

// 改为工厂模式导出

export function createCore() {
  return new Core();
}
