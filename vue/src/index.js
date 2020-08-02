import { initMixins } from "./init";

export interface Vue {
  name: string;
}

export function Vue() {
  this.name = "11";
}

// initMixins(Vue)
