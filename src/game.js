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

const BASE_ZOOM = 0.25

const GameContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width:100vw;
  height:100vh;
  overflow: none;
  font-family: monospace;
`
const Menu = styled.ul`
  list-style: none;
  display: flex;
  margin: auto;
  flex-flow: column wrap;
`
const MenuItem = styled.li`
  cursor: pointer;
`

export default class Game extends Component {
  constructor () {
    super(...arguments)
    this.renderConversation = this.renderConversation.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    this.createPerson = this.createPerson.bind(this)
    this.loadNode = this.loadNode.bind(this)
    this.loadRootNode = this.loadRootNode.bind(this)
    this.loadPerson = this.loadPerson.bind(this)
    this.loadPeople = this.loadPeople.bind(this)

    const path = history.read()

    const personParams = new Route('/person/:personId').match(path)
    const nodeParams = new Route('/person/:personId/node/:nodeId').match(path)
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
  createPerson () {
    const personId = 'fresh'
    ipcRenderer.on('person--create:reply', (event, person) => {
      this.setState({ personId, person })
    })
    ipcRenderer.send('person--create', personId)
  }
  loadPerson () {
    ipcRenderer.on('person--load:reply', (_, person) => {
      const parsed = JSON.parse(person)
      this.setState({ person: new Person({ person: parsed }) }, () => {
        const rootId = this.state.person.data.nodes.filter(({ parent }) => parent === null)[0].id
        route.update(`/person/${this.state.personId}/node/${rootId}`)
      })
    })
    ipcRenderer.send('person--load', this.state.personId)
  }
  loadPeople () {
    ipcRenderer.on('people--load:reply', (event, people) => {
      this.setState({ people, loading: false })
    })
    ipcRenderer.send('people--load')
  }
  loadRootNode ({ params }) {
    this.loadPerson()
  }
  savePerson () {
    ipcRenderer.on('person--save:reply', (_, status) => console.log(status))
    ipcRenderer.send('person--save', this.person)
  }
  componentDidMount () {
    if (this.state.personId) this.loadPerson()
    else this.loadPeople()
    route.addRouteListener('/person/:personId/node/:nodeId', this.loadNode)
    route.addRouteListener('/person/:personId', this.loadRootNode)
    window.addEventListener('resize', () => {
      const path = route.history.read()
      route.replace(path)
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
    const people = this.state.people.map((personId) => {
      return (
        <Button
          opacity={1}
          editing={false}
          key={personId}
          onClick={() => route.update(`/person/${personId}`)}>{personId}</Button>
      )
    })
    people.push(
      <Button
        opacity={1}
        editing={false}
        key={'new-person-button'}
        onClick={this.createPerson}>freshen up</Button>
    )

    return (
      <Menu>{people}</Menu>
    )
  }
  render () {
    let renderContent = this.renderMenu
    if (this.state.personId) renderContent = this.renderConversation
    if (this.state.loading) renderContent = () => 'LOADING'
    return (
      <GameContainer>
        {renderContent()}
      </GameContainer>
    )
  }
}
