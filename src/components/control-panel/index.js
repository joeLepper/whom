const React = require('react')
const { Component } = React

const styled = require('styled-components').default
const PropTypes = require('prop-types')
const { node } = require('../../validators')

const Button = require('../button')
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
      storyId: props.storyId,
    }
  }
  componentWillReceiveProps({ storyId }) {
    if (storyId !== this.state.storyId) this.setState({ storyId })
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
          storyId={this.props.storyId}
          story={this.props.story}
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
          value={this.state.storyId}
          onChange={({ target }) => {
            this.setState({ storyId: target.value })
          }}
        />
        <Button
          opacity={1}
          editing={false}
          key="save-as"
          onClick={() => {
            this.props.onSaveAs(this.state.storyId)
          }}>
          save as
        </Button>
      </Panel>
    )
  }
}
ControlPanel.propTypes = {
  storyId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  selected: PropTypes.shape(node).isRequired,
  editing: PropTypes.bool.isRequired,
  story: PropTypes.instanceOf(require('../../story-manager')).isRequired,
  baseZoom: PropTypes.number.isRequired,
  zoom: PropTypes.object.isRequired,
  maxZoomX: PropTypes.number.isRequired,
  maxZoomY: PropTypes.number.isRequired,
  onEditChange: PropTypes.func.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  onSaveAs: PropTypes.func.isRequired,
}
module.exports = ControlPanel
