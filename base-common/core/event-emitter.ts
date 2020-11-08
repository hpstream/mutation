class EventEmitter {
  listeners: Record<string, Function> = {};
  constructor() {}
  on(eventName: string, cb: Function) {}
  emit(eventName: string,...data:any[]) {}
}

export function createEventEmitter() {
  return new EventEmitter();
}
