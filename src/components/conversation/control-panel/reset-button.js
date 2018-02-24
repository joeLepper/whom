const React = require('react')
const { Component } = React
const PropTypes = require('prop-types')

const Button = require('../../button')

class ResetButton extends Component {
  render() {
    return (
      <Button
        editing={false}
        opacity="1"
        style={{ fontSize: 16 }}
        onClick={this.props.onReset}>
        Reset
      </Button>
    )
  }
}
ResetButton.propTypes = {
  onReset: PropTypes.func.isRequired,
}
module.exports = ResetButton
