module.exports = function ({ buttonAdd }) {
  return function handleButtonAdd (newNodeId, currentNodeId) {
    buttonAdd(newNodeId, currentNodeId)
    this.setState(this.updateState(this.state))
  }
}
