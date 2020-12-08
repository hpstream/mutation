
// const {produce} = require('immer')
const {produce} = require('./immer')
let baseState = {
  home:{name:'zhufeng',arr:[1]},
  b:{}
}
debugger
let nextState = produce(baseState, (draft) => {
    draft.home.name = '珠峰';
    draft.home.arr.push(2);
})
console.log(baseState.home , nextState.home);
console.log(baseState.home.arr === nextState.home.arr)
console.log(baseState.b === nextState.b);