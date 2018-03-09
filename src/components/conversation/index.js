const React = require('react')
const { Component } = React
const PropTypes = require('prop-types')

const { Redirect } = require('react-router-dom')
const { ipcRenderer } = require('electron')
const qs = require('qs')

const Person = require('../../person')
const ConversationContainer = require('./container')

const BASE_ZOOM = 0.25

class Conversation extends Component {
  constructor(props) {
    super(...arguments)
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
        onMouseEnter={(e) => {
          console.log('entered')
        }}
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
    // eslint-disable-next-line no-console
    console.log(this.props.location)
    if (this.state.loading) return <h1>'LOADING'</h1>
    else if (this.props.match.params.nodeId) return this.renderConversation()
    return this.renderRedirect()
  }
}
Conversation.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}
module.exports = Conversation
