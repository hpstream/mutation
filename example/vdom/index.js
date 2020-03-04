import { h} from './../../src/vdom/index'
import {render} from './../../src/vdom/fiber/index'

var arr = [];
for(var i=0;i<100000;i++){
  arr.push((<li className={i}>{i+''}</li>))
}
let VirtualDOM = (
  <div key='1' className='list1' >
    {arr}
  </div>
)

let newVirtualDOM = (
  <div key='1' className='list' >
    {arr}
  </div>
)

render(VirtualDOM,document.querySelector('#root'))


// setInterval(() => {
//   render(VirtualDOM, newVirtualDOM)
// }, 10000);



