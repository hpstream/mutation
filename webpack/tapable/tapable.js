class AsyncSeriesCodeFactory {
  setup(content,options) { // args,tags
    this.options = options;
    this._x = options.taps.map((item)=>item.cb)
  }
  args(){
    return this.options.args.join(',')
  }
  create() {
    return new Function(this.args(), this.header() + this.content());
   }
  header(){
    return '';
  }
  content(){
    let body = 'return ';
    body += `Promise.resolve(${this.args()})`
    for (let i = 0; i < this._x.length;i++){
      body += `.then(${this._x[i]})`
    }
    return body;
  }
}


class hook {
  constructor(...args){
    this.args = args;
    this.taps = [];
    this._x = undefined;
  }

  tapPromise(name,callback){
    this.taps.push({
      name,
      cb: callback
    })
  }

  promise(...args){
    // 编译函数
    let callMethod = this.compile({
      args: this.args,
      taps: this.taps
    });
    return callMethod.apply(this, args)
  }
  compile(){
    throw new Error('请在子类实现该方法')
  }

}
const factory = new AsyncSeriesCodeFactory()
class AsyncSeriesBailHook extends hook{
  constructor(args) {
    super(args);
  }
  compile(options) {
    //this钩子的实例 options参数对象taps args
    factory.setup(this, options);
    console.log(factory.create(options).toString())
    return factory.create(options);
  }
}






module.exports = {
  AsyncSeriesBailHook
}

