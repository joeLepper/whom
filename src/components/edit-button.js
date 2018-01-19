const React = require('react')
const { Component } = React

const Button = require('./button')

class EditButton extends Component {
  render () {
    return (
      <Button
        editing={false}
        opacity="1"
        style={{ fontSize: 16 }}
        onClick={(e) => {
          e.preventDefault()
          const newEditingState = !this.props.editing
          this.props.onEditChange({ editing: newEditingState })
        }}>{this.props.editing ? 'dynamic' : 'static'}</Button>
    )
  }
}
module.exports = EditButton



