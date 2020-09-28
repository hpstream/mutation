const http = require('http');
const url = require('url');
function abc() {
  return new Promise((res, rej) => {
    let sum;
   setTimeout(() => {
     for (let i = 0; i < 1000000000; i++) {
       // console.log(11)
       sum += i;
     }
     res(sum)
   }, 5000);
  })
}
var server = http.createServer(async (req, res) => {
  let { pathname, query } = url.parse(req.url, true);
  console.log('测试')
  if (pathname === '/') {
    var res = await abc();
    res.end('index' + res)

  } else {
    res.end(pathname)
  }

})
let port = 4000; // 端口尽量使用3000以上
server.listen(port, function () {
  console.log(`server start ${port}`);
});