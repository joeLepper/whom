const React = require('react')
const { Component } = React

const Button = require('../../button')

class ParentButton extends Component {
  constructor() {
    super(...arguments)
    this.handleBackClick = this.handleBackClick.bind(this)
  }
  handleBackClick() {
    this.props.history.goBack()
  }
  render() {
    const { parent } = this.props.selected
    if (parent === null || this.props.editing) return null
    return (
      <Button editing={false} opacity="1" onClick={this.handleBackClick}>
        {'<--'}
      </Button>
    )
  }
}

// propTypes can be found in ../button

module.exports = ParentButton
