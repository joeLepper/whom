const React = require('react')
const { Component } = React
const styled = require('styled-components').default

const PINK = '#f09'
const WHITE = '#FFF'
const FONT_SIZE = '1.5em'

const ButtonContainer = styled.div`
  margin: 1vh 1vw;
  display: flex;
  justify-content: center;
  border-top: solid 1px ${PINK};
  border-bottom: solid 1px transparent;
  background-color: transparent;
  padding 0.5vh 0.5vw;
  font-size: ${FONT_SIZE};
  &:hover{
    border-top: solid 1px transparent;
    border-bottom: solid 1px ${PINK};
  }
`

const A = styled.a`
  text-decoration: none;
  color: ${PINK};
  padding: 0.125em;
`

const Input = styled.input`
  font-size: ${FONT_SIZE};
  border: none;
  outline: none;
  margin: auto;
  padding: 0;
  text-align: center;
  width: 100%;
  background-color: transparent;
`

class Button extends Component {
  constructor () {
    super(...arguments)
    this.handleClick = this.handleClick.bind(this)
    this.handleButtonDelete = this.handleButtonDelete.bind(this)
    this.renderDisplayMessage = this.renderDisplayMessage.bind(this)
  }
  handleClick (e) {
    e.preventDefault()
    if (!this.props.editing) this.props.onClick(e)
  }
  renderDisplayMessage () {
    if (this.props.editing) return (
      <Input
        size={this.props.children.length}
        value={this.props.children}
        onChange={(e) => {
          this.props.onChange(this.props.nodeId, e.currentTarget.value)
        }}/>
    )
    return (
      <A>{this.props.children}</A>
    )
  }
  handleButtonDelete () {
    this.props.onButtonDelete(this.props.nodeId)
  }
  render () {
    const containerStyle = {
      opacity: this.props.opacity,
    }
    if (this.props.opacity) containerStyle.cursor = 'pointer'
    return (
      <ButtonContainer
        className={this.props.className}
        onClick={this.handleClick}
        style={Object.assign(containerStyle, this.props.style)}>
        {this.props.editing ? (
          <a onClick={this.handleButtonDelete}>X</a>
        ) : null}
        {this.renderDisplayMessage()}
      </ButtonContainer>
    )
  }
}

module.exports = Button
