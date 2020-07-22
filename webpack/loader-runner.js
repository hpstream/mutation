
let path = require('path');
let fs = require('fs');

let entry = "./src/main.js";
let options = {
  resource: path.join(__dirname, entry),//要加载的模块
  loaders: [
    path.join(__dirname, 'loaders/loader-a.js'),
    path.join(__dirname, 'loaders/loader-b.js'),
    path.join(__dirname, 'loaders/loader-c.js')
  ]
}
runLoaders(options, (err, result) => {
  console.log('result', result);
});

function createLoader(loaderPath) {
  var loaderFn = require(loaderPath)
}
function runLoaders(options,finishCallback) {
  // 1. 常见上下文
  let { resource, loaders } = options;
  loaders = loaders.map(createLoader)
  let loaderContext = {};
  loaderContext.loaderIndex = 0;
  loaderContext.resource = resource;
}
