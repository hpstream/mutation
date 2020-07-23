
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
  // loader 一些信息
  var loaderObject = { data: {} };
  loaderObject.loaderPath = loaderPath
  loaderObject.normal = require(loaderPath)
  loaderObject.pitch = loaderObject.normal.pitch
  return loaderObject
}
// 执行pitch ， 执行normalLoader
function runLoaders(options, finishCallback) {
  // 1. 常见上下文
  let { resource, loaders } = options;
  loaders = loaders.map(createLoader)
  let loaderContext = {};
  loaderContext.loaderIndex = 0;
  loaderContext.resource = resource;
  loaderContext.loaders = loaders;
  loaderContext.isSync = true;

  loaderContext.callback = function next(err, source) {
    isSync = true;
    loaderContext.loaderIndex--;
    iterateNormalLoaders(loaderContext, source, finishCallback)
  }
  loaderContext.async = () => {
    isSync = false;
    return loaderContext.callback
  }
  // reminingRequest 之后的
  // previousRequest
  Object.defineProperty(loaderContext, 'reminingRequest', {
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex + 1)
        .map((laoder) => laoder.loaderPath).join('!')
    }
  })
  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaderContext.loaders.slice(0, loaderContext.loaderIndex)
        .map((laoder) => laoder.loaderPath).join('!')
    }
  })
  Object.defineProperty(loaderContext, 'data', {
    get: function () {//当前索引一直到最后
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    }
  });


  // 执行 pitch 方法
  iteratePitchingLoaders(loaderContext, finishCallback);
}


function iterateNormalLoaders(loaderContext, code, callback) {
  if (loaderContext.loaderIndex < 0) {
    return callback(null, code);
  };
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  let normalfn = currentLoader.normal;
  let result;
  if (normalfn.raw) {
    result = normalfn.apply(loaderContext, [code])
  } else {
    result = normalfn.apply(loaderContext, [code.toString('utf8')])
  }

  if (!loaderContext.isSync) return;
  if (result) {
    loaderContext.loaderIndex--;
    iterateNormalLoaders(loaderContext, result, callback)
  }
}

function processResource(loaderContext, callback) {
  let buffer = fs.readFileSync(loaderContext.resource);
  return iterateNormalLoaders(loaderContext, [buffer], callback)
}

// 如果异步就凉了，需要换成递归
function iteratePitchingLoaders(loaderContext, finishCallback) {
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    loaderContext.loaderIndex--;
    processResource(loaderContext, finishCallback);
    return;
  }
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  let pitchfn = currentLoader.pitch;
  if (!pitchfn) {
    loaderContext.loaderIndex++;
    iteratePitchingLoaders(loaderContext, finishCallback)
  }
  let reseult = pitchfn.apply(loaderContext, [loaderContext.reminingRequest, loaderContext.previousRequest, currentLoader.data])

  if (reseult) {
    loaderContext.loaderIndex--;
    iterateNormalLoaders(loaderContext, finishCallback);
  } else {
    loaderContext.loaderIndex++;
    iteratePitchingLoaders(loaderContext, finishCallback)
  }

}