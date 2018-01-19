module.exports = function ({ buttonDelete }) {
  return function handleButtonDelete (nodeId) {
    if (confirm('Deleting this button will delete its associated page. Are you sure?')) {
      buttonDelete(nodeId)
      this.setState(this.updateState(this.state))
    }
  }
}
