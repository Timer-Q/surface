import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Content extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static isContent = true

  render() {
    const { className, style } = this.props

    const cls = classNames('layout-content', {
      [className]: className,
    })

    return (
      <div style={style} className={cls}>
        {this.props.children}
      </div>
    )
  }
}
