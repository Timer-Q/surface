import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Star from './Star'
import Icon from '../Icon'
import './style/rate.scss'

function noop() {}

export default class Rate extends Component {
  static propTypes = {
    children: PropTypes.node,
    character: PropTypes.node,
    count: PropTypes.number,
    disabled: PropTypes.bool,
    allowHalf: PropTypes.bool,
    allowClear: PropTypes.bool,
    onHoverChange: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    character: <Icon type="star" />,
    count: 5,
    onHoverChange: noop,
    onChange: noop,
    allowHalf: false,
    allowClear: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: null,
      focused: false,
      cleanedValue: null,
    }
    this.starRefs = {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value && nextProps.value !== prevState.value) {
      return {
        value: nextProps.value,
      }
    }
    return null
  }

  changeValue(value) {
    if (!('value' in this.props)) {
      this.setState({
        value,
      })
    }
    const { onChange } = this.props
    onChange(value)
  }

  onHover = (event, index) => {
    const hoverValue = this.getValue(index, event.pageX)
    const { hoverValue: hoverValueInState } = this.state
    if (hoverValueInState !== hoverValue) {
      this.setState({
        hoverValue,
      })
    }
    const { onHoverChange } = this.props
    onHoverChange(index)
  }

  onBlur = () => {
    this.setState({
      hoverValue: undefined,
    })
  }

  onClick = (event, index) => {
    const { value: valueInState } = this.state
    const { allowClear } = this.props
    const value = this.getValue(index, event.pageX)
    let cleanValue = false
    if (allowClear) {
      cleanValue = value === valueInState
    }
    this.changeValue(cleanValue ? 0 : value)
  }

  saveRef = index => node => {
    this.starRefs[index] = node
  }

  getStarEl(index) {
    // eslint-disable-next-line
    return ReactDOM.findDOMNode(this.starRefs[index])
  }

  getOffsetLeft(el) {
    const elRect = el.getBoundingClientRect()
    const left = elRect.x + (window.pageXOffset || 0)
    return left
  }

  getValue(index, pageX) {
    let value = index + 1
    const { allowHalf } = this.props
    if (allowHalf) {
      const starEl = this.getStarEl(index)
      const offsetLeft = this.getOffsetLeft(starEl)
      const width = starEl.clientWidth
      if (pageX - offsetLeft < width / 2) {
        value -= 0.5
      }
    }
    return value
  }

  renderStars = () => {
    const { count, disabled, allowHalf, character } = this.props
    const { hoverValue, value, focused } = this.state
    const stars = []
    for (let index = 0; index < count; index++) {
      stars.push(
        <Star
          ref={this.saveRef(index)}
          index={index}
          count={count}
          disabled={disabled}
          allowHalf={allowHalf}
          value={hoverValue === undefined ? value : hoverValue}
          onClick={this.onClick}
          onHover={this.onHover}
          key={index}
          character={character}
          focused={focused}
        />
      )
    }
    return stars
  }

  render() {
    const { disabled } = this.props
    return (
      <ul className="rate" onMouseLeave={disabled ? null : this.onBlur}>
        {this.renderStars()}
      </ul>
    )
  }
}
