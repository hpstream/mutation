import { h, render} from './../../src/vdom/index'
// import {render} from './../../src/vdom/fiber/index'


let VirtualDOM = (
  <div key='1' className='list1' >
    <div key='1'>1</div>
    <div key='2'>2</div>
    <div key='3'>3</div>
  </div>
)

let newVirtualDOM = (
  <div key='1' className='list' >
    <div key='2'>2</div>
    <div key='4'>4</div>
    <div key='3'>3</div>
  </div>
)

render(VirtualDOM,document.querySelector('#root'))


setTimeout(() => {
  render(VirtualDOM, newVirtualDOM)
}, 1000);



