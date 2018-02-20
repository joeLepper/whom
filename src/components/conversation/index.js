const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const { ipcRenderer } = require('electron')
const styled = require('styled-components').default

const Navigator = require('./navigator')
// const ConversationContainer = require('./container')
const ControlPanel = require('./control-panel')

const BASE_ZOOM = 0.25

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: 100vw;
  height: 100vh;
  overflow: none;
`

class ConversationContainer extends Component {
  constructor() {}

  loadPerson(personId) {
    ipcRenderer.send('person--load', personId)
  }
  loadNode({ params }) {
    this.setState({
      nodeId: params.nodeId,
      personId: params.personId,
      loading: false,
    })
  }
  loadRootNode({ params }) {
    this.loadPerson(params.personId)
  }
  markAsViewed(nodeId, messageIdx) {
    const { viewed } = this.state
    const updated = Object.assign({}, viewed, { [nodeId]: messageIdx })
    console.log('updating to:')
    console.log(updated)

    this.setState({ viewed: updated })
  }
  componentDidMount() {
    if (this.state.personId) this.loadPerson(this.state.personId)
    else this.loadPeople()

    // will need to automatically redirect to the rootNode via react-router
    route.addRouteListener(nodePath, this.loadNode)
    route.addRouteListener(personPath, this.loadRootNode)

    // probably need to confirm that this is still the right approach.
    window.addEventListener('resize', () => {
      this.loadPerson(this.state.personId)
    })
    ipcRenderer.on('person--load:reply', (_, personId, person) => {
      const person = new Person({ person: JSON.parse(person), id: personId })
      const newState = { person }
      this.setState(newState, () => {
        const path = route.history.read()
        const result = nodeRoute.match(path)
        console.log(result)
        if (result) {
          const to = nodeRoute.reverse({ personId, nodeId })
          route.update(to)
        } else {
          const { nodes } = this.state.person.data
          const rootList = nodes.filter(({ parent }) => parent === null)
          const rootNode = rootList[0]

          const to = nodeRoute.reverse({ personId, nodeId: rootNode.id })
          route.update(to)
        }
      })
    })
    ipcRenderer.on('person--save:reply', (event, personId, person) => {
      this.loadPerson(personId)
    })
  }
}

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
        'Deleting this button will delete its associated page. Are you sure?',
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
        }}>
        {({ x, y, w, h, zoomX, zoomY, maxZoomX, maxZoomY }) => {
          return (
            <Navigator
              viewed={this.props.viewed}
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
              onView={this.props.onView}
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
      this.props.person.data.nodes.filter((node) => {
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
          onReset={this.props.onReset}
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
