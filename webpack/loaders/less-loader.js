let {getOptions} = require('loader-utils');
let less = require('less');
function loader(source){
    //如何把loader变成异步的呢?
    //如果调用了this.async方法,则webpack知道 这个loader是异步的,
   let callback =  this.async();
   less.render(source,{filename:this.resource},(err,output)=>{
    //callback(err,output.css);
    //把less文本编译成了output.css 也就是css文本
    callback(err,`module.exports=${JSON.stringify(output.css)}`);
   });
   //return source;
}
module.exports = loader;