const http = require('http');
const url = require('url');


debugger
var server = http.createServer(async (req, res) => {
  
  let { pathname, query } = url.parse(req.url, true);
  console.log('测试')
  res.end(pathname)

})
let port = 4000; // 端口尽量使用3000以上
server.listen(port, function () {
  console.log(`server start ${port}`);
});