const React = require('react')
const { Component } = React
const { ipcRenderer } = require('electron')
const styled = require('styled-components').default
const PropTypes = require('prop-types')
const Button = require('../button')
const PersonButton = require('./person-button')

const MenuContainer = styled.ul`
  list-style: none;
  display: flex;
  margin: auto;
  flex-flow: column wrap;
`

class Menu extends Component {
  constructor() {
    super(...arguments)
    this.renderPersonButton = this.renderPersonButton.bind(this)
    this.state = {
      people: [],
      loading: true,
    }
  }
  createPerson() {
    ipcRenderer.send('person--create', 'fresh')
  }
  loadPeople() {
    ipcRenderer.send('people--load')
  }
  renderPersonButton(personId, i) {
    return (
      <PersonButton key={i} personId={personId} history={this.props.history} />
    )
  }
  componentDidMount() {
    this.loadPeople()
    ipcRenderer.on('people--load:reply', (event, people) => {
      this.setState({
        people,
        loading: false,
      })
    })
    ipcRenderer.on('person--create:reply', (event, personId) => {
      this.props.history.push(`/person/${personId}`)
    })
  }
  render() {
    if (this.state.loading) return <h1>Loading</h1>
    const { people } = this.state
    const peopleButtons = people.map(this.renderPersonButton)
    peopleButtons.push(
      <Button
        opacity={1}
        editing={false}
        key={'new-person-button'}
        onClick={this.createPerson}>
        freshen up
      </Button>,
    )
    return <MenuContainer>{peopleButtons}</MenuContainer>
  }
}
Menu.propTypes = {
  history: PropTypes.object.isRequired,
}
module.exports = Menu
