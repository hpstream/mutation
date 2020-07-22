let {getOptions} = require('loader-utils');
let mime = require('mime');//通过文件名.png获取文件的Content-Type  application/json image/png
function loader(source){
    let options = getOptions(this);
     let {limit=16*1024,fallback="./file-loader2",filename='[hash].[ext]'}= options;
     if(limit){
        limit= parseFloat(limit);
     }
     console.log('this.resourcePath',this.resourcePath);//这个资源的绝对路径
     let mimeType = mime.getType(this.resourcePath);// image/png
     //如果设置了阈值了,并且当前文件的字节数小于阈值,则
     if(limit && source.length<limit){
        let base64Str = `data:${mimeType};base64,${source.toString('base64')}`;
        return `module.exports = ${JSON.stringify(base64Str)}`;
     }else{//如果说没有设置阈值,或者说文件的体积大于阈值的话,就还走file-loader
        //为什么在这里配resolve不管用呢?是因为我这里用了 require,而require是node的原生方法
        //而原生方法肯定是不会去找webpack配置里的resolve配置的.
        //resolve查找模块的时候,并不是用的require,而是实现了一套增强版的resolve
         let fileLoader = require(fallback||'./file-loader2');
         return fileLoader.call(this,source);
     }

}
//就是说设置一下不要让webpack把源文件转成字符串
loader.raw = true;
module.exports = loader;