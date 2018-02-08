module.exports = function ({ buttonChange }) {
  return function handleButtonChange (nodeId, optionText) {
    buttonChange(nodeId, optionText)
    this.setState(this.updateState(this.state))
  }
}
