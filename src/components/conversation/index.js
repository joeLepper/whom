const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const { ipcRenderer } = require('electron')
const styled = require('styled-components').default

const Screen = require('./navigator')
const ControlPanel = require('./control-panel')

const ConversationContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: 100vw;
  height: 100vh;
  overflow: none;
`

class Conversation extends Component {
  constructor({ baseZoom }) {
    super(...arguments)
    this.handleSaveAs = this.handleSaveAs.bind(this)
    this.handleEditChange = this.handleEditChange.bind(this)
    this.handleButtonDelete = this.handleButtonDelete.bind(this)
    this.state = {
      editing: false,
      zoom: { x: baseZoom, y: baseZoom },
    }
  }
  handleSaveAs(id) {
    this.props.person.save(id)
    ipcRenderer.send('person--load', id)
  }
  handleButtonDelete(nodeId) {
    if (
      window.confirm(
        'Deleting this button will delete its associated page. Are you sure?'
      )
    ) {
      this.props.person.buttonDelete(nodeId)
    }
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
          w: spring(this.props.person.dimensions.w),
          h: spring(this.props.person.dimensions.h),
          zoomX: spring(this.state.zoom.x),
          zoomY: spring(this.state.zoom.y),
          maxZoomX: spring(this.state.maxZoomX),
          maxZoomY: spring(this.state.maxZoomY),
        }}
      >
        {({ x, y, w, h, zoomX, zoomY, maxZoomX, maxZoomY }) => {
          return (
            <Screen
              editing={this.state.editing}
              selectedId={this.props.selectedId}
              personId={this.props.personId}
              baseZoom={this.props.baseZoom}
              zoomX={zoomX}
              zoomY={zoomY}
              x={x}
              y={y}
              w={w}
              h={h}
              onLinkAdd={this.props.person.linkAdd}
              onButtonAdd={this.props.person.buttonAdd}
              onButtonChange={this.props.person.buttonChange}
              onButtonDelete={this.props.person.buttonDelete}
              onMessageAdd={this.props.person.messageAdd}
              onMessageChange={this.props.person.messageChange}
              onMessageDelete={this.props.person.messageDelete}
              maxZoomX={maxZoomX}
              maxZoomY={maxZoomY}
              links={this.props.person.data.links}
              additionalLinks={this.props.person.data.additionalLinks}
              nodes={this.props.person.data.nodes}
            />
          )
        }}
      </Motion>
    )
  }
  render() {
    const selected =
      this.props.person.data.nodes.filter(node => {
        return node.id === this.props.selectedId
      })[0] || {}
    return (
      <ConversationContainer>
        <ControlPanel
          editing={this.state.editing}
          selected={selected}
          person={this.props.person}
          personId={this.props.personId}
          onEditChange={this.handleEditChange}
          baseZoom={this.props.baseZoom}
          zoom={this.state.zoom}
          maxZoomX={this.props.person.data.maxZoomX}
          maxZoomY={this.props.person.data.maxZoomY}
          onSaveAs={this.handleSaveAs}
          onZoomChange={({ zoom }) => {
            this.setState({ zoom })
          }}
        />
        {this.renderMotion(selected)}
      </ConversationContainer>
    )
  }
}
module.exports = Conversation
