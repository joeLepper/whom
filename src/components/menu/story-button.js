const React = require('react')
const { Component } = React
const PropTypes = require('prop-types')

const Button = require('../button')

class StoryButton extends Component {
  constructor() {
    super(...arguments)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    const to = `/story/${this.props.storyId}`
    this.props.history.push(to)
  }
  render() {
    return (
      <div>
        <Button
          key={this.props.storyId}
          opacity={1}
          editing={false}
          onClick={this.handleClick}>
          {this.props.storyId}
        </Button>
      </div>
    )
  }
}
StoryButton.propTypes = {
  storyId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}
module.exports = StoryButton
