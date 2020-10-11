// let toString = Function.prototype.toString

// function isString(obj) {
//   return toString.call(obj) == `[object String]`
// }

// function isFunction(obj) {
//   return toString.call(obj) == `[object Function]`
// }

// function isType(type) {
//   return function (obj) {
//     return toString.call(obj) == `[object type]`
//   }
// }
// var isString = isType('String')
// var isFunction = isType('Function')

// 由于js的主线程是单线程，所以为了防止线程阻塞，需要采取异步的方式写代码。
// 但是过多的异步，会导致代码晦涩难懂。所欲需要创建同步变成的语法，但是本质上异步的。
// 异步代码形式
// 1. 发布订阅
// 2. 哨兵变量
// 3.
// import { EventEmitter } from "events";
// // let EventEmitter = require("events");
// // import fs from 'fs'
// let eve = new EventEmitter();

// var html:any = {};
// eve.on("ready", function (key, value) {
//   html[key] = value;
//   if (Object.keys(html).length == 2) {
//     console.log(html);
//   }
// });

// setTimeout(() => {
//   eve.emit('ready','a','a')
// }, 1000);

// setTimeout(() => {
//   eve.emit("ready", "b", "b");

// }, 1000);

function* foo() {
  var index = 0;
  var result = 0;
  while (index <= 5) {
    yield index++; result+=index;
    console.log(result);
  }
  return result;
}
// var bar = foo(); // 返回的是一个迭代器

// console.log(bar.next());
// console.log(bar.next());
// console.log(bar.next());

function co(gen: Function): Promise<any> {
  // 存放一个迭代器
  var it: Generator = gen();
  return new Promise((resolve, reject) => {
    (function next(val: any) {
      var {done,value} = it.next();
      if(done){
          resolve(value)
      }else{
      Promise.resolve(value).then(next, (err) => reject(err));
      }
    })(undefined);
  });
}

co(foo).then((res)=>{
  console.log(res)
})
