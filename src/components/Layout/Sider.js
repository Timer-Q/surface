import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Sider extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static isSider = true

  render() {
    const { className, style } = this.props

    const cls = classNames('layout-sider', {
      [className]: className,
    })

    return (
      <div style={style} className={cls}>
        <div className="layout-sider-children">{this.props.children}</div>
      </div>
    )
  }
}
