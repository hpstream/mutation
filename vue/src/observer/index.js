import { arrayMethods } from "./array";

class Observe {
  constructor(data){
    
    this.$data = data;
    
    if (typeof data !=='object') return ;
    // data.__ob__ = this; // 这样写会死循环，注意
    Object.defineProperty(data, '__ob__', {
      enumerable: false,
      configurable: false,
      value: this
    });
    if (Array.isArray(data)){
      data.__proto__ = arrayMethods; // 重写数组原型方法
      this.observeArray(data);
    }else{
      this.walk(data);
    }
   
  }
  observeArray(data){
    data.forEach((item)=>{
      observe(item)
    })
  }
  walk(data){
    for(let key in data){
      defineReactive(data, key, data[key])
    }
  }
}

// 响应式 函数
function defineReactive(data, key, value) {
    if (typeof value === 'object') observe(value);
    Object.defineProperty(data,key,{
      get:function getters(){
        return value
      },
      set: function setters(newValue){
        if (newValue === value) return ;
        // 如果是数组怎么办？

        // 如果是对象怎么办
        value = newValue
      }
    })
}

export function observe(data) {
  if (data['__ob__']) return ;
  return new Observe(data)
}