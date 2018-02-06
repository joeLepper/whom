const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const { ipcRenderer } = require('electron')

const ee = require('nee')()

const Conversation = require('./components/conversation')
const BASE_ZOOM = 0.5

const GameContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width:100vw;
  height:100vh;
  overflow: none;
  font-family: arial;
`
history.replaceState({}, '', `/`)
export default class Game extends Component {
  constructor () {
    super(...arguments)
    this.renderConversation = this.renderConversation.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
    this.state = {
      people: [],
      loading: true,
      personId: null,
    }
  }
  componentDidMount () {
    ipcRenderer.on('people--load:reply', (event, people) => {
      this.setState({ people, loading: false })
    })
    ipcRenderer.send('people--load')
  }
  renderConversation () {
    return (
      <Conversation personId={this.state.personId} ee={ee} baseZoom={BASE_ZOOM} />
    )
  }
  renderMenu () {
    const people = this.state.people.map((personId) => {
      return <li key={personId} onClick={() => this.setState({ personId })}>{personId}</li>
    })

    return (
      <ul>{people}</ul>
    )
  }
  render () {
    let renderContent = this.renderMenu
    if (this.state.personId) renderContent = this.renderConversation
    if (this.state.loading) renderContent = () => 'LOADING'
    const content = renderContent()
    return (
      <GameContainer>
        {content}
      </GameContainer>
    )
  }
}
