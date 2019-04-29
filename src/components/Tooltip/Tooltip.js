import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popover from '../Popover'
import './style/tooltip.scss'

export default class Tooltip extends Component {
  static propTypes = {
    children: PropTypes.node,
    theme: PropTypes.oneOf(['light', 'dark']),
    title: PropTypes.node,
    placement: PropTypes.string,
    trigger: PropTypes.oneOf(['hover', 'click', 'focus']),
  }

  static defaultProps = {
    placement: 'top-start',
    theme: 'light',
    trigger: 'hover',
  }

  renderContent = () => {
    const { title } = this.props
    if (title) {
      let content = null
      const { theme } = this.props
      const cls = classNames('tooltip-message', {
        [`tooltip-message-${theme}`]: theme,
      })
      content = <div className={cls}>{title}</div>
      return content
    }
    return null
  }

  render() {
    const { children, ...rest } = this.props
    const content = this.renderContent()
    if (!content) {
      return children
    }
    return (
      <div className="tooltip">
        <Popover content={content} {...rest}>
          {children}
        </Popover>
      </div>
    )
  }
}
