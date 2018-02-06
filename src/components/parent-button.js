const React = require('react')
const { Component } = React

const { back } = require('../route')
const Button = require('./button')

class ParentButton extends Component {
  render () {
    const { parent } = this.props.selected
    // if (parent === null || this.props.editing) return null
    return (
      <Button
        editing={false}
        opacity="1"
        onClick={(e) => {
          e.preventDefault()
          back()
        }}>{'<--'}</Button>
    )
  }
}
module.exports = ParentButton




