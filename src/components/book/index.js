const React = require('react')
const { Component } = React
const PropTypes = require('prop-types')

const { Redirect } = require('react-router-dom')
const qs = require('qs')

const Pages = require('../pages')
const StoryManager = require('../../story-manager')
const stories = require('../../stories')

const BASE_ZOOM = 0.25

class Book extends Component {
  constructor(props) {
    super(...arguments)
    this.renderRedirect = this.renderRedirect.bind(this)
    this.loadStory = this.loadStory.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleSaveAs = this.handleSaveAs.bind(this)
    this.state = {
      loading: true,
      nodeId: null,
      story: null,
      storyId: props.match.params.storyId,
    }
  }
  handleSave(storyId, story) {
    stories
      .save(storyId, story)
      .then(() => this.loadStory(storyId))
      .catch((err) => console.error(err))
  }
  handleSaveAs(newStoryId) {
    stories
      .load(this.state.storyId)
      .then((storyRecord) => stories.save(newStoryId, storyRecord))
      .then(() => this.loadStory(newStoryId))
      .catch((err) => console.error(err))
  }
  loadStory(storyId) {
    stories
      .load(storyId)
      .then((storyRecord) => {
        const story = new StoryManager({
          storyId,
          storyRecord,
          onSave: this.handleSave,
        })
        this.setState({ story, storyId, loading: false }, () => {
          this.props.history.push(`/story/${storyId}`)
        })
      })
      .catch((err) => console.error(err))
  }
  loadNode({ params }) {
    this.setState({
      nodeId: params.nodeId,
      storyId: params.storyId,
      loading: false,
    })
  }
  loadRootNode({ params }) {
    this.loadStory(params.storyId)
  }
  componentDidMount() {
    window.addEventListener('resize', () => {
      this.loadStory(this.state.storyId)
    })
    this.loadStory(this.props.match.params.storyId)
  }
  renderConversation() {
    return (
      <Pages
        onSaveAs={this.handleSaveAs}
        baseZoom={BASE_ZOOM}
        match={this.props.match}
        story={this.state.story}
        history={this.props.history}
        location={this.props.location}
        storyId={this.props.match.params.storyId}
        selectedId={this.props.match.params.nodeId}
      />
    )
  }
  renderRedirect() {
    const { nodes } = this.state.story.data
    const { id } = nodes.find(({ parent }) => parent === null)
    const { storyId } = this.state
    const pathname = `/story/${storyId}/node/${id}`
    let search
    if (this.props.location.search.length) {
      search = qs.parse(this.props.location.search)
      if (!search[id]) search[id] = 0
    } else search = { [id]: 0 }
    const to = {
      pathname,
      search: qs.stringify(search, { encode: false }),
    }
    return <Redirect from="/" to={to} />
  }
  render() {
    // eslint-disable-next-line no-console
    console.log(this.props.location)
    if (this.state.loading) return <h1>'LOADING'</h1>
    else if (this.props.match.params.nodeId) return this.renderConversation()
    return this.renderRedirect()
  }
}
Book.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}
module.exports = Book
