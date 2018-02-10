module.exports = function () {
  return function handleEditChange ({ editing }) {
    this.setState({ editing })
  }
}
