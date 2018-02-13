const React = require('react')
const { Component } = React
const { ipcRenderer } = require('electron')
const styled = require('styled-components').default
const Button = require('../button')
const PersonButton = require('./person-button')

const MenuContainer = styled.ul`
  list-style: none;
  display: flex;
  margin: auto;
  flex-flow: column wrap;
`

class Menu extends Component {
  createPerson () {
    ipcRenderer.send('person--create', 'fresh')
  }
  renderPersonButton (personId, i) {
    return (
      <PersonButton key={i} personId={personId} />
    )
  }
  render () {
    const { people } = this.props
    const peopleButtons = people.map(this.renderPersonButton)
    peopleButtons.push(
      <Button
        key={'creator'}
        opacity={1}
        editing={false}
        key={'new-person-button'}
        onClick={this.createPerson}>freshen up</Button>
    )

    return (
      <MenuContainer>{peopleButtons}</MenuContainer>
    )
  }
}
module.exports = Menu
