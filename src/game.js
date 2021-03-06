const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const { HashRouter, Route, Switch } = require('react-router-dom')

const Book = require('./components/book')
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
          <Switch>
            <Route exact path="/" component={Menu} />
            <Route path={'/story/:storyId/node/:nodeId'} component={Book} />
            <Route path={'/story/:storyId'} component={Book} />
          </Switch>
        </GameContainer>
      </HashRouter>
    )
  }
}
