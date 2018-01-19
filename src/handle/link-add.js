module.exports = function ({ linkAdd }) {
  return function handleLinkAdd (parentId, childId) {
    linkAdd(parentId, childId)
    this.setState(this.updateState(this.state))
  }
}
