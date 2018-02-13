const React = require('react')
const { Component } = React

const Button = require('../../button')

class ResetButton extends Component {
  render () {
    return (
      <Button
        editing={false}
        opacity="1"
        style={{ fontSize: 16 }}
        onClick={this.props.onReset}>Reset</Button>
    )
  }
}
module.exports = ResetButton
