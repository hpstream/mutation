import { createElement, render} from './../../src/vdom/index'


let VirtualDOM = createElement('div', { class: '' }, [
  createElement('li', { class: 'item' }, ['1']),
  createElement('li', { class: 'item' }, ['2']),
  createElement('li', { class: 'item' }, ['3']),
  createElement('li', { class: 'item' }, ['4'])
])

let newVirtualDOM = createElement('div', { class: 'list1' }, [
  createElement('li', {}, ['a']),
  createElement('li', { class: 'item1' }, ['b']),
  createElement('li', { class: 'item1' }, [
    createElement('div', { class: 'div' }, ['c'])
  ]),
  createElement('li', { class: 'item1' }, ['d'])
  // createElement('li', { class: 'item' }, [
  //   createElement('textarea', { value: 'resres' }, []),
  //   createElement('input', { value: '323232' }, []),
  // ])
])


render(VirtualDOM,document.querySelector('#root'))


setTimeout(() => {
  render(VirtualDOM, newVirtualDOM)
}, 0);