const React = require('react')
const { Component } = React
const PropTypes = require('prop-types')

const Button = require('../button')

class ParentButton extends Component {
  constructor() {
    super(...arguments)
    this.handleBackClick = this.handleBackClick.bind(this)
  }
  handleBackClick() {
    this.props.history.goBack()
  }
  render() {
    return (
      <Button editing={false} opacity="1" onClick={this.handleBackClick}>
        {'<--'}
      </Button>
    )
  }
}
ParentButton.propTypes = {
  history: PropTypes.object.isRequired,
}
module.exports = ParentButton
