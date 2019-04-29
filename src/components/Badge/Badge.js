import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/badge.scss'

export default class Badge extends Component {
  static propTypes = {
    children: PropTypes.node,
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    overflowCount: PropTypes.number,
    text: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    dot: PropTypes.bool,
    processing: PropTypes.bool,
    status: PropTypes.oneOf(['success', 'default', 'error', 'warning']),
  }

  static defaultProps = {
    overflowCount: 99,
    dot: false,
    processing: false,
    status: 'error',
  }

  render() {
    const {
      children,
      count,
      overflowCount,
      dot,
      status,
      processing,
      style,
      text,
      className,
    } = this.props

    let newCount = ''
    if (count >= 0) {
      newCount = count > overflowCount ? `${overflowCount}+` : count
    }

    if (dot) {
      newCount = ''
    }

    const cls = classNames('', {
      'badge-count': !dot,
      'badge-dot': dot,
      'badge-processing': processing,
      [`badge-${status}`]: status,
      'badge-absolute': !!children,
      [className]: className,
    })

    return (
      <span className="badge">
        {children}
        <sup style={style} className={cls}>
          {newCount} {text}
        </sup>
      </span>
    )
  }
}
