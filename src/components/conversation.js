const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const styled = require('styled-components').default

const Handle = require('../handle')
const Person = require('../person')
const Screen = require('./screen')
const ControlPanel = require('./control-panel')

const ConversationContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width:100vw;
  height:100vh;
  overflow: none;
`
const rebind = (self) => {
  self.handle = new Handle({ person: self.props.person })
  self.handleLinkAdd = self.handle.linkAdd.bind(self)
  self.handleButtonAdd = self.handle.buttonAdd.bind(self)
  self.handleButtonChange = self.handle.buttonChange.bind(self)
  self.handleButtonDelete = self.handle.buttonDelete.bind(self)
  self.handleMessageAdd = self.handle.messageAdd.bind(self)
  self.handleMessageDelete = self.handle.messageDelete.bind(self)
  self.handleEditChange = self.handle.editChange.bind(self)

  self.handleMessageChange = self.handleMessageChange.bind(self)
}

class Conversation extends Component {
  constructor ({ baseZoom }) {
    super(...arguments)
    rebind(this)
    this.state = {
      editing: false,
      zoom: { x: baseZoom, y: baseZoom }
    }
  }
  handleMessageChange (nodeId, messageIndex, message) {
    this.props.person.messageChange(nodeId, messageIndex, message)
  }
  renderMotion (selected) {
    return (
      <Motion style={{
          x: spring(selected.x),
          y: spring(selected.y),
          w: spring(this.props.person.dimensions.w),
          h: spring(this.props.person.dimensions.h),
          zoomX: spring(this.state.zoom.x),
          zoomY: spring(this.state.zoom.y),
          maxZoomX: spring(this.state.maxZoomX),
          maxZoomY: spring(this.state.maxZoomY),
        }}>
          {
            ({ x, y, w, h, zoomX, zoomY, maxZoomX, maxZoomY }) => {
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
                  onLinkAdd={this.handleLinkAdd}
                  onButtonAdd={this.handleButtonAdd}
                  onButtonChange={this.handleButtonChange}
                  onButtonDelete={this.handleButtonDelete}
                  onMessageAdd={this.handleMessageAdd}
                  onMessageChange={this.handleMessageChange}
                  onMessageDelete={this.handleMessageDelete}
                  maxZoomX={maxZoomX}
                  maxZoomY={maxZoomY}
                  links={this.props.person.data.links}
                  additionalLinks={this.props.person.data.additionalLinks}
                  nodes={this.props.person.data.nodes} />
              )
            }
          }
        </Motion>
    )
  }
  render () {
    const selected = this.props.person.data.nodes.filter((node) => {
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
          onSaveAs={this.props.onSaveAs}
          onZoomChange={({ zoom }) => {
            this.setState(this.person.update({ zoom }))
          }}
          />
        {this.renderMotion(selected)}
      </ConversationContainer>
    )
  }
}
module.exports = Conversation
