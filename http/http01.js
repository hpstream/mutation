const http = require('http');
const url = require('url');

// uri (uniform resource indentifier) url urn
// hostname 主机名
// query 查询参数
// pathname 请求路径
// console.log(url.parse('http://username:password@localhost:3000/resource?a=1#hash',true))
let server = http.createServer((req, res) => {
  // 请求部分
  console.log(req.method); // 默认也是大写的
  // console.log(req.url); //  /后面的# 前面的  希望获取用户的参数？后面的参数   query  ={a:1,b:2}
  let { pathname, query } = url.parse(req.url, true); // 把查询参数变成一个对象结果
  pathname, query
  console.log(req.headers); // 所有的请求头信息  所有的key都是小写

  // req是一个可读流
  let arr = []; // 前端传递的数据可能是二进制所以用buffer拼接是最合理的

  // 如果流中的数据为空 内部会调用 push(null) 只要调用了push 一定会触发end事件
  req.on('data', function (chunk) {
    arr.push(chunk);
  });
  req.on('end', function () { // 如果没有数据也会触发end方法
    console.log(Buffer.concat(arr).toString(), '----');
  });
  // --------------------------------------------------------
  // 客户端数据获取
  // 响应行和 响应头 响应体顺序 不能发生变化 
  // res是一个可写流 write end


  // 希望服务器每一秒都给客户端最新的一个价格 socket.io
  res.statusCode = 200;
  // res.statusMessage = 'no stauts'; 
  res.setHeader('a', 1)
  res.setHeader('a', 2)
  // 如果websoket不支持 一般情况会采用 前端定时器轮询 ，服务端 返回结果
  res.end('ok');
  // 服务端相关的方法

  //res.write();// 分段响应 Transfer-Encoding:chunkeds
  // res.end('ok'); // 标识响应结束

});
// curl -v 显示详细信息
// curl -X 指定方法
// curl -d 指定数据 
// curl -h 指定头

// server.on('request',function (req,res) {
//     console.log('2');    
// })


let port = 4000; // 端口尽量使用3000以上
server.listen(port, function () {
  console.log(`server start ${port}`);
});
server.on('error', function (err) {
  if (err.errno === 'EADDRINUSE') {
    server.listen(++port); // 端口占用自动累加重启
  }
})
// 服务端代码改变后必须要重新执行  pm2
// nodemon  node monintor  npm install nodemon -g 
// nodemon + 文件名运行



// let query = {};
// req.url.replace(/([^&?=]+)=([^&?=]+)/g,function () {
//     query[arguments[1]] = arguments[2];
// })
// console.log(query)