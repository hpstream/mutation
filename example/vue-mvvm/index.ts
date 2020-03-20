import Vue from './../../src/vue-mvvm/index'

window.app = new Vue({
  el: "#root",
  data() {
    return {
      msg: "hello"
    };
  }
});