const React = require('react')
const { Component } = React
const styled = require('styled-components').default
const Button = require('../button')
const route = require('../../route')

const Div = styled.div`
  display: flex;
  flex: row wrap;
`

class PersonButton extends Component {
  constructor () {
    super(...arguments)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    route.update(`/person/${this.props.personId}`)
  }
  render () {
    return (
      <div >
        <Button
          key={this.props.personId}
          opacity={1}
          editing={false}
          onClick={this.handleClick}>{this.props.personId}</Button>

      </div>
    )
  }
}
module.exports = PersonButton
