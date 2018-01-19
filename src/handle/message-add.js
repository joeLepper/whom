module.exports = function ({ messageAdd }, cb) {
  return function handleMessageAdd (nodeId) {
    messageAdd(nodeId)
    this.setState(this.updateState(this.state), cb)
  }
}
