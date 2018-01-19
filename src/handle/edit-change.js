module.exports = function ({ editChange }) {
  return function handleEditChange ({ editing }) {
    editChange(editing)
    this.setState({ editing })
  }
}
