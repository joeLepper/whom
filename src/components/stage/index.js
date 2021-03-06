const React = require('react')
const { PureComponent } = React
const PropTypes = require('prop-types')

class Scaler extends PureComponent {
  render() {
    return (
      <g className="IllustrationScaler">
        <g className="NaturalLinks">{this.props.naturalLinks}</g>
        <g className="AdditionalLinks">{this.props.additionalLinks}</g>
        <g className="GraphicalNodes">{this.props.graphicalNodes}</g>
      </g>
    )
  }
}

class Illustration extends PureComponent {
  render() {
    return (
      <g
        className="Illustration"
        transform={`translate(${this.props.transX}, ${this.props.transY})`}>
        <Scaler
          naturalLinks={this.props.naturalLinks}
          additionalLinks={this.props.additionalLinks}
          graphicalNodes={this.props.graphicalNodes}
        />
      </g>
    )
  }
}

class Stage extends PureComponent {
  render() {
    return (
      <g className="Stage">
        {this.props.children}
        <Illustration
          transX={this.props.transX}
          transY={this.props.transY}
          naturalLinks={this.props.naturalLinks}
          additionalLinks={this.props.additionalLinks}
          graphicalNodes={this.props.graphicalNodes}
        />
      </g>
    )
  }
}
Stage.propTypes = {
  transX: PropTypes.number.isRequired,
  transY: PropTypes.number.isRequired,
  children: PropTypes.node,
  naturalLinks: PropTypes.array.isRequired,
  graphicalNodes: PropTypes.array.isRequired,
  additionalLinks: PropTypes.array.isRequired,
}
module.exports = Stage
