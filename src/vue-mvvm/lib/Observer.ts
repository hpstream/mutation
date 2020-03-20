import Dep from "./Dep";
interface PropertyDescriptor {
  configurable?: boolean;
  enumerable?: boolean;
  value?: any;
  writable?: boolean;
  get?(): any;
  set?(v: any): void;
}
export function proxy(
  source: Record<string, any>,
  target: Record<string, any>
): void {
  if (typeof target == "object") {
    Object.keys(source).forEach(key => {
      defineReactive(target, key, {
        get: function proxygetter() {
          return source[key];
        },
        set: function proxySetter(newVal) {
          source[key] = newVal;
        }
      });
    });
    return;
  }
}

function defineReactive(
  vm: Record<string, any>,
  key: string,
  descriptor: PropertyDescriptor
) {
  Object.defineProperty(vm, key, {
    enumerable: true,
    ...descriptor
  });
}

export class Observer {
  data: Record<string, any>;
  constructor(data) {
    this.data = data;
    this.init();
  }
  init() {
    Object.keys(this.data).forEach(key => {
      var dep = new Dep();
      var val = this.data[key];
      defineReactive(this.data, key, {
        get() {
          dep.depend();
          return val;
        },
        set(newvalue) {
          val = newvalue;
          dep.notify();
        }
      });
    });
  }
}
