const React = require('react')
const { Component } = React

const { Motion, spring } = require('react-motion')
const PropTypes = require('prop-types')

const Page = require('../page')
const ControlPanel = require('../control-panel')
const { guid } = require('../../validators')

class Pages extends Component {
  constructor({ baseZoom }) {
    super(...arguments)
    this.handleEditChange = this.handleEditChange.bind(this)
    this.handleButtonDelete = this.handleButtonDelete.bind(this)
    this.state = {
      editing: false,
      zoom: { x: baseZoom, y: baseZoom },
    }
  }
  handleButtonDelete(nodeId) {
    const confirmWarning =
      'Deleting this button will delete its associated page. Are you sure?'
    // eslint-disable-next-line no-alert
    if (window.confirm(confirmWarning)) this.props.story.buttonDelete(nodeId)
  }
  handleEditChange({ editing }) {
    this.setState({ editing })
  }
  renderMotion(selected) {
    return (
      <Motion
        style={{
          x: spring(selected.x),
          y: spring(selected.y),
          w: spring(this.props.story.dimensions.w),
          h: spring(this.props.story.dimensions.h),
          zoomX: spring(this.state.zoom.x),
          zoomY: spring(this.state.zoom.y),
          maxZoomX: spring(this.state.maxZoomX),
          maxZoomY: spring(this.state.maxZoomY),
        }}>
        {({ x, y, w, h, zoomX, zoomY, maxZoomX, maxZoomY }) => {
          return (
            <Page
              match={this.props.match}
              location={this.props.location}
              history={this.props.history}
              editing={this.state.editing}
              selectedId={this.props.selectedId}
              storyId={this.props.storyId}
              baseZoom={this.props.baseZoom}
              zoomX={zoomX}
              zoomY={zoomY}
              x={x}
              y={y}
              w={w}
              h={h}
              onLinkAdd={this.props.story.linkAdd}
              onButtonAdd={this.props.story.buttonAdd}
              onButtonChange={this.props.story.buttonChange}
              onButtonDelete={this.props.story.buttonDelete}
              onMessageAdd={this.props.story.messageAdd}
              onMessageChange={this.props.story.messageChange}
              onMessageDelete={this.props.story.messageDelete}
              maxZoomX={maxZoomX}
              maxZoomY={maxZoomY}
              links={this.props.story.data.links}
              additionalLinks={this.props.story.data.additionalLinks}
              nodes={this.props.story.data.nodes}
            />
          )
        }}
      </Motion>
    )
  }
  render() {
    const selected =
      this.props.story.data.nodes.filter((node) => {
        return node.id === this.props.selectedId
      })[0] || {}
    return (
      <div>
        <ControlPanel
          history={this.props.history}
          editing={this.state.editing}
          selected={selected}
          story={this.props.story}
          storyId={this.props.storyId}
          onEditChange={this.handleEditChange}
          baseZoom={this.props.baseZoom}
          zoom={this.state.zoom}
          maxZoomX={this.props.story.data.maxZoomX}
          maxZoomY={this.props.story.data.maxZoomY}
          onSaveAs={this.props.onSaveAs}
          onZoomChange={({ zoom }) => {
            this.setState({ zoom })
          }}
        />
        {this.renderMotion(selected)}
      </div>
    )
  }
}
Pages.propTypes = {
  story: PropTypes.instanceOf(require('../../story-manager')).isRequired,
  storyId: PropTypes.string.isRequired,
  selectedId: guid.isRequired,
  baseZoom: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onSaveAs: PropTypes.func.isRequired,
}
module.exports = Pages
