const React = require('react')
const { Component } = React

const styled = require('styled-components').default

const EditButton = require('./edit-button')
const ZoomButton = require('./zoom-button')
const ParentButton = require('./parent-button')

const Panel = styled.div`
  position: absolute;
  display: flex;
  flex-flow: row wrap;
  width: 100vw;
  height: 5vh;
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
          <span>{window.location.pathname}</span>
        </Panel>
      )
    }

}
module.exports = ControlPanel






