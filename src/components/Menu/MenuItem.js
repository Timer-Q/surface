import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class MenuItem extends Component {
  static isMenuItem = true

  static propTypes = {
    index: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    activeIndex: PropTypes.array,
    handleSelect: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    activeClass: PropTypes.string,
    activeStyle: PropTypes.object,
    style: PropTypes.object,
  }

  active() {
    const { index, activeIndex } = this.props
    if (activeIndex) {
      return index === activeIndex || activeIndex.indexOf(index) > -1
    }
  }

  handleClick = event => {
    event.stopPropagation()
    const { index, handleSelect } = this.props
    handleSelect([index], this)
  }

  render() {
    const isActive = this.active()
    const {
      disabled,
      children,
      className,
      activeClass,
      style,
      activeStyle,
    } = this.props
    const cls = classNames('menu-item', {
      'is-active': isActive,
      [activeClass]: activeClass && isActive,
      'is-disabled': disabled,
      [className]: className,
    })
    let itemStyle = style

    if (isActive) {
      itemStyle = {...itemStyle, ...activeStyle}
    }

    return (
      <li className={cls} style={itemStyle} onClick={this.handleClick}>
        {children}
      </li>
    )
  }
}
