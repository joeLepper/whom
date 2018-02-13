const React = require('react')
const { Component } = React

const styled = require('styled-components').default

const Button = require('../../button')
const EditButton = require('./edit-button')
const MenuButton = require('./menu-button')
const ZoomButton = require('./zoom-button')
const ParentButton = require('./parent-button')
// const ResetButton = require('./reset-button')

const FONT_SIZE = '1.5em'

const Panel = styled.div`
  position: absolute;
  display: flex;
  flex-flow: row wrap;
  width: 100vw;
  height: 5vh;
`
const DevOutput = styled.div`
  margin: 1vh 1vw;
  display: flex;
  justify-content: center;
  background-color: transparent;
  padding 0.5vh 0.5vw;
  font-size: ${FONT_SIZE};
`

class ControlPanel extends Component {
  constructor(props) {
    super(...arguments)
    this.state = {
      personId: props.personId,
    }
  }
  componentWillReceiveProps({ personId }) {
    if (personId !== this.state.personId) this.setState({ personId })
  }
  render() {
    return (
      <Panel>
        <MenuButton history={this.props.history} />
        <ParentButton
          history={this.props.history}
          selected={this.props.selected}
        />
        <EditButton
          editing={this.props.editing}
          personId={this.props.personId}
          person={this.props.person}
          onEditChange={this.props.onEditChange}
        />
        <ZoomButton
          baseZoom={this.props.baseZoom}
          zoomX={this.props.zoom.x}
          zoomY={this.props.zoom.y}
          maxZoomX={this.props.maxZoomX}
          maxZoomY={this.props.maxZoomY}
          onZoomChange={this.props.onZoomChange}
        />
        <input
          value={this.state.personId}
          onChange={({ target }) => {
            this.setState({ personId: target.value })
          }}
        />
        <Button
          opacity={1}
          editing={false}
          key="save-as"
          onClick={() => {
            this.props.onSaveAs(this.state.personId)
          }}>
          save as
        </Button>
      </Panel>
    )
  }
}

// propTypes can be found in ../button

module.exports = ControlPanel
