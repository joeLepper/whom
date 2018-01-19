const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const styled = require('styled-components').default

const Handle = require('../handle')
const handleResize = require('../handle/resize')
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
  font-family: arial;
`
const rebind = (self) => {
  self.handle = new Handle({ person: self.person })
  self.handleResize = self.handle.resize.bind(self)
  self.handleLinkAdd = self.handle.linkAdd.bind(self)
  self.handleButtonAdd = self.handle.buttonAdd.bind(self)
  self.handleButtonChange = self.handle.buttonChange.bind(self)
  self.handleButtonDelete = self.handle.buttonDelete.bind(self)
  self.handleMessageAdd = self.handle.messageAdd.bind(self)
  self.handleMessageChange = self.handle.messageChange.bind(self)
  self.handleMessageDelete = self.handle.messageDelete.bind(self)
  self.handleEditChange = self.handle.editChange.bind(self)
}

class Conversation extends Component {
  constructor ({ baseZoom, ee, personId }) {
    super(...arguments)
    this.person = new Person({
      ee: ee,
      personId: personId,
      baseZoom: baseZoom,
    })
    rebind(this)
    this.state = {
      zoom: { x: baseZoom, y: baseZoom },
      w: window.innerWidth,
      h: window.innerHeight,
      maxZoomX: 0,
      maxZoomY: 0,
      nodes: [],
      selected: {},
      selectedId: '',
      links: [],
      additionalLinks: [],
      editing: false,
      loading: true,
    }
  }
  componentDidMount () {
    this.person.load(() => {
      const newState = this.person.update({ zoom: this.state.zoom })
      newState.loading = false
      this.setState(newState)
    })
    this.props.ee.on('select-node', ({ id, personId }, updatePath) => {
      const newState = Object.assign(this.state, { selectedId: id })
      this.setState(this.person.update(newState, updatePath))
    })
    window.addEventListener('resize', this.handleResize(this.person.update))
  }
  renderMotion () {
    return (
      <Motion style={{
          x: spring(this.state.selected.x),
          y: spring(this.state.selected.y),
          w: spring(this.state.w),
          h: spring(this.state.h),
          zoomX: spring(this.state.zoom.x),
          zoomY: spring(this.state.zoom.y),
          maxZoomX: spring(this.state.maxZoomX),
          maxZoomY: spring(this.state.maxZoomY),
        }}>
          {
            ({ x, y, w, h, zoomX, zoomY, maxZoomX, maxZoomY }) => {
              console.log({ x, y, w, h, zoomX, zoomY, maxZoomX, maxZoomY })
              return (
                <Screen
                  editing={this.state.editing}
                  selectedId={this.state.selectedId}
                  baseZoom={this.state.baseZoom}
                  zoomX={zoomX}
                  zoomY={zoomY}
                  x={x}
                  y={y}
                  w={w}
                  h={h}
                  ee={this.props.ee}
                  onLinkAdd={this.handleLinkAdd}
                  onButtonAdd={this.handleButtonAdd}
                  onButtonChange={this.handleButtonChange}
                  onButtonDelete={this.handleButtonDelete}
                  onMessageAdd={this.handleMessageAdd}
                  onMessageChange={this.handleMessageChange}
                  onMessageDelete={this.handleMessageDelete}
                  maxZoomX={maxZoomX}
                  maxZoomY={maxZoomY}
                  links={this.state.links}
                  additionalLinks={this.state.additionalLinks}
                  nodes={this.state.nodes} />
              )
            }
          }
        </Motion>
    )
  }
  render () {
    console.log(this.state.loading)
    return (
      <ConversationContainer>
        <ControlPanel
          editing={this.state.editing}
          selected={this.state.selected}
          person={this.person}
          onEditChange={this.handleEditChange}
          baseZoom={this.props.baseZoom}
          zoom={this.state.zoom}
          maxZoomX={this.state.maxZoomX}
          maxZoomY={this.state.maxZoomY}
          onZoomChange={({ zoom }) => {
            console.log(zoom)
            this.setState(this.person.update({ zoom }))
          }}
          />
        {this.state.loading ? 'LOADING' : this.renderMotion()}
      </ConversationContainer>
    )
  }
}
module.exports = Conversation
