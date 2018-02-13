const React = require('react')
const { Component } = React

const Button = require('../../button')

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

// propTypes can be found in ../button

module.exports = MenuButton
