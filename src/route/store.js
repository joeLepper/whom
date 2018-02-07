class Store {
  constructor (namespace) {
    this.namespace = namespace
    this.save = this.save.bind(this)
    this.load = this.load.bind(this)
    this.addChangeListener = this.addChangeListener.bind(this)
    this.removeChangeListener = this.removeChangeListener.bind(this)
    this.notifyListeners = this.notifyListeners.bind(this)
    this.listeners = {}
  }

  load () {
    return JSON.parse(localStorage.getItem(this.namespace) || "[]")
  }

  save (state) {
    localStorage.setItem(this.namespace, JSON.stringify(state))
    this.notifyListeners()
  }

  notifyListeners () {
  	const state = this.load()
  	Object.keys(this.listeners).forEach((key) => {
      const listener = this.listeners[key]
  		listener(state[state.length - 1])
  	})
  }

  addChangeListener (cb) {
  	if (!cb.name) throw new Error('listener must be a named function')
    else this.listeners[cb.name] = cb
  }

  removeChangeListener (cb) {
  	if (!cb.name) throw new Error('listener must be a named function')
    else this.listeners[cb.name] = undefined
  }

}

module.exports = Store
