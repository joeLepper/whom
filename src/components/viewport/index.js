const React = require('react')
const { Component } = React
const PropTypes = require('prop-types')

class Viewport extends Component {
  render() {
    return (
      <svg
        onMouseMove={this.props.dragging ? this.props.onDragMove : null}
        onMouseUp={this.props.dragging ? this.props.onDragCancel : null}
        onMouseLeave={this.props.dragging ? this.props.onDragCancel : null}
        width={this.props.w}
        height={this.props.h}>
        {this.props.children}
      </svg>
    )
  }
}
Viewport.propTypes = {
  dragging: PropTypes.bool.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  onDragMove: PropTypes.func.isRequired,
  onDragCancel: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}
module.exports = Viewport
