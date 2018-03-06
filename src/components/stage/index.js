const React = require('react')
const { Component } = React
const PropTypes = require('prop-types')

class Stage extends Component {
  render() {
    return (
      <g className="Stage">
        <g
          className="Illustration"
          transform={`translate(${this.props.transX}, ${this.props.transY})`}>
          <g
            className="IllustrationScaler"
            transform={`scale(${this.props.zoomX}, ${this.props.zoomY})`}>
            <g className="NaturalLinks">{this.props.naturalLinks}</g>
            <g className="AdditionalLinks">{this.props.additionalLinks}</g>
            <g className="GraphicalNodes">{this.props.graphicalNodes}</g>
          </g>
        </g>
        {this.props.children}
      </g>
    )
  }
}
Stage.propTypes = {
  zoomX: PropTypes.number.isRequired,
  zoomY: PropTypes.number.isRequired,
  transX: PropTypes.number.isRequired,
  transY: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  naturalLinks: PropTypes.array.isRequired,
  graphicalNodes: PropTypes.array.isRequired,
  additionalLinks: PropTypes.array.isRequired,
}
module.exports = Stage
