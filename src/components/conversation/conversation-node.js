const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const PropTypes = require('prop-types')
const qs = require('qs')

const Messages = require('./messages')
const Buttons = require('./buttons')
const { node } = require('../../validators')

const Div = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`
class ConversationNode extends Component {
  constructor() {
    super(...arguments)
    this.advanceMessage = this.advanceMessage.bind(this)
    this.reverseMessage = this.reverseMessage.bind(this)
    this.handleMessageDelete = this.handleMessageDelete.bind(this)
    this.renderButtons = this.renderButtons.bind(this)
    this.renderMessages = this.renderMessages.bind(this)
    this.getCurrentIndex = this.getCurrentIndex.bind(this)
    this.updateIndex = this.updateIndex.bind(this)
    this.state = { opacity: 1 }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.node.data.id !== nextProps.node.data.id) {
      const viewed = qs.parse(nextProps.location.search.substring(1))
      if (viewed[nextProps.node.data.id] === undefined) {
        viewed[nextProps.node.data.id] = 0
        const to = {
          pathname: nextProps.location.pathname,
          search: qs.stringify(viewed, { encode: false }),
        }
        this.props.history.replace(to)
      }
    }
  }
  updateIndex(idx) {
    const search = qs.parse(this.props.location.search.substring(1))
    search[this.props.node.data.id] = idx
    const to = {
      pathname: this.props.location.pathname,
      search: qs.stringify(search),
    }
    this.props.history.replace(to)
  }
  getCurrentIndex() {
    const viewed = qs.parse(this.props.location.search.substring(1))
    return +viewed[this.props.node.data.id] || 0
  }
  advanceMessage() {
    const proposedIdx = this.getCurrentIndex() + 1
    this.setState({ opacity: 0 }, () => {
      const messagesLength = this.props.node.data.messages.length
      if (proposedIdx < messagesLength) this.updateIndex(proposedIdx)
    })
    setTimeout(() => this.setState({ opacity: 1 }), 500)
  }
  reverseMessage(cb) {
    const proposedIdx = this.getCurrentIndex() - 1
    this.setState({ opacity: 0 }, () => {
      if (proposedIdx >= 0) this.updateIndex(proposedIdx)
    })
    setTimeout(() => this.setState({ opacity: 1 }, cb), 500)
  }
  handleMessageDelete(nodeId, messageIndex) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Delete this message?'))
      this.reverseMessage(() => {
        this.props.onMessageDelete(nodeId, messageIndex)
      })
  }
  renderButtons(index) {
    return (
      <Buttons
        history={this.props.history}
        editing={this.props.editing}
        location={this.props.location}
        personId={this.props.personId}
        onButtonAdd={this.props.onButtonAdd}
        onButtonChange={this.props.onButtonChange}
        onButtonDelete={this.props.onButtonDelete}
        opacity={this.props.node.data.messages.length - 1 === index ? 1 : 0}
        additionalLinks={this.props.additionalLinks}
        node={this.props.node}
      />
    )
  }
  renderMessages(index) {
    return (
      <Messages
        advanceMessage={this.advanceMessage}
        reverseMessage={this.reverseMessage}
        opacity={this.state.opacity}
        index={index}
        onMessageDelete={this.handleMessageDelete}
        onMessageChange={this.props.onMessageChange}
        onMessageAdd={this.props.onMessageAdd}
        editing={this.props.editing}
        zoomRatio={this.props.zoomRatio}
        node={this.props.node}
      />
    )
  }
  render() {
    const index = this.getCurrentIndex()
    return (
      <foreignObject width={this.props.w} height={this.props.h}>
        <Div>
          {this.renderMessages(index)}
          {this.renderButtons(index)}
        </Div>
      </foreignObject>
    )
  }
}

ConversationNode.propTypes = {
  additionalLinks: PropTypes.array.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  zoomRatio: PropTypes.number.isRequired,
  personId: PropTypes.string.isRequired,
  editing: PropTypes.bool.isRequired,
  node: PropTypes.shape(node),
  onButtonAdd: PropTypes.func.isRequired,
  onButtonChange: PropTypes.func.isRequired,
  onButtonDelete: PropTypes.func.isRequired,
  onMessageAdd: PropTypes.func.isRequired,
  onMessageChange: PropTypes.func.isRequired,
  onMessageDelete: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

module.exports = ConversationNode
