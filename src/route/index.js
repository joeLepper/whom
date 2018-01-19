const Route = require('route-parser')
const route = new Route('/person/:id/node/:nodeId')

module.exports = function (ee) {
  function read () {
    return route.match(location.pathname)
  }
  function update (personId, nodeId, title) {
    const { id } = read()
    history.pushState({ nodeId, title }, title, `/person/${personId}/node/${nodeId}`)
  }
  window.onpopstate = function (e) {
    const { nodeId, personId } = read()
    ee.emit('select-node', [{ id: nodeId, personId }, false])
  }
  return { update, read }
}
