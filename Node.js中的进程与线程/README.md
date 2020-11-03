## node.js 中的进程与线程
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

```
// 概念不好理解，我来一个案例，看看具体的阻塞是什么样子的。
// 文件名: question.js
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
> 启动上面的代码,打开浏览器的访问 /sum, 在打开一个tab 访问 /sum1 , 此时 发现/sum1 也会被阻塞。
> 原因： 由于node主线程是单线程，所以主要一种情况阻塞你了，就全部阻塞了。