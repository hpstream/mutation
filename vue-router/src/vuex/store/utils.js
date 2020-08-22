export function forEachValue(obj,cb) {
  for(let name in obj){
    cb(obj[name],name)
  }
}