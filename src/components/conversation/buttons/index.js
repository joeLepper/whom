const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const Guid = require('guid')
const qs = require('qs')
const Button = require('../../button')

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: row;
  flex: 1 1 100vw;
`

class Buttons extends Component {
  constructor() {
    super(...arguments)
    this.handleButtonAdd = this.handleButtonAdd.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }
  handleButtonAdd() {
    const newNodeId = Guid.raw()
    const currentNodeId = this.props.node.data.id
    this.props.onButtonAdd(newNodeId, currentNodeId)
  }
  handleButtonClick(child) {
    return (e) => {
      if (!this.props.editing) {
        const { personId } = this.props
        const search = qs.parse(this.props.location.search.substring(1))
        const to = {
          pathname: `/person/${personId}/node/${child.data.id}`,
          search: `?${qs.stringify(search, { encode: false })}`,
        }
        this.props.history.push(to)
      }
    }
  }
  render() {
    if (
      !this.props.node.data.children &&
      !(this.props.additionalLinks && this.props.additionalLinks.length) &&
      !this.props.editing
    )
      return null
    const buttons = (this.props.node.children || [])
      .map((child, i) => {
        return (
          <Button
            zoomed={this.props.zoomed}
            nodeId={child.data.id}
            editing={this.props.editing}
            opacity={this.props.opacity}
            onChange={this.props.onButtonChange}
            key={`natural-child-${i}`}
            className="natural-child"
            onButtonDelete={this.props.onButtonDelete}
            onClick={this.handleButtonClick(child)}>
            {child.data.optionText}
          </Button>
        )
      })
      .concat(
        this.props.additionalLinks
          .filter((link) => {
            return this.props.node.data.id === link.source.data.id
          })
          .map((link, i) => {
            return (
              <Button
                zoomed={this.props.zoomed}
                nodeId={link.childId}
                editing={this.props.editing}
                opacity={this.props.opacity}
                onChange={this.props.onButtonChange}
                key={`adopted-child-${i}`}
                className="adopted-child"
                onButtonDelete={this.props.onButtonDelete}
                onClick={this.handleButtonClick(link.target)}>
                {link.optionText}
              </Button>
            )
          }),
      )
    if (this.props.editing)
      buttons.push(
        <Button
          editing={false}
          opacity={this.props.opacity}
          onClick={this.handleButtonAdd}
          key="new button">
          New Button
        </Button>,
      )
    return <ButtonsContainer>{buttons}</ButtonsContainer>
  }
}

// propTypes can be found in ../button

module.exports = Buttons
