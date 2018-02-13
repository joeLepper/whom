const React = require('react')
const { Component } = React

const { Redirect } = require('react-router-dom')
const { ipcRenderer } = require('electron')
const styled = require('styled-components').default
const qs = require('qs')

const Person = require('../../person')
const ConversationContainer = require('./container')

const BASE_ZOOM = 0.25

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: 100vw;
  height: 100vh;
  overflow: none;
`

class Conversation extends Component {
  constructor(props) {
    super(...arguments)
    console.log(props)
    this.renderRedirect = this.renderRedirect.bind(this)
    this.state = {
      loading: true,
      nodeId: null,
      personId: props.match.params.personId,
    }
  }
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
  componentDidMount() {
    // probably need to confirm that this is still the right approach.
    window.addEventListener('resize', () => {
      this.loadPerson(this.state.personId)
    })
    ipcRenderer.on('person--load:reply', (_, personId, p) => {
      const person = new Person({ person: JSON.parse(p), id: personId })
      this.setState({ person, loading: false })
    })
    ipcRenderer.on('person--save:reply', (event, personId, person) => {
      this.loadPerson(this.props.match.params.personId)
    })
    this.loadPerson(this.props.match.params.personId)
  }
  renderConversation() {
    return (
      <ConversationContainer
        baseZoom={BASE_ZOOM}
        match={this.props.match}
        person={this.state.person}
        history={this.props.history}
        location={this.props.location}
        personId={this.props.match.params.personId}
        selectedId={this.props.match.params.nodeId}
      />
    )
  }
  renderRedirect() {
    const { nodes } = this.state.person.data
    const { id } = nodes.find(({ parent }) => parent === null)
    const { personId } = this.state
    const pathname = `/person/${personId}/node/${id}`
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
    console.log(this.props.location)
    if (this.state.loading) return <h1>'LOADING'</h1>
    else if (this.props.match.params.nodeId) return this.renderConversation()
    return this.renderRedirect()
  }
}

module.exports = Conversation
