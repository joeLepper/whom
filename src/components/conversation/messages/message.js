const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const Button = require('../../button')
const PropTypes = require('prop-types')
const { guid } = require('../../../validators')

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
class Message extends Component {
  constructor(props) {
    super(...arguments)
    this.renderDisplayMessage = this.renderDisplayMessage.bind(this)
    this.handleMessageDelete = this.handleMessageDelete.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = { value: props.children }
  }
  handleMessageDelete() {
    this.props.onMessageDelete(this.props.nodeId, this.props.messageIndex)
  }
  handleChange(e) {
    this.setState({ value: e.currentTarget.value })
  }
  componentWillReceiveProps(nextProps) {
    const { children, editing } = this.props
    if (nextProps.children !== children)
      this.setState({
        value: nextProps.children,
      })
    if (!nextProps.editing && editing)
      this.props.onChange(
        this.props.nodeId,
        this.props.messageIndex,
        this.state.value,
      )
  }
  renderDisplayMessage() {
    if (this.props.editing)
      return (
        <Div key={`div-${this.props.nodeId}.${this.props.messageIndex}`}>
          <Button
            editing={false}
            opacity={1}
            onClick={this.handleMessageDelete}
            key="new button">
            delete
          </Button>
          <Input
            size={this.state.value.length}
            key={`${this.props.nodeId}.${this.props.messageIndex}`}
            value={this.state.value}
            onChange={this.handleChange}
          />
        </Div>
      )
    return <P>{this.state.value}</P>
  }
  render() {
    return (
      <MessageContainer onClick={this.props.onClick}>
        {this.renderDisplayMessage()}
      </MessageContainer>
    )
  }
}
Message.propTypes = {
  editing: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
  messageIndex: PropTypes.number.isRequired,
  nodeId: guid.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onMessageDelete: PropTypes.func.isRequired,
}

module.exports = Message
