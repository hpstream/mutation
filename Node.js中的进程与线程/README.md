## 一看就懂的集群使用（node）

**需要了解的基础概念**
一个应用程序中，至少包含一个进程，一个进程至少包含一个线程。

- 进程（Process）是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位
- 线程（Thread）是操作系统能够进行运算调度的最小单位。它被包含在进程之中，是进程中的实际运作单位。

**Node 的特点：**

- 主线程是单线程；
- 一个进程中只有一个主线程；
- 基于事件驱动，异步非阻塞 I/O;
- 可用于高并发场景。

nodejs 中没有多线程，为了充分利用多核 cpu,可以使用子进程实现内核的负载均衡。

**node 需要解决的问题：**

- node 做耗时的计算时候，造成阻塞。
- node 如何开启子进程
- 开发过程中如何实现进程守护

> 概念太多，我们从具体案例入手，看看单线程到底会带来什么问题。

### 单线程的缺点

```
// file: question.js
const http = require('http');
http.createServer((req, res) => {
  if (req.url === '/sum') { // 求和
    var endTime = new Date().getTime() + 10000
    while (new Date().getTime() < endTime) {}
    res.end('sum')
  } else {
    res.end('end');
  }
}).listen(3000);
```

**操作步骤**

- 1. node question.js
- 2. 打开浏览器，在一个 tab1 上访问 /sum 。 快速打开另一个 tab2，访问 / 。

**请问会出现什么现象？**
我们发现 tab1 在转圈， tab2 也在转圈，这个现象就很奇怪了。 tab1 在转圈我们可以理解，因为我们需要花费是 10s，但是 tab2 也需要 10s 后，才能被访问。 这就很奇怪了。

这个问题就相当于，别人访问这个浏览器阻塞了 10s，你也要跟着阻塞 10s。这个问题就很难被接受了。因此得出结论，node 不太适合做 cpu 密集型的服务。

### 如何解决这个问题？

为了解决这个问题，我们引入子进程。

```
file: calc.js

var endTime = new Date().getTime() + 10000
while (new Date().getTime() < endTime) {}

process.send({
    time: new Date().getTime()+''
});
```

**改造 question.js**

```
file: question.js
const http = require('http');
const {fork} = require('child_process');
const path = require('path');
http.createServer((req, res) => {
  if (req.url === '/sum') { // 求和
      // var endTime = new Date().getTime() + 10000
      // while (new Date().getTime() < endTime) {}
      // res.end('sum')
      let childProcess = fork('calc.js', {
        cwd: path.resolve(__dirname)
      });
      childProcess.on('message', function (data) {
        res.end(data.time + '');
      })
  } else {
    res.end('end');
  }
}).listen(3001);
```

重新启动 node question.js，发现 tab2,就不会阻塞了。

总结： node 作为服务器的话，需要开启子进程来解决 cpu 密集型的操作。以防止主线程被阻塞

### 子进程的使用 (child_process)

**使用的方法**

- spawn 异步生成子进程
- fork 产生一个新的 Node.js 进程，并使用建立的 IPC 通信通道调用指定的模块，该通道允许在父级和子级之间发送消息。
- exec 产生一个 shell 并在该 shell 中运行命令
- execFile 无需产生 shell

### spawn

spawn 产卵，可以通过此方法创建一个子进程

```
let { spawn } = require("child_process");
let path = require("path");
// 通过node命令执行sub_process.js文件
let childProcess = spawn("node",['sub_process.js'], {
  cwd: path.resolve(__dirname, "test"), // 找文件的目录是test目录下
  stdio: [0, 1, 2]
});
// 监控错误
childProcess.on("error", function(err) {
  console.log(err);
});
// 监听关闭事件
childProcess.on("close", function() {
  console.log("close");
});
// 监听退出事件
childProcess.on("exit", function() {
  console.log("exit");
});
```

stdio 这个属性非常有特色，这里我们给了 0,1,2 那么分别代表什么呢？

**stdio**

1. 0,1,2 分别对应当前主进程的 process.stdin,process.stdout,process.stderr,意味着主进程和子进程共享标准输入和输出

```
let childProcess = spawn("node",['sub_process.js'], {
  cwd: path.resolve(__dirname, "test"), // 找文件的目录是test目录下
  stdio: [0, 1, 2]
});
```

> 可以在当前进程下打印 sub_process.js 执行结果

2. 默认不提供 stdio 参数时，默认值为 stdio:['pipe']，也就是只能通过流的方式实现进程之间的通信

```
let { spawn } = require("child_process");
let path = require("path");
// 通过node命令执行sub_process.js文件
let childProcess = spawn("node",['sub_process.js'], {
  cwd: path.resolve(__dirname, "test"),
  stdio:['pipe'] // 通过流的方式
});
// 子进程读取写入的数据
childProcess.stdout.on('data',function(data){
    console.log(data);
});
// 子进程像标准输出中写入
process.stdout.write('hello');
```

3. 使用 ipc 方式通信,设置值为 stdio:['pipe','pipe','pipe','ipc'],可以通过 on('message')和 send 方法进行通信

```
  let { spawn } = require("child_process");
  let path = require("path");
  // 通过node命令执行sub_process.js文件
  let childProcess = spawn("node",['sub_process.js'], {
    cwd: path.resolve(__dirname, "test"),
    stdio:['pipe','pipe','pipe','ipc'] // 通过流的方式
  });
  // 监听消息
  childProcess.on('message',function(data){
      console.log(data);
  });
  // 发送消息
  process.send('hello');
```
4. 还可以传入ignore 进行忽略 , 传入inherit表示默认共享父进程的标准输入和输出

**产生独立进程**
```
let { spawn } = require("child_process");
let path = require("path");
// 通过node命令执行sub_process.js文件
let child = spawn('node',['sub_process.js'],{
    cwd:path.resolve(__dirname,'test'),
    stdio: 'ignore',
    detached:true // 独立的线程
});
child.unref(); // 放弃控制
```
作用： 开启线程后，并且放弃对线程的控制。我们就可以不占用控制太后台运行了。

### fork