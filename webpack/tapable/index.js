let { AsyncSeriesBailHook } = require('./tapable');

let hook = new AsyncSeriesBailHook(['name', 'age']);

console.time('cost');
hook.tapPromise('这是我的第1个监听', (name, age) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(10); resolve();
    }, 1000);
  });
});
hook.tapPromise('这是我的第2个监听', (reselt) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(reselt*2); resolve();
    }, 2000);
  });
});
hook.tapPromise('这是我的第3个监听', (reselt) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(reselt*2); resolve();
    }, 3000);
  });
});
// hook.promise('zhufeng', 10)
hook.promise('zhufeng', 10).then((result) => {
  console.log(result);
  console.timeEnd('cost');
});
