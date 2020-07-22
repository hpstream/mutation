/**
 * 默认情况下source是字符
 * 但如果加载 的是一个二进制文件的话,不能让 webpack转成字符串
 * file-loader原理是把源文件拷贝一份输出到打后后的目录 dist
 * 然后返回访问路径
 * @param {}} source 
 */
const {getOptions,interpolateName} = require('loader-utils');
function loader(content){
    //拿到配置对象
    let options = getOptions(this)||{};
    //得到新的文件名 this loaderContext this.request 文件名 可以获得扩展名
    //url = xxxxxxxxxxxxxx.png
    let url = interpolateName(this,options.filename||'images/[hash].[ext]',{content});
    //如果我们想向输出目录写入文件,只需要调用emitFile方法 
    this.emitFile(url,content);
    //loader最终要返回的肯定是一个JS模块代码
    return `module.exports = ${JSON.stringify(url)}`;

}
function interpolateName2(){

}
//raw原生的 告诉 webpack我想得到了一个 Buffer,而非一个字符串
loader.raw = true;
module.exports = loader;