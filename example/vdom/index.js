import { h, render} from './../../src/vdom/index'

var bb = '22'
let VirtualDOM = h('div', { key:1,class: 'list' }, [
  h('li', { class: 'item' ,key: 1 }, ['1']),
  h('li', { class: 'item' ,key: 2 }, [bb]),
  h('li', { class: 'item' }, ['3']),
  h('li', { class: 'item' ,on:{click:()=>{alert(1)}} }, ['4'])
])

let newVirtualDOM = h('div', { key: 1,class: 'list1' }, [
  h('li', {}, ['a']),
  h('li', { class: 'item1' ,key: 1 }, ['b']),
  h('li', { class: 'item1', key: 2 }, [
    h('div', { class: 'div' }, ['c'])
  ]),
  h('li', { class: 'item1' }, ['d']),
  h('li', { class: 'item' }, [
    h('textarea', { value: 'resres' }, []),
    h('input', { value: '323232' }, []),
  ])
])


render(VirtualDOM,document.querySelector('#root'))


setTimeout(() => {
  render(VirtualDOM, newVirtualDOM)
}, 1000);