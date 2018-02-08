// ROUTER
const Route = require('route-parser')
const History = require('./history')

class Router {
  constructor () {
    this.history = new History(['/'])
    this.back = this.back.bind(this)
    this.read = this.read.bind(this)
    this.update = this.update.bind(this)
    this.replace = this.replace.bind(this)
    this.addRouteListener = this.addRouteListener.bind(this)
    this.removeRouteListener = this.removeRouteListener.bind(this)
    this.notifyListeners = this.notifyListeners.bind(this)
    this.history.addRouteListener(this.notifyListeners)
    this.listeners = {}
  }
  back () {
    this.history.back()
  }
  read () {
    const route = this.history.read()
    let params = false
    Object.keys(this.listeners).forEach((path) => {
      const results = new Router(path).match(route)
      if (results) params = results
    })
    return { route, params }
  }
  update (path) {
    this.history.push(path)
  }
  replace (path) {
    this.history.replace(path)
  }
  notifyListeners (route) {
    Object.keys(this.listeners).forEach((key) => {
      this.listeners[key](route)
    })
  }
  addRouteListener (path, fn) {
    const routeMatcher = new Route(path)
    this.listeners[path] = (route) => {
      const params = routeMatcher.match(route)
      if (params) fn({ route, params })
    }
  }
  removeRouteListener (path, fn) {
    if (!fn.name) throw new Error('listener must be a named function')
    else this.listeners[fn.name] = undefined
  }
}

const instance = new Router()
module.exports = instance
