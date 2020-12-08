
const {produce} = require('immer')
// const {produce} = require('./immer')
let baseState = {
  home:{name:'爸爸',arr:[1]},
  b:{}
}

// let nextState = produce(baseState, (draft) => {
//     draft.home.name = '妈妈';
// })
// console.log(baseState.home === nextState.home);
// console.log(baseState.home.arr === nextState.home.arr)
// console.log(baseState.b === nextState.b);

let p = new Proxy(baseState,{
  get(tartget, key) {
      console.log('get', tartget, key)
      return tartget[key]
  },
  set(tartget,key,value){
    console.log('set', tartget, key, value)
    tartget[key]=value
  }
})
// p.home = 'mama1'
p.home.name = 'mama1'