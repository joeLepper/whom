module.exports = function resize (update) {
  return function () {
    this.setState(update({
      selectedId: this.state.selectedId,
    }))
  }
}
