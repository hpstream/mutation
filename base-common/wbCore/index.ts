import { Core } from "./../core/core";
import { createCore, createEventEmitter } from "../core/index";

export interface wbCore extends Core {
  abc: () => void;
}
export var wb: wbCore = (createCore() as any) as wbCore; ;
export var wbEventEmitter = createEventEmitter();

// createEventEmitter;



