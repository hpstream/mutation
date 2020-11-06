  // var endTime = new Date().getTime() + 10000
  // while (new Date().getTime() < endTime) {}


  // process.send({
  //   time: new Date().getTime()+''
  // });


// console.log('child', process.stdin)
var s = {}

s.b.c
// process.stdout.write('child\n');



childProcess.on('uncaughtException', function (err) {
  // console.log()
  process.stderr.write(err);
});