
// 1. 实现同步的promise
class MyPromise {
  constructor(executor) {
    this._states = {
      pending: 'pending',
      fulfilled: 'fulfilled',
      rejected: 'rejected'
    }
    this.states = this._states.pending
    this.value = undefined;

    try {
      executor(this.onFulfilled.bind(this), this.onRejected.bind(this))
    } catch (error) {
      this.onRejected(error)
    }

  }
  onFulfilled(data) {
    this.states = this._states.fulfilled
    this.value = data;
  }
  onRejected(e) {
    this.states = this._states.rejected
    this.value = e;
  }
  then(onFulfilled, onRejected) {
    if (this.states === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.states === 'rejected') {
      onRejected(this.value)
    }
  }
}

// 测试
function demo() {
  return new MyPromise((resolve, reject) => {
    resolve(2)
  })
}

demo().then((data) => {
  console.log(data,'success')
}, (e) => {
  console.log(e,'err')
})

