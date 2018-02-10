const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const Button = require('./button')

const FONT_SIZE = '1.75em'

const MessageContainer = styled.li`
  font-size: ${FONT_SIZE};
  margin: auto;
  flex: 1 1 auto;
  width: 96vw;
  flex-flow: row nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s;
`

const P = styled.p`
  margin: auto;
  font-size: ${FONT_SIZE};
`

const Input = styled.input`
  margin: auto;
  border: none;
  outline: none;
  width: 90%;
  text-align: center;
  color: #f09;
  font-size: ${FONT_SIZE};
`

const Div = styled.div`
  margin: auto;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
`

const A = styled.a`
  width: 10%;
  margin: auto;
  font-size: ${FONT_SIZE};
`

class Message extends Component {
  constructor () {
    super(...arguments)
    this.renderDisplayMessage = this.renderDisplayMessage.bind(this)
    this.handleMessageDelete = this.handleMessageDelete.bind(this)
  }
  handleMessageDelete () {
    this.props.onMessageDelete(this.props.nodeId, this.props.messageIndex)
  }
  renderDisplayMessage () {
    if (this.props.editing) return (
      <Div key={`${this.props.nodeId}.${this.props.messageIndex}`}>
        {
          <Button
          editing={false}
          opacity={this.props.opacity}
          onClick={this.handleMessageDelete}
          key='new button'>delete</Button>
        }
        <Input
          key={`${this.props.nodeId}.${this.props.messageIndex}`}
          value={this.props.children}
          onChange={(e) => {
            this.props.onChange(this.props.nodeId, this.props.messageIndex, e.currentTarget.value)
          }}/>
      </Div>
    )
    return (
      <P>{this.props.children}</P>
    )
  }
  render () {
    return (
      <MessageContainer onClick={this.props.onClick}>
        {this.renderDisplayMessage()}
      </MessageContainer>
    )
  }
}

module.exports = Message
