
// 3.promies 可以多个then 方法
class MyPromise {
  constructor(executor) {
    this._states = {
      pending: 'pending',
      fulfilled: 'fulfilled',
      rejected: 'rejected'
    }
    this.states = this._states.pending
    this.value = undefined;
    this.onResolvedCallbacks = []
    this.onrejectedCallbacks = []

    try {
      executor(this.onFulfilled.bind(this), this.onRejected.bind(this))
    } catch (error) {
      this.onRejected(error)
    }

  }
  onFulfilled(data) {
    this.states = this._states.fulfilled
    this.value = data;
    this.onResolvedCallbacks.forEach(fn => {
      fn(this.value)
    });
  }
  onRejected(e) {
    this.states = this._states.rejected
    this.value = e;
    this.onrejectedCallbacks.forEach(fn => {
      fn(this.value)
    });
  }
  then(onFulfilled, onRejected) {
    let promise2 =  new MyPromise((resolve, reject) => {
      var x = null;
      if (this.states === 'fulfilled') {
        x = onFulfilled(this.value)
        this.resolvePromise(promise2, x, resolve, reject);
    
      }
      if (this.states === 'rejected') {
        x = onRejected(this.value)
        this.resolvePromise(promise2, x, resolve, reject);
      }
      if (this.states === 'pending') {
        this.onResolvedCallbacks.push(() => {
          x = onFulfilled(this.value)
          this.resolvePromise(promise2, x, resolve, reject);
        })
        this.onrejectedCallbacks.push(() => {
          x = onRejected(this.value)
          this.resolvePromise(promise2, x, resolve, reject);
        })
      }
    })

    return promise2
  }
  resolvePromise(promies, x, resolve, reject){
    if (promies === x){
      return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise){
      // let then = x.then;
      x.then((data)=>{
        this.resolvePromise(promies, data, resolve, reject)
      },(e)=>{
          reject(e); // 只要失败就失败
      })
    }else{
      resolve(x)
    }
  }
}
// 思路：
// 1.由于状态只有从padding 到 resolved ，或者reject。所以每次then应该产生一个新的promise
// 2. resolved的 返回值有可能是一个 基础类型，有可能是一个promise。 如果是promise的话，那不应该直接返回
// promise 而是promise 执行的值。

function demo() {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, 1000);
  })
}

function demo1() {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(new MyPromise((resolve, reject) => {
        setTimeout(() => {
          resolve(1)
        }, 1000);
      }))
    }, 2000);
  })
}

var p = demo().then((data) => {
  console.log(data)
  // return demo1()
}, (e) => {
    return new Error('typeError')
})

// p.then((x) => {
//   if (x instanceof MyPromise) {
//     // let then = x.then;
//     x.then((data) => {
//       console.error(data, '第二次 success')
//     }, (e) => {
//       reject(e); // 只要失败就失败
//     })
//   } 
 
// }, (e) => {
//   console.log(e, '第二次 err')
// })