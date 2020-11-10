// // 概念不好理解，我来一个案例，看看具体的阻塞是什么样子的。

// const http = require('http');
// const {fork} = require('child_process');
// const path = require('path');
// http.createServer((req, res) => {
//   if (req.url === '/sum') { // 求和
//       // var endTime = new Date().getTime() + 10000
//       // while (new Date().getTime() < endTime) {}
//       // res.end('sum')
//       let childProcess = fork('calc.js', {
//         cwd: path.resolve(__dirname)
//       });
//       childProcess.on('message', function (data) {
//         res.end(data.time + '');
//       })
//   } else {
//     res.end('end');
//   }
// }).listen(3001);


// let {
//   spawn
// } = require("child_process");
// let path = require("path");
// // 通过node命令执行sub_process.js文件
// let childProcess = spawn("node", ['calc.js'], {
//   cwd: path.resolve(__dirname), // 找文件的目录是test目录下
//   stdio: ['pipe']
// });
// // 监控错误
// childProcess.stderr.on("data", function (err) {
//   console.log(22, err.toString());
// });
// // 监听关闭事件
// childProcess.on("close", function () {
//   console.log("close");
// });
// // 监听退出事件
// childProcess.on("exit", function () {
//   console.log("exit");
// });


// let {
//   spawn
// } = require("child_process");
// let path = require("path");
// // 通过node命令执行sub_process.js文件
// let child = spawn('node', ['sub_process.js'], {
//   cwd: path.resolve(__dirname),
//   stdio: 'ignore',
//   detached: true // 独立的线程
// });
// child.unref(); // 放弃控制

// console.log(22)