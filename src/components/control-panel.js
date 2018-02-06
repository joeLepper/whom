const React = require('react')
const { Component } = React

const styled = require('styled-components').default

const { read } = require('../route')
const EditButton = require('./edit-button')
const ZoomButton = require('./zoom-button')
const ParentButton = require('./parent-button')

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
  render () {
      return (
        <Panel>
          <ParentButton selected={this.props.selected} />
          <EditButton
            editing={this.props.editing}
            personId={this.props.personId}
            person={this.props.person}
            onEditChange={this.props.onEditChange} />
          <ZoomButton
            baseZoom={this.props.baseZoom}
            zoomX={this.props.zoom.x}
            zoomY={this.props.zoom.y}
            maxZoomX={this.props.maxZoomX}
            maxZoomY={this.props.maxZoomY}
            onZoomChange={this.props.onZoomChange} />
          <DevOutput>
            <span>{window.location.pathname}</span>
          </DevOutput>
          <input value={this.props.personId} />
        </Panel>
      )
    }

}
module.exports = ControlPanel
