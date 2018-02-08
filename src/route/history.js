const Store = require('./store')

class History {
  constructor (history) {
    this.store = new Store('history')
    this.history = history || this.store.load() || []
    this.back = this.back.bind(this)
    this.read = this.read.bind(this)
    this.push = this.push.bind(this)
    this.replace = this.replace.bind(this)
    this.notifyListeners = this.notifyListeners.bind(this)
    this.addRouteListener = this.addRouteListener.bind(this)
    this.removeRouteListener = this.removeRouteListener.bind(this)
    this.listeners = {}
    this.store.addChangeListener(this.notifyListeners)
  }
  back () {
    const history = this.store.load()
    history.pop()
    this.store.save(history)
  }
  push (path) {
    const history = this.store.load()
    history.push(path)
    this.store.save(history)
  }
  replace (path) {
    const history = this.store.load()
    history[history.length - 1] = path
    this.store.save(history)
  }
  read () {
    const history = this.store.load()
    return history && history[history.length - 1] || '/'
  }
  notifyListeners (state) {
    Object.keys(this.listeners).forEach((key) => {
      const listener = this.listeners[key]
      listener(state)
    })
  }
  addRouteListener (cb) {
    if (!cb.name) throw new Error('listener must be a named function')
    else this.listeners[cb.name] = cb
  }
  removeRouteListener (cb) {
    if (!cb.name) throw new Error('listener must be a named function')
    else this.listeners[cb.name] = undefined
  }
}

module.exports = History
