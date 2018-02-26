const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const PropTypes = require('prop-types')
const { guid, node } = require('../../validators')

const Circle = styled.circle`
  fill: #f09;
`
const ActiveCircle = styled.circle`
  fill: #9f0;
`
const HitTarget = styled.circle`
  fill: rgba(0, 0, 0, 0);
  cursor: pointer;
`
class GraphicalNode extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      hover: false,
      active: false,
    }
  }
  render() {
    return (
      <g
        onMouseUp={(e) => {
          e.stopPropagation()
          e.preventDefault()

          if (this.props.dragging) {
            const { dragSource, node } = this.props

            if (node.data.id === dragSource.id) this.props.onDragCancel()
            else {
              const dragState = {
                line: {
                  source: dragSource,
                  target: {
                    x: node.x,
                    y: node.y,
                    id: node.data.id,
                  },
                },
              }
              this.props.onDragEnd(dragState)
            }
          }
        }}
        transform={`translate(${this.props.node.x}, ${this.props.node.y})`}>
        <Circle r={this.state.hover ? 8 : 2} />
        {this.state.hover ? <ActiveCircle r={5} /> : null}
        {this.state.hover ? <Circle r={2} /> : null}
        <HitTarget
          onMouseEnter={() => {
            this.setState({ hover: true })
          }}
          onMouseLeave={() => {
            this.setState({ hover: false })
          }}
          onMouseDown={() => {
            const { node } = this.props
            const dragState = {
              line: {
                source: { x: node.x, y: node.y, id: node.data.id },
                target: { x: node.x, y: node.y },
              },
            }
            this.props.onDragBegin(dragState)
          }}
          r={20}
        />
      </g>
    )
  }
}

GraphicalNode.propTypes = {
  dragging: PropTypes.bool.isRequired,
  dragSource: PropTypes.shape({
    id: guid,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  node: PropTypes.shape(node),
  onDragBegin: PropTypes.func.isRequired,
  onDragCancel: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
}

module.exports = GraphicalNode
