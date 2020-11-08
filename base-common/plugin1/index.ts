import { WbPlugin } from './../core/core';
import { wbEventEmitter } from './../wbCore/index';


function plugin1Fn() {
    wbEventEmitter.emit('test','2345')
}

  
export var plugin1: WbPlugin = {
  name: "plugin1",
  fn: plugin1Fn,
};