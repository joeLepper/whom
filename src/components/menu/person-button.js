const React = require('react')
const { Component } = React
const PropTypes = require('prop-types')

const Button = require('../button')

class PersonButton extends Component {
  constructor() {
    super(...arguments)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    const to = `/person/${this.props.personId}`
    this.props.history.push(to)
  }
  render() {
    return (
      <div>
        <Button
          key={this.props.personId}
          opacity={1}
          editing={false}
          onClick={this.handleClick}>
          {this.props.personId}
        </Button>
      </div>
    )
  }
}
PersonButton.propTypes = {
  personId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}
module.exports = PersonButton
