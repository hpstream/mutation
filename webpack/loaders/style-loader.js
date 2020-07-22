let {getOptions,stringifyRequest} = require('loader-utils');
function loader(source){
 /*   let script = `
     let style = document.createElement('style');
     style.innerHTML = ${JSON.stringify(source)};
     document.head.appendChild(style);
   `;
    return script; */
}
//第一步,先走它 style-loader .pitch
loader.pitch = function(remainingRequest,previousRequest,data){
    //remainingRequest  !!less-loader的绝对路径!要加载的模块main.less的绝对路径
    //!! 只使用行内loader,不执行其它loader
    //stringifyRequest可以把绝对路径转成相对路径  !!./src/...less-loader!./src/main.less
    //stringifyRequest=>"./loaders/less-loader.js!./src/main.less"
    //pitch返回之后相当于这个main.less就loader转译完成了,这个阶段不会走less-loader
    //webpack拿到这个JS之后会解析这个JS,变成AST抽象语法树,然后找到里面require关键字,寻找依赖
    //webpack会继续解析依赖,把"./loaders/less-loader.js!./src/main.less"模块ID去解析加载
    //!!./loaders/less-loader.js!./src/main.less=>module.exports="#root {\n  color: red;\n}\n"
    //因为
    let script = `
      let style = document.createElement('style');
      style.innerHTML = require(${stringifyRequest(this,"!!"+remainingRequest)});
      //style.innerHTML = require("!!./loaders/css-loader.js!./src/main.less");
      document.head.appendChild(style);
    `;
    return script;
}
/**
 * 
 * 
 */
module.exports = loader;