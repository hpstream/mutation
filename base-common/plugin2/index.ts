import { WbPlugin } from './../core/core';
import { wbEventEmitter } from "../wbCore/index";


function plugin2Fn() {
  wbEventEmitter.on('test',(data)=>{
    console.log(data);
  })
}



export var plugin2: WbPlugin = {
  name: "plugin2",
  fn: plugin2Fn,
};