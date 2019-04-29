import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Footer extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static isFooter = true

  render() {
    const { className, style } = this.props

    const cls = classNames('layout-footer', {
      [className]: className,
    })

    return (
      <div style={style} className={cls}>
        {this.props.children}
      </div>
    )
  }
}
