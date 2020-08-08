export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
];

const strats = {};
strats.data = function (parentVal, childValue) {
  return childValue; // 这里应该有合并data的策略
}
strats.computed = function () { }
strats.watch = function () { }

function mergeHook(parentVal, childValue) { // 生命周期的合并
  if (childValue) {
    if (parentVal) {
      return parentVal.concat(childValue); // 爸爸和儿子进行拼接
    } else {
      return [childValue]; //儿子需要转化成数组
    }
  } else {
    return parentVal; // 不合并了 采用父亲的
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
export function mergeOptions(parent, child) {
  // 遍历父亲 ，可能是父亲有 儿子没有 
  const options = {};
  for (let key in parent) { // 父亲和儿子都有在这就处理了
    mergeField(key);
  }
  // 儿子有父亲没有 在这处理
  for (let key in child) { // 将儿子多的赋予到父亲上
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  function mergeField(key) { // 合并字段
    // 根据key 不同的策略来进行合并 
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    } else {
      // todo默认合并
      options[key] = child[key]
    }
  }


  return options;
}
let callbacks = [];
let padding = false;
function timerFunc() {
  if (!padding) {
    padding = true;
    return Promise.resolve().then(() => {
      callbacks.forEach(cb => cb());
      padding = false;

    })
  }
}

export function nextTick(cb) {
  callbacks.push(cb);
  timerFunc();
}