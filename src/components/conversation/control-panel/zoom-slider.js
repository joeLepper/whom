const React = require('react')
const { Component } = React
const styled = require('styled-components').default

const PINK = '#f09'
const BLACK = '#000'
const WHITE = '#fff'
const ALMOST_BLACK = '#010101'
const TRACK_HEIGHT = '2px'
const TRACK_WIDTH = '8vw'

const Input = styled.input`
  -webkit-appearance: none;
  margin: 18px 0;
  width: ${TRACK_WIDTH};
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: ${TRACK_WIDTH};
    height: ${TRACK_HEIGHT};
    cursor: pointer;
    background: ${PINK};
    border-radius: 1.3px;
    border: 0.2px solid ${ALMOST_BLACK};
  }
  &::-webkit-slider-thumb {
    border: 1px solid ${BLACK};
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: ${WHITE};
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -14px;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #${PINK};
  }
  &::-moz-range-track {
    width: ${TRACK_WIDTH};
    height: ${TRACK_HEIGHT};
    cursor: pointer;
    animate: 0.2s;
    background: ${PINK};
    border-radius: 1.3px;
    border: 0.2px solid ${ALMOST_BLACK};
  }
  &::-moz-range-thumb {
    border: 1px solid ${BLACK};
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: ${WHITE};
    cursor: pointer;
  }
  &::-ms-track {
    width: ${TRACK_WIDTH};
    height: ${TRACK_HEIGHT};
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }
  &::-ms-fill-lower {
    background: #2a6495;
    border: 0.2px solid ${ALMOST_BLACK};
    border-radius: 2.6px;
  }
  &::-ms-fill-upper {
    background: ${PINK};
    border: 0.2px solid ${ALMOST_BLACK};
    border-radius: 2.6px;
  }
  &::-ms-thumb {
    border: 1px solid ${BLACK};
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: ${WHITE};
    cursor: pointer;
  }
  &:focus::-ms-fill-lower {
    background: ${PINK};
  }
  &:focus::-ms-fill-upper {
    background: #${PINK};
  }
`

const Div = styled.div`
  width: 10vw;
`

class ZoomSlider extends Component {
  render() {
    return (
      <Div>
        <Input
          type="range"
          min={this.props.baseZoom}
          max={this.props.maxZoomX}
          value={this.props.zoomX}
          step="0.1"
          onChange={e => {
            const val = Math.round(e.currentTarget.value * 10) / 10
            this.props.onZoomChange({ zoom: { x: val, y: val } })
          }}
        />
        <span>{this.props.zoomX}</span>
      </Div>
    )
  }
}
module.exports = ZoomSlider
