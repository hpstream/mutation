function core<T extends string>() {
    var instance = {} as useInstance<T>;
    function use(type: T, fn: Function): useInstance<T> {
      instance[type] = fn as useInstance<T>[T];
      return instance;
    }
    instance.use = use;
    return instance;
}

interface baseUse<T extends string>{
  use:useMathod<T>
}


type useInstance<T extends string> = {
  [p in T]: Function;
} & baseUse<T>;

type useMathod<T extends string> = (type: T,fn:Function) => useInstance<T> ;

var tem1 = core<'get'|'post'>().use("get", () => {});


