const React = require('react')
const { Component } = React
const { Motion, spring } = require('react-motion')
const ConversationNode = require('./conversation-node')
const GraphicalNode = require('./graphical-node')
const styled = require('styled-components').default
const d3 = require('d3-shape')
const { path } = require('d3-path')

const NULL_LINE = {
  source: { x: 0, y: 0, id: null },
  target: { x: 0, y: 0 },
}

class Screen extends Component {
  constructor () {
    super(...arguments)

    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDragMove = this.handleDragMove.bind(this)
    this.handleDragBegin = this.handleDragBegin.bind(this)
    this.handleDragCancel = this.handleDragCancel.bind(this)

    this.state = {
      line : NULL_LINE,
      dragging: false,
    }
  }
  handleDragEnd (dragState) {
    dragState.dragging = false
    this.setState({ dragging: false, line: NULL_LINE })
    // console.log('FINAL DRAG STATE')
    // console.log(dragState)
    this.props.onLinkAdd(dragState.line.source.id, dragState.line.target.id)
  }
  handleDragMove (e) {
    const targetX = e.screenX - (this.props.w / 2) + this.props.x
    const targetY = e.screenY - (this.props.h / 2) + this.props.y - 96
    const line = {
      source: this.state.line.source,
      target: {
        x: targetX,
        y: targetY,
      },
    }
    this.setState({ line })
  }
  handleDragBegin (dragState) {
    dragState.dragging = true
    this.setState(dragState)
  }
  handleDragCancel (_, cb)  {
    const callback = cb || (() => {})
    this.setState({
      dragging: false,
      line: NULL_LINE,
    }, callback)
  }
  generateLink ({ source, target }) {
    const p = path()

    p.moveTo(source.x, source.y)
    p.bezierCurveTo(
      source.x, target.y,
      target.x, source.y,
      target.x, target.y
    )
    p.bezierCurveTo(
      target.x, source.y,
      source.x, target.y,
      source.x, source.y
    )
    p.closePath()
    return p.toString()
  }
  updateLine ({ line }) {
    this.setState({ line })
  }
  render () {
    const { x, y, w, h, zoomX, zoomY, baseZoom, maxZoomX, maxZoomY } = this.props
    const Path = styled.path`
      stroke: #099;
      stroke-width: 1px;
      stroke-linecap: round;
      fill: none;
    `

    const transX = (x * zoomX * -1) + (w / 2)
    const transY = (y * zoomY * -1) + (h / 2)

    const conversationNodes = this.props.nodes.filter((n) => (
      n.data.id === this.props.selectedId
    )).map((n, i) => {
      return (
        <ConversationNode
          editing={this.props.editing}
          onButtonChange={this.props.onButtonChange}
          onButtonDelete={this.props.onButtonDelete}
          onButtonAdd={this.props.onButtonAdd}
          onMessageDelete={this.props.onMessageDelete}
          onMessageChange={this.props.onMessageChange}
          onMessageAdd={this.props.onMessageAdd}
          zoomX={this.props.zoomX}
          zoomY={this.props.zoomY}
          key={`conversation-${i}`}
          additionalLinks={this.props.additionalLinks}
          node={n}
          ee={this.props.ee}
          w={w}
          h={h} />
      )
    })
    const graphicalNodes = this.props.nodes.map((n, i) => (
      <GraphicalNode
        dragSource={this.state.line.source}
        dragging={this.state.dragging}
        onDragBegin={this.handleDragBegin}
        onDragCancel={this.handleDragCancel}
        onDragEnd={this.handleDragEnd}
        ee={this.props.ee}
        key={`graphical-${i}`}
        node={n}
        zoom={zoomY}
        w={w}
        h={h} />
    ))
    const naturalLinks = this.props.links.map((l, i) => {
      return (
        <Path d={this.generateLink(l)} key={`natural-link-${i}`}/>
      )
    })

    const additionalLinks = this.props.additionalLinks.map((l, i) => {
      return (
        <Path d={this.generateLink(l)} key={`additional-link-${i}`}/>
      )
    })

    if (this.state.dragging) naturalLinks.push(<Path d={this.generateLink(this.state.line)} key={'why-hello-there'}/>)

    const storylineMode = zoomX <= 1 && this.props.editing

    return (
      <svg
        onMouseMove={this.state.dragging ? this.handleDragMove : null}
        onMouseUp={this.state.dragging ? this.handleDragCancel : null}
        onMouseLeave={this.state.dragging ? this.handleDragCancel : null}
        width={w}
        height={h}>
        <g>
          <g
            className="ScreenTranslater"
            transform={`translate(${transX}, ${transY})`}>
            <g
              className="ScreenScaler"
              transform={`scale(${this.props.zoomX}, ${this.props.zoomY})`}>
              <g className="NaturalLinks">{naturalLinks}</g>
              <g className="AdditionalLinks">{additionalLinks}</g>
              <g className="GraphicalNodes">{graphicalNodes}</g>
            </g>
          </g>
          {storylineMode ? null : <g className="ConversationNodes">{conversationNodes}</g>}
        </g>
      </svg>
    )
  }
}
module.exports = Screen
