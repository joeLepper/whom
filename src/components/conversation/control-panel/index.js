const React = require('react')
const { Component } = React

const styled = require('styled-components').default
const PropTypes = require('prop-types')
const { node } = require('../../../validators')

const Button = require('../../button')
const EditButton = require('./edit-button')
const MenuButton = require('./menu-button')
const ZoomButton = require('./zoom-button')
const ParentButton = require('./parent-button')
// const ResetButton = require('./reset-button')

const Panel = styled.div`
  position: absolute;
  display: flex;
  flex-flow: row wrap;
  width: 100vw;
  height: 5vh;
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
ControlPanel.propTypes = {
  personId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  selected: PropTypes.shape(node).isRequired,
  editing: PropTypes.bool.isRequired,
  person: PropTypes.instanceOf(require('../../../person')).isRequired,
  baseZoom: PropTypes.number.isRequired,
  zoom: PropTypes.object.isRequired,
  maxZoomX: PropTypes.number.isRequired,
  maxZoomY: PropTypes.number.isRequired,
  onEditChange: PropTypes.func.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  onSaveAs: PropTypes.func.isRequired,
}
module.exports = ControlPanel
