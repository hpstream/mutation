## 深入浅出 node.js 中的进程与线程
### 熟悉基本概念
一个应用程序中，至少包含一个进程，一个进程至少包含一个线程。
- 进程（Process）是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位
- 线程（Thread）是操作系统能够进行运算调度的最小单位。它被包含在进程之中，是进程中的实际运作单位。

Node的特点：
- 主线程是单线程；
- 一个进程中只有一个主线程；
- 基于事件驱动，异步非阻塞I/O;
- 可用于高并发场景。

nodejs中没有多线程，为了充分利用多核cpu,可以使用子进程实现内核的负载均衡。

node 需要解决的问题：
- node做耗时的计算时候，造成阻塞。
- node 如何开启子进程
- 开发过程中如何实现进程守护


> 概念太多，我们从具体案例入手，看看单线程到底会带来什么问题。

### demo1
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
- 2. 打开浏览器，在一个tab1上访问 /sum 。 快速打开另一个tab2，访问 / 。

**请问会出现什么现象？**
我们发现 tab1在转圈， tab2也在转圈，这个现象就很奇怪了。 tab1 在转圈我们可以理解，因为我们需要花费是10s，但是tab2 也需要10s后，才能被访问。 这就很奇怪了。 

这个问题就相当于，别人访问这个浏览器阻塞了10s，你也要跟着阻塞10s。这个问题就很难被接受了。因此得出结论，node 不太适合做cpu密集型的服务。 


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
改造 question.js
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

重新启动node question.js，发现tab2,就不会阻塞了。

明天了子进程的作用。我们来彻底学习下如何使用子进程。

### 子进程的使用


