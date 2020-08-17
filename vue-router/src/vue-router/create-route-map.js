export default function createRouteMap(routes, oldPathMap) {
  var pathMap = oldPathMap || Object.create(null)

  routes.forEach(route => {
    addRouterRecord(route, pathMap, null)
  });


  return {
    pathMap
  }

}

function addRouterRecord(route, pathMap, parent) {

  let { path, children = [], component } = route;
  path = parent ? (parent.path + '/' + route.path) : route.path
  if (!pathMap[path]) {
    pathMap[path] = {
      path,
      component,
      parent
    }
  }

  children.forEach((child)=>{
    addRouterRecord(child, pathMap, route)
  })
}