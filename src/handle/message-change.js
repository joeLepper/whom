module.exports = function ({ messageChange }) {
  return function handleMessageChange (nodeId, messageIndex, message) {
    messageChange(nodeId, messageIndex, message)
    this.setState(this.updateState(this.state))
  }
}
