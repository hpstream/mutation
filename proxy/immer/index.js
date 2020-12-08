var is = {
  isObject: (val) => Object.prototype.toString.call(val) === '[object Object]',
  isArray: (val) => Array.isArray(val),
  isFunction: (val) => typeof val === 'function'
}
const INTERNAL = Symbol('INTERNAL');

function produce(baseState, producer) {
  const proxy = toProxy(baseState);

  producer(proxy)
  const internal = proxy[INTERNAL];
  return internal.mutated ? internal.draftState : baseState;
}

function toProxy(baseState,valueChange) {
  var keyToProxy = {};
  var internal = {
    draftState: createDraftState(baseState),
    mutated: false
  }
  return new Proxy(baseState, {
    get(target, key) {
      if (key === INTERNAL) {
        return internal
      }
      const value = target[key];
      if (is.isObject(value) || is.isArray(value)) {
        if (key in keyToProxy){
            return keyToProxy[key];
        }else{
          keyToProxy[key] = toProxy(value,()=>{
            internal.mutated = true;
            const proxyOfChild = keyToProxy[key];
            var {draftState} = proxyOfChild[INTERNAL];
            internal.draftState[key] = draftState;
            valueChange && valueChange()
          })
          return keyToProxy[key];
        }
      }

      return internal.mutated ? internal.draftState[key] : baseState[key];
    },
    set(target, key, value) {
      internal.mutated = true;
      let {draftState}= internal;
      draftState[key] = value;
      valueChange && valueChange()
      return true
    }
  })
}

// 浅复制
function createDraftState(baseState) {
  if (is.isArray(baseState)) {
    return [...baseState];
  } else if (is.isObject(baseState)) {
    return Object.assign({}, baseState);
  } else {
    return baseState;
  }
}

module.exports = {
  produce
}