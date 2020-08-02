

let oldArrayMethods = Array.prototype;

export let arrayMethods = Object.create(oldArrayMethods)
let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
];

methods.forEach(methodName => {

  arrayMethods[methodName] = function (...args) {
    
    let result = oldArrayMethods[methodName].apply(this, args); // apply 跟着数组
    var ob = this.__ob__;
    let inserted;
    switch (methodName) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2)
      default:
        break;
    }
    // console.log(methodName, args)
    if (inserted) ob.observeArray(inserted); // 对新增的每一项进行观测
    return result
  }
});