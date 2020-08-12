const shell = require('shelljs');
const fs = require('fs');
var dirlist = {};

var dirs = ['200505-long-road', '190110-luckDraw'];

var dirPromise = dirs.map((dir) => {
  return getInfo(dir);
});

Promise.all(dirPromise).then(() => {
  fs.writeFileSync('stat.js', JSON.stringify(dirlist, null, 2));
});
function getInfo(dir) {
  return new Promise((resolve, reject) => {
    shell.exec(`rm -rf build;npm run test --filter=${dir}`, { silent: true }, function (code, stdout, stderr) {
      var json = handelstdout(stdout);
      dirlist[dir] = json;
      resolve();
    });
  });
}
function handelstdout(stdout) {
  var start = stdout.indexOf('Chunk Names') + 'Chunk Names'.length;
  var end = stdout.indexOf('Entrypoint');
  stdout = stdout.slice(start, end);
  var strArr = stdout.split('\n');
  var str = {};
  strArr.forEach(row => {
    var res = row.match(/\s*([^\s]*)\s*(([0-9.])*\s([^\s]*))/);
    if (res) {
      var [, assest, size, number] = res;
      if (assest.match(/^chunk\/|common\//)) {
        return;
      }
      if (number && /.js$/.test(assest)) {
        str[assest] = size;
      }
    }
  });
  return str;
}
