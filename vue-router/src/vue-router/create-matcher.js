import createRouteMap from "./create-route-map";
import { createRoute}  from './history/base'

export default function createMatcher(routes){
 

  let { pathMap} = createRouteMap(routes)
 
  function match(location) {
    let record = pathMap[location]; // 可能一个路径有多个记录 
    if (record) {
      return createRoute(record, {
        path: location
      })
    }
    //  这个记录可能没有
    return createRoute(null, {
      path: location
    })
  }
  function addRoutes(routes) {
    pathMap = createRouteMap(routes, pathMap)
  }

  return {
    match,
    addRoutes
  }

}