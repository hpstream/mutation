// 概念不好理解，我来一个案例，看看具体的阻塞是什么样子的。

const http = require('http');
http.createServer((req, res) => {
  if (req.url === '/sum') { // 求和
      var endTime = new Date().getTime() + 10000
      while (new Date().getTime() < endTime) {}
      res.end('sum')
  } else {
    res.end('end');
  }
}).listen(3001);

