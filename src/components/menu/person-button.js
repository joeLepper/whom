const React = require('react')
const { Component } = React
const Button = require('../button')
const route = require('../../route')

class PersonButton extends Component {
  constructor () {
    super(...arguments)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    route.update(`/person/${this.props.personId}`)
  }
  render () {
    return (
      <div >
        <Button
          key={this.props.personId}
          opacity={1}
          editing={false}
          onClick={this.handleClick}>{this.props.personId}</Button>

      </div>
    )
  }
}
module.exports = PersonButton
