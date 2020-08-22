import { applyMixin } from "./mixin";
import { forEachValue } from "./utils";

let Vue;


export function install(_vue) {
  Vue = _vue;
  applyMixin(Vue)
}


export class Store {
  constructor(options) {
    // let { state, getters } = options;
    this.getters = {};
    this.mutations = {};
    this.actions = {};
    const computed = {}
    forEachValue(options.getters, (fn, key) => {
      computed[key] = () => {
        return fn(this.state);
      }
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key]
      })
    });

    forEachValue(options.mutations, (fn, key) => {
      this.mutations[key] = (payload) => fn.call(this, this.state, payload)
    });

    forEachValue(options.actions, (fn, key) => {
      this.actions[key] = (payload) => fn.call(this, this, payload)
    });
    this._vm = new Vue({
      data: {
        $$state: options.state,
      },
      computed

    });
  }
  get state() {
    return this._vm._data.$$state;
  }
  commit = (type, payload) => {
    this.mutations[type](payload);
  }
  dispatch = (type, payload) => {
    this.actions[type](payload)
  }


}



