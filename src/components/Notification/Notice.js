import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Transition from '../Transition'
import Icon from '../Icon'

function noop() {}

export default class Notice extends Component {
  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.object,
    ]),
    duration: PropTypes.number,
    onClose: PropTypes.func,
    onClick: PropTypes.func,
    placement: PropTypes.oneOf([
      'topLeft',
      'topRight',
      'bottomLeft',
      'bottomRight',
    ]),
    style: PropTypes.object,
    className: PropTypes.string,
    icon: PropTypes.string,
    type: PropTypes.string,
  }

  static defaultProps = {
    duration: 4.5,
    onClose: noop,
    placement: 'topRight',
    onClick: noop,
  }

  componentDidMount() {
    this.setCloseTimer()
  }

  componentDidUpdate() {
    this.reSetCloseTimer()
  }

  componentWillUnmount() {
    this.clearCloseTimer()
  }

  setCloseTimer = () => {
    const { duration } = this.props
    if (duration > 0) {
      this.timer = setTimeout(() => {
        this.closeNotice()
      }, duration * 1000)
    }
  }

  clearCloseTimer = () => {
    clearTimeout(this.timer)
  }

  reSetCloseTimer = () => {
    this.clearCloseTimer()
    this.setCloseTimer()
  }

  handleClose = () => {
    this.closeNotice()
  }

  closeNotice = () => {
    this.props.onClose()
  }

  handleClick = () => {
    this.props.onClick()
  }

  renderCloseBtn = () => {
    return (
      <div onClick={this.handleClose} className="notice-close">
        <Icon type="close" />
      </div>
    )
  }

  renderIcon = () => {
    const { icon } = this.props
    if (icon) {
      return <Icon className="notice-header-icon" type={icon} />
    }
    return null
  }

  renderContent = () => {
    const { content } = this.props
    const closeBtn = this.renderCloseBtn()
    const iconNode = this.renderIcon()
    let nodes
    if (typeof content === 'object') {
      nodes = (
        <React.Fragment>
          {content.title && (
            <div className="notice-header">
              {iconNode}
              {content.title}
              {closeBtn}
            </div>
          )}
          {content.description && (
            <div className="notice-content">{content.description}</div>
          )}
          {content.footer && (
            <div className="notice-footer">{content.footer}</div>
          )}
        </React.Fragment>
      )
    } else {
      nodes = (
        <React.Fragment>
          <div className="notice-header">
            {closeBtn}
          </div>
          {content}
        </React.Fragment>
      )
    }
    return nodes
  }

  render() {
    const content = this.renderContent()
    const { style, className, type } = this.props
    const cls = classNames('notice', {
      [className]: !!className,
      [`notice-${type}`]: !!type,
    })
    return (
      <Transition transitionName="dropdown" in={true}>
        <div style={style} className={cls} onClick={this.handleClick}>
          {content}
        </div>
      </Transition>
    )
  }
}
