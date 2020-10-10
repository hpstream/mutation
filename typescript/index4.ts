export {};
function core() {
  let instance: Record<string, Function> = {};
  function use(type: string, fn: Function) {
    instance[type] = fn;
    return instance;
  }
  instance.use = use;
  return instance;
}
type Instance = {
  use: (type: string, fn: Function) => Instance;
  get: (name:string)=>void;
};
let temp: Instance = core().use("get", () => {});



temp.get('2')