module.exports = function ({ buttonChange }) {
  return function handleButtonChange (nodeId, optionText) {
    console.log('this should be an id')
    console.log(nodeId)
    buttonChange(nodeId, optionText)
    this.setState(this.updateState(this.state))
  }
}
