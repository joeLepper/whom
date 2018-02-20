const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const { HashRouter, Route } = require('react-router')

const Conversation = require('./components/conversation')
const Menu = require('./components/menu')

const GameContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: 100vw;
  height: 100vh;
  overflow: none;
  font-family: monospace;
`

export default class Game extends Component {
  render() {
    return (
      <HashRouter>
        <GameContainer>
          <Route exact path="/" component={Menu} />
          <Route exact path={personPath} component={Conversation} />
        </GameContainer>
      </HashRouter>
    )
  }
}
