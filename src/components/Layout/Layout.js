import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/layout.scss'

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  render() {
    const { children, className, style } = this.props
    let hasSider = false
    React.Children.forEach(children, child => {
      if (child.type && child.type.isSider) {
        hasSider = true
      }
    })

    const cls = classNames('layout', {
      'has-sider': hasSider,
      [className]: className,
    })
    return (
      <div className={cls} style={style}>
        {this.props.children}
      </div>
    )
  }
}
