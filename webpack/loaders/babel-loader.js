/**
 * loader其实就 是一个转换函数
 */
const babel = require('@babel/core');
function loader(source,inputSourceMap){
    //babel-loader2!babel-loader!文件路径  ./src/main.js
    console.log('this.request',this.request);
    console.log('filename',this.request.split('!').pop().split('\\').pop());
    let options = {
        presets:["@babel/preset-env"],
        inputSourceMap,
        sourceMaps:true,//告诉 babel也要生成sourceMap文件
        //loader上下文对象(this).request 当前的请路径
        //取出要转换的文件的文件名
        filename:this.request.split('!').pop().split('/').pop()
    }
    //code转义后的代码 map映射文件 ast抽象语法树
    let {code,map,ast} = babel.transform(source,options);
    //return code;
    //如果我只返回一个值,可以直接return,如果想返回多个值,就可以通过this.callback返回
    return this.callback(null,code,map,ast);
}

module.exports = loader;

//sourcemap   source-map 把源码代和压缩后的代码的映射文件
// 原始文件内容=> loader1=> loader2 =>loader3

//1 =>loader1 => 2 => loader2 (1=2) =>3(2=3)
//浏览器里调试的时候  1