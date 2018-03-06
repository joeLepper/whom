const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const PropTypes = require('prop-types')
const Button = require('../button')
const StoryButton = require('./story-button')
const stories = require('../../stories')

const MenuContainer = styled.ul`
  list-style: none;
  display: flex;
  margin: auto;
  flex-flow: column wrap;
`

class Menu extends Component {
  constructor() {
    super(...arguments)
    this.renderStoryButton = this.renderStoryButton.bind(this)
    this.createStory = this.createStory.bind(this)
    this.state = {
      stories: [],
      loading: true,
    }
  }
  createStory() {
    stories
      .create('fresh')
      .then(() => this.props.history.push(`/story/fresh`))
      .catch((err) => {
        throw new Error(err)
      })
  }
  renderStoryButton(storyId, i) {
    return (
      <StoryButton key={i} storyId={storyId} history={this.props.history} />
    )
  }
  componentDidMount() {
    stories
      .list()
      .then((stories) => this.setState({ stories, loading: false }))
      .catch((err) => {
        throw new Error(err)
      })
  }
  render() {
    if (this.state.loading) return <h1>Loading</h1>
    const { stories } = this.state
    const storyButtons = stories.map(this.renderStoryButton)
    const createStoryButton = (
      <Button
        opacity={1}
        editing={false}
        key={'new-story-button'}
        onClick={this.createStory}>
        freshen up
      </Button>
    )
    storyButtons.push(createStoryButton)
    return <MenuContainer>{storyButtons}</MenuContainer>
  }
}
Menu.propTypes = {
  history: PropTypes.object.isRequired,
}
module.exports = Menu
