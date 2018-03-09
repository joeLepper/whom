const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const PropTypes = require('prop-types')
const { guid } = require('../validators')

const PINK = '#f09'
const WHITE = '#fff'
const GREEN = '#0f0'
const FONT_SIZE = '1.5em'

const ButtonContainer = styled.div`
  margin: 1vh 1vw;
  display: flex;
  justify-content: center;
  background-color: ${PINK};
  padding 0.5vh 0.5vw;
  font-size: ${FONT_SIZE};
  color: ${GREEN};
  &:hover{
    background-color: ${GREEN};
    color: ${PINK};
  }
`

const A = styled.a`
  text-decoration: none;
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
  constructor(props) {
    super(...arguments)
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleButtonDelete = this.handleButtonDelete.bind(this)
    this.renderDisplayMessage = this.renderDisplayMessage.bind(this)
    this.state = { value: props.children }
  }
  handleClick(e) {
    e.preventDefault()
    if (!this.props.editing) this.props.onClick(e)
  }
  handleButtonDelete() {
    this.props.onButtonDelete(this.props.nodeId)
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
      this.props.onChange(this.props.nodeId, this.state.value)
  }
  renderDisplayMessage() {
    if (this.props.editing)
      return (
        <Input
          key={this.props.nodeId}
          size={this.state.value.length}
          value={this.state.value}
          onChange={this.handleChange}
        />
      )
    return <A>{this.state.value}</A>
  }
  render() {
    const containerStyle = {
      opacity: this.props.opacity,
    }
    if (this.props.opacity) containerStyle.cursor = 'pointer'
    return (
      <ButtonContainer
        className={this.props.className}
        onClick={this.handleClick}
        style={Object.assign(containerStyle, this.props.style)}>
        {this.props.editing ? <a onClick={this.handleButtonDelete}>X</a> : null}
        {this.renderDisplayMessage()}
      </ButtonContainer>
    )
  }
}

Button.propTypes = {
  children: PropTypes.string.isRequired,
  editing: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  opacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.shape({
    fontSize: PropTypes.number,
  }),
  className: PropTypes.string,
  onButtonDelete: PropTypes.func,
  onChange: PropTypes.func,
  nodeId: guid,
}

module.exports = Button
