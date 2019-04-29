import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Star extends Component {
  static propTypes = {
    character: PropTypes.node,
    onHover: PropTypes.func,
    onClick: PropTypes.func,
    index: PropTypes.number,
    value: PropTypes.number,
    allowHalf: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  handleHover = event => {
    const { onHover, index } = this.props
    if (onHover) {
      onHover(event, index)
    }
  }

  handleClick = (event) => {
    const { onClick, index } = this.props
    if (onClick) {
      onClick(event, index)
    }
  }

  getActiveCls = () => {
    const { value, allowHalf, index } = this.props
    const startValue = index + 1
    let cls = 'rate-star'
    if (allowHalf && value + 0.5 >= startValue && value < startValue) {
      cls += ' rate-star-half rate-star-active'
    } else {
      cls += startValue <= value ? ' rate-star-full' : ' rate-star-zero'
    }
    return cls
  }

  render() {
    const { character, disabled } = this.props
    return (
      <li
        className={this.getActiveCls()}
        onMouseMove={disabled ? null : this.handleHover}
        onClick={disabled ? null : this.handleClick}>
        <div className="rate-star-pre">{character}</div>
        <div className="rate-star-after">{character}</div>
      </li>
    )
  }
}
