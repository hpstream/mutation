const net = require('net');

var server = net.createServer(() => { })

function nextPort(port) { // 端口号 + 1
  return port + 1;
};

function getport(port, callback) {
  function onListen(data) {
    // 链接成功，关闭端口，清楚注销事件
    callback(null, port);
    server.removeListener('error', onError);
    server.close(); 
  }

  function onError(err) {
    // 链接失败端口号+1
    getport(nextPort(port))
  }
  server.once('error', onError); // 端口没有链接成功时触发
  server.once('listening', onListen); // 端口链接成功时触发
  server.listen(port); //
}

getport(1024, (err,port) => {
  console.log(port);
})

