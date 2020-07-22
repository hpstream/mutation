/**
 * loader其实就 是一个转换函数
 */
const babel = require('@babel/core');
function loader(source,inputSourceMap){
   console.log('inputSourceMap',inputSourceMap);
    return source;
}

module.exports = loader;

//sourcemap   source-map 把源码代和压缩后的代码的映射文件
// 原始文件内容=> loader1=> loader2 =>loader3