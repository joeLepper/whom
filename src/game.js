const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const { ipcRenderer } = require('electron')
const Route = require('route-parser')

const route = require('./route')
const History = require('./route/history')
const history = new History()
const Person = require('./person')
const Conversation = require('./components/conversation')
const Button = require('./components/button')
const Menu = require('./components/menu')
const BASE_ZOOM = 0.25

const personPath = '/person/:personId'
const nodePath = '/person/:personId/node/:nodeId'
const nodeRoute = new Route(nodePath)
const personRoute = new Route(personPath)

const GameContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width:100vw;
  height:100vh;
  overflow: none;
  font-family: monospace;
`

export default class Game extends Component {
  constructor () {
    super(...arguments)
    this.renderConversation = this.renderConversation.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    this.loadMenu = this.loadMenu.bind(this)
    this.loadNode = this.loadNode.bind(this)
    this.loadRootNode = this.loadRootNode.bind(this)
    this.loadPerson = this.loadPerson.bind(this)
    this.loadPeople = this.loadPeople.bind(this)

    const path = history.read()
    const personParams = personRoute.match(path)
    const nodeParams = nodeRoute.match(path)
    const initialState = {
      people: [],
      loading: true,
      personId: null,
      nodeId: null,
    }
    if (personParams) {
      initialState.personId = personParams.personId
      initialState.nodeId = personParams.nodeId
    }
    else if (nodeParams) {
      initialState.personId = nodeParams.personId
    }
    this.state = initialState
  }
  loadNode ({ params }) {
    this.setState({
      nodeId: params.nodeId,
      personId: params.personId,
      loading: false,
    })
  }
  loadPerson (personId) { ipcRenderer.send('person--load', personId) }
  loadPeople () { ipcRenderer.send('people--load') }
  loadRootNode ({ params }) { this.loadPerson(params.personId) }
  loadMenu () {
    this.setState({ personId: null, nodeId: null, loading: true }, () => {
      this.loadPeople()
    })
  }
  componentDidMount () {
    if (this.state.personId) this.loadPerson(this.state.personId)
    else this.loadPeople()
    route.addRouteListener(nodePath, this.loadNode)
    route.addRouteListener(personPath, this.loadRootNode)
    route.addRouteListener('/', this.loadMenu)
    window.addEventListener('resize', () => {
      this.loadPerson(this.state.personId)
    })
    ipcRenderer.on('person--load:reply', (_, personId, person) => {
      this.setState({
        person: new Person({
          person: JSON.parse(person),
          id: personId,
        })
      }, () => {
        const path = route.history.read()
        const result = nodeRoute.match(path)
        if (result) {
          const to = nodePath
            .replace(':personId', personId)
            .replace(':nodeId', result.nodeId)
          route.update(to)
        }
        else {
          const { nodes } = this.state.person.data
          const rootList = nodes.filter(({ parent }) => parent === null)
          const rootNode = rootList[0]

          const to = nodePath
            .replace(':personId', personId)
            .replace(':nodeId', rootNode.id)
          route.update(to)
        }
      })
    })
    ipcRenderer.on('people--load:reply', (event, people) => {
      this.setState({
        people,
        loading: false,
      })
    })
    ipcRenderer.on('person--create:reply', (event, personId) => {
      this.loadPerson(personId)
    })
    ipcRenderer.on('person--save:reply', (event, personId, person) => {
      this.loadPerson(personId)
    })
  }
  renderConversation () {
    return (
      <Conversation
        person={this.state.person}
        personId={this.state.personId}
        selectedId={this.state.nodeId}
        baseZoom={BASE_ZOOM} />
    )
  }
  renderMenu () {
    return (
      <Menu people={this.state.people} />
    )
  }
  renderLoading () { return 'LOADING' }
  render () {
    let renderContent = this.renderMenu
    if (this.state.personId) renderContent = this.renderConversation
    if (this.state.loading) renderContent = this.renderLoading

    const content = renderContent()
    return (
      <GameContainer>{content}</GameContainer>
    )
  }
}
