import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../Icon'
import './style/alert.scss'

export default class Alert extends Component {
  static propTypes = {
    children: PropTypes.node,
    type: PropTypes.oneOf(['success', 'warning', 'danger', 'info']),
    title: PropTypes.node,
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
    showIcon: PropTypes.bool,
    closable: PropTypes.bool,
    onClose: PropTypes.func,
    size: PropTypes.oneOf(['large', 'default', 'small', 'tiny']),
    defaultActiveIndex: PropTypes.number,
    autoPlay: PropTypes.bool,
    delay: PropTypes.number,
  }

  static defaultProps = {
    type: 'info',
    showIcon: true,
    size: 'default',
    closable: false,
    autoPlay: false,
    delay: 1000,
    onClose: () => {},
  }

  constructor(props) {
    super(props)

    this.alertRef = React.createRef()
    this.contentRef = React.createRef()

    this.iconTypes = {
      success: 'check-circle-o',
      danger: 'exclamation-circle-o',
      warning: 'question-circle-o',
      info: 'info-circle-o',
    }

    this.currentIndex = this.props.defaultActiveIndex || 0
  }

  componentDidMount() {
    const { autoPlay } = this.props
    if (autoPlay && this.isScroll) {
      this.setTransform()
      this.handleContentScroll()
    }
  }

  getContentItemHeight = () => {
    const { current } = this.alertRef
    if (current) {
      const items = current.querySelectorAll('.alert-content-item')
      this.contentInfo = Array.from(items).map(
        item => item.getBoundingClientRect().height
      )
    }
  }

  handleClose = event => {
    const { current } = this.alertRef
    if (current && current.parentNode) {
      current.parentNode.removeChild(current)
    }
    const { onClose } = this.props
    onClose(event)
  }

  computeTransform = (contentInfo = this.contentInfo || []) => {
    const length = contentInfo.length - 1 < 0 ? 0 : contentInfo.length - 1
    let transformX = 0
    for (let i = 0; i < this.currentIndex; i += 1) {
      transformX += contentInfo[i]
    }
    if (this.currentIndex < length) {
      this.currentIndex += 1
    } else {
      this.currentIndex = 0
    }
    return transformX
  }

  setTransform = () => {
    this.getContentItemHeight()
    const { current } = this.alertRef
    if (current) {
      current.style.overflow = 'hidden'
      current.style.height = `${this.contentInfo[this.currentIndex]}px`
    }
    const { current: contentDoms } = this.contentRef
    if (contentDoms) {
      const transformX = this.computeTransform()
      contentDoms.style.transform = `translateY(-${transformX}px)`
    }
  }

  handleContentScroll = () => {
    const { autoPlay, delay } = this.props
    if (autoPlay && this.isScroll) {
      setInterval(() => {
        this.setTransform()
      }, delay)
    }
  }

  renderContent = () => {
    const { content } = this.props
    this.isScroll = false
    if (Array.isArray(content)) {
      this.isScroll = true
      const contentDoms = content.map((item, index) => (
        <div className="alert-content-item" key={index}>
          {item}
        </div>
      ))
      return contentDoms
    }
    return content
  }

  render() {
    const { title, type, showIcon, size, closable, autoPlay } = this.props
    const cls = classNames('alert', {
      [`alert-type-${type}`]: type,
      'alert-with-icon': showIcon,
      'alert-closable': closable,
      [`alert-size-${size}`]: size,
      'alert-play': autoPlay,
    })

    const content = this.renderContent()

    return (
      <div ref={this.alertRef} className={cls}>
        {showIcon && (
          <Icon className="alert-icon" type={this.iconTypes[type]} />
        )}
        {title && <span className="alert-title">{title}</span>}
        {content && (
          <div ref={this.contentRef} className="alert-content">
            {content}
          </div>
        )}
        {closable && (
          <Icon
            onClick={this.handleClose}
            className="alert-close"
            type="close"
          />
        )}
      </div>
    )
  }
}
