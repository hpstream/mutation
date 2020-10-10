export { };
import { post } from "./index2";
import { get } from "./index3";
namespace Form {
  export interface aabbcc {
    post(name: string): void;
  }
}
namespace Form {
  export interface aabbcc {
    get(name: string): void;
  }
}

function plugin(...args:Function[]) {
  
  var  wb: any = {};
  
  args.forEach(item=>{
    wb[item.name] = item
  })
 
  return wb as Form.aabbcc 

}
var plugins = plugin(post,get)





// interface Plugin {
//   name: string,
//   install(): void
// }
// type Compute<A extends any> = A extends Function ? A : { [K in keyof A]: A[K] };

// type Merge<O1 extends object, O2 extends object> = Compute<
//   O1 & Omit<O2, keyof O1>
// >;

// function CreateCore() {
//   type keyType = 'use';
//   let instance: Record<keyType, Function> = { use: use };


//   function use<T>(plugin: Plugin) {
//     type temType = T & keyType;
//     var obj = { [plugin.name]: plugin.install }

//     let ins = Object.assign(instance, obj)

//     return ins as Record<temType, Function>;
//   }
//   return instance;
// }
// var obj = {
//   name: 'get',
//   install: () => { }
// }
// var s = CreateCore();


// s.use(obj)



// type Point = 'x' | 'y';
// type PointList = Record<Point, { value: number }>
// const cars: PointList = {
//   x: { value: 10 },
//   y: { value: 20 },
// }

// function fs() {
//   return {
//     addPointList: addPointList
//   }
// }
// function addPointList<T extends string>(type: T, params: { value: number }) {

//   type p = Point & T;
//   type PL = Record<Point | T, { value: number }>
//   var tem = {
//     ...cars,
//     [typeof type]: params
//   }

//   return tem as PL;

// }

// // var f = fs().addPointList('z', { value: 3 })

// var s1 = fs().addPointList('mm', { value: 3 })












