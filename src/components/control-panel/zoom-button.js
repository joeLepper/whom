const React = require('react')
const { Component } = React
const PropTypes = require('prop-types')

const Button = require('../button')

class ZoomButton extends Component {
  render() {
    return (
      <Button
        editing={false}
        opacity="1"
        style={{ fontSize: 16 }}
        onClick={(e) => {
          const zoomLevel =
            this.props.zoomX !== this.props.baseZoom
              ? { x: this.props.baseZoom, y: this.props.baseZoom }
              : { x: this.props.maxZoomX * 2, y: this.props.maxZoomY * 2 }
          this.props.onZoomChange({ zoom: zoomLevel })
        }}>
        {this.props.zoomX !== this.props.baseZoom ? '-' : '+'}
      </Button>
    )
  }
}
ZoomButton.propTypes = {
  zoomX: PropTypes.number.isRequired,
  baseZoom: PropTypes.number.isRequired,
  maxZoomX: PropTypes.number.isRequired,
  maxZoomY: PropTypes.number.isRequired,
  onZoomChange: PropTypes.func.isRequired,
}
module.exports = ZoomButton
