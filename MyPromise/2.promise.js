
// 1. 实现异步的promise
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
    if (this.states === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.states === 'rejected') {
      onRejected(this.value)
    }
    if (this.states === 'pending') {
      this.onResolvedCallbacks.push(onFulfilled)
      this.onrejectedCallbacks.push(onRejected)
    }
  }
}

//2. 实现异步的promise
function demo() {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject(2)
    }, 1000);
  })
}

demo().then((data) => {
  console.error(data, 'success')
}, (e) => {
  console.log(e, 'err')
})