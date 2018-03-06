const React = require('react')
const { Component } = React
const PropTypes = require('prop-types')

const Button = require('../button')

class MenuButton extends Component {
  constructor(props) {
    super(...arguments)
    this.navigateToMenu = this.navigateToMenu.bind(this)
  }
  navigateToMenu() {
    this.props.history.push('/')
  }
  render() {
    return (
      <Button
        opacity={1}
        editing={false}
        key="menu"
        onClick={this.navigateToMenu}>
        menu
      </Button>
    )
  }
}
MenuButton.propTypes = {
  history: PropTypes.object.isRequired,
}
module.exports = MenuButton
