module.exports = function ({ messageDelete }) {
  return function handleMessageDelete (nodeId, messageIndex) {
    messageDelete(nodeId, messageIndex)
    this.setState(this.updateState(this.state))
  }
}

