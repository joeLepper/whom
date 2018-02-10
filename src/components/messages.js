const React = require('react')
const { Component } = React
const styled = require('styled-components').default

const Message = require('./message')


const Li = styled.li`
  cursor: pointer;
`
const MessagesContainer = styled.ul`
  list-style: none;
  display: inline-flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex: 1 1 100%;
  margin: auto;
  padding: 0;
  cursor: pointer;
`

class Messages extends Component {
  render () {
    const msg = this.props.node.data.messages[this.props.index]
    return (
      <MessagesContainer
        key={`${this.props.node.data.id}.${this.props.index}`}
        style={{
          opacity: this.props.opacity,
        }}>
        <Li onClick={this.props.editing ? () => {} : this.props.reverseMessage}><a>{'<'}</a></Li>
        <Message
          key={`${this.props.node.data.id}.${this.props.index}`}
          zoomRatio={this.props.zoomRatio}
          onMessageDelete={this.props.onMessageDelete}
          onClick={this.props.editing ? () => {} : this.props.advanceMessage}
          nodeId={this.props.node.data.id}
          messageIndex={this.props.index}
          editing={this.props.editing}
          onChange={this.props.onMessageChange}>{msg}</Message>
        <Li onClick={this.props.editing ? () => {
          if (this.props.index === this.props.node.data.messages.length - 1) {
            this.props.onMessageAdd(this.props.node.data.id, () => {
              this.props.advanceMessage()
            })
          }
          else this.props.advanceMessage()
        } : this.props.advanceMessage}>
          <a>{this.props.editing && (this.props.index === this.props.node.data.messages.length - 1) ? '+' : '>'}</a>
        </Li>
      </MessagesContainer>
    )
  }
}

module.exports = Messages
