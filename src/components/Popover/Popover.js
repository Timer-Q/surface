import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Transition from '../Transition'
import Portal from '../utils/Portal'
import './style/popover.scss'

export default class Popover extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.node,
    placement: PropTypes.oneOf([
      'top',
      'top-start',
      'top-end',
      'right',
      'right-start',
      'right-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
    ]),
    trigger: PropTypes.oneOf(['click', 'hover', 'focus']),
    transitionName: PropTypes.string,
    visible: PropTypes.bool,
    disabled: PropTypes.bool,
    isCache: PropTypes.bool,
    bound: PropTypes.object,
    onVisibleChange: PropTypes.func,
    getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    style: PropTypes.object,
    className: PropTypes.string,
    popupClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    popupStyle: PropTypes.object,
    stretchWidth: PropTypes.bool,
    unmountOnExit: PropTypes.bool,
    zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClickOutSide: PropTypes.func,
    destroyOnHide: PropTypes.bool,
  }

  static defaultProps = {
    transitionName: 'dropdown',
    trigger: 'click',
    isCache: true,
    bound: {
      top: 4,
      left: 0,
      width: 0,
    },
    popupClassName: false,
    stretchWidth: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible || false,
      isFirstRender: true,
    }
    this.contentRef = React.createRef()
    this.popoverRef = React.createRef()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {}
    if (!('visible' in nextProps)) {
      newState.visible = prevState.visible
    } else if (nextProps.visible !== prevState.visible) {
      newState.visible = nextProps.visible
    } else {
      return null
    }
    if (newState.visible && prevState.isFirstRender) {
      newState.isFirstRender = false
    }
    return newState
  }

  componentDidMount() {
    // eslint-disable-next-line
    this.childrenDom = ReactDOM.findDOMNode(this.childrenRef)
  }

  componentDidUpdate() {
    const { current } = this.contentRef
    if (current) {
      this.childrenStyle = this.getComputedStyle(this.childrenDom)
      current.style.top = this.childrenStyle.top
      current.style.left = this.childrenStyle.left
      current.style.bottom = this.childrenStyle.bottom
      current.style.right = this.childrenStyle.right
      current.style.minWidth = this.childrenStyle.minWidth
    }
  }

  componentWillUnmount() {
    clearTimeout(this.leaveTimer)
  }

  handleMouseEnter = () => {
    clearTimeout(this.leaveTimer)
    if (!this.inContent) {
      clearTimeout(this.enterTimer)
      this.inContent = true
      if (this.props.trigger === 'hover') {
        this.enterTimer = setTimeout(() => {
          this.togglePopper(true)
        }, 200)
      }
    }
  }

  handleMouseLeave = () => {
    clearTimeout(this.leaveTimer)
    if (this.inContent) {
      this.inContent = false
      if (this.props.trigger === 'hover') {
        this.leaveTimer = setTimeout(() => {
          this.togglePopper(false)
        }, 200)
      }
    }
  }

  getComputedStyle(childrenDom) {
    if (!childrenDom) return
    const { placement } = this.props
    const { top, left, height, width } = childrenDom.getBoundingClientRect() // 按钮

    let containerEl = this.getPopupMountContainer() // 获取容器 （body 或者 position 不为 static 的元素）

    if (containerEl === true) {
      containerEl = this.popoverRef.current
    }

    const containerRect = containerEl.getBoundingClientRect()

    const { bound, stretchWidth } = this.props

    const contentRect = this.contentRef.current // portal
    let contentWidth = 0
    let contentHeight = 0
    if (contentRect) {
      contentWidth = contentRect.offsetWidth
      contentHeight = contentRect.offsetHeight
    }
    const shadowWidth = 12
    const minWidth = {
      minWidth: stretchWidth ? `${width + (bound.width || 0)}px` : null,
    }

    const position = {
      top: top + height + (bound.top || 0),
      left: left + (bound.left || 0),
    }

    switch (placement) {
      case 'top-start':
        return {
          bottom: `-${position.top -
            containerRect.top -
            height -
            shadowWidth}px`,
          left: `${position.left - containerRect.left}px`,
          ...minWidth,
        }
      case 'top-end':
        return {
          bottom: `-${position.top -
            containerRect.top -
            height -
            shadowWidth}px`,
          right: `${containerRect.width -
            (position.left - containerRect.left + width)}px`,
          ...minWidth,
        }
      case 'top':
        return {
          bottom: `-${position.top -
            containerRect.top -
            height -
            shadowWidth}px`,
          left: `${position.left -
            containerRect.left +
            width / 2 -
            contentWidth / 2}px`,
          ...minWidth,
        }
      case 'left-start':
        return {
          top: `${position.top - containerRect.top - height}px`,
          right: `${containerRect.width -
            (position.left - containerRect.left - shadowWidth / 2)}px`,
          ...minWidth,
        }

      case 'right-start':
        return {
          top: `${position.top - containerRect.top - height}px`,
          left: `${position.left -
            containerRect.left +
            width +
            shadowWidth / 2}px`,
          ...minWidth,
        }
      case 'left':
        return {
          top: `${position.top -
            containerRect.top -
            height / 2 -
            contentHeight / 2 -
            shadowWidth / 2}px`,
          right: `${containerRect.width -
            (position.left - containerRect.left - shadowWidth / 2)}px`,
          ...minWidth,
        }

      case 'right':
        return {
          top: `${position.top -
            containerRect.top -
            height / 2 -
            contentHeight / 2 -
            shadowWidth / 2}px`,
          left: `${position.left -
            containerRect.left +
            width +
            shadowWidth / 2}px`,
          ...minWidth,
        }
      case 'left-end':
        return {
          bottom: `-${position.top - containerRect.top - shadowWidth}px`,
          right: `${containerRect.width -
            (position.left - containerRect.left - shadowWidth / 2)}px`,
          ...minWidth,
        }

      case 'right-end':
        return {
          bottom: `-${position.top - containerRect.top - shadowWidth}px`,
          left: `${position.left -
            containerRect.left +
            width +
            shadowWidth / 2}px`,
          ...minWidth,
        }
      case 'bottom-start':
        return {
          top: `${position.top - containerRect.top}px`,
          left: `${position.left - containerRect.left}px`,
          ...minWidth,
        }

      case 'bottom-end':
        return {
          top: `${position.top - containerRect.top}px`,
          right: `${containerRect.width -
            (position.left - containerRect.left + width)}px`,
          ...minWidth,
        }
      case 'bottom':
        return {
          top: `${position.top - containerRect.top}px`,
          left: `${position.left -
            containerRect.left +
            width / 2 -
            contentWidth / 2}px`,
          ...minWidth,
        }
      default:
        return {
          top: `${position.top - containerRect.top}px`,
          left: `${position.left - containerRect.left}px`,
          ...minWidth,
        }
    }
  }

  togglePopper = (visible = !this.state.visible) => {
    const { onVisibleChange } = this.props
    if (visible !== this.state.visible) {
      if (onVisibleChange) {
        onVisibleChange(visible)
      }
      if (!('visible' in this.props)) {
        this.setState({
          visible,
        })
      }
    }
  }

  /**
   * popover blur 事件
   */
  handleBlur = () => {
    clearTimeout(this.blurTimer)
    if (this.inContent) {
      return
    }
    // 此处防止 手动控制 children focus 的时候 频繁 blur -> focus
    this.blurTimer = setTimeout(() => {
      this.togglePopper(false)
      const { onClickOutSide } = this.props
      if (onClickOutSide) {
        onClickOutSide(false)
      }
      this.triggerFocus('blur')
    }, 160)
  }

  /**
   * popover focus 事件
   */
  handleFocus = () => {
    clearTimeout(this.blurTimer)
    const { visible } = this.state
    if (!visible) {
      this.inContent = false
    }
    this.triggerFocus('focus')
  }

  getChildrenRef = node => {
    this.childrenRef = node
  }

  getPopupMountContainer = () => {
    const { getPopupContainer } = this.props
    let container = getPopupContainer
    if (typeof getPopupContainer === 'function') {
      container = getPopupContainer(this.popoverRef.current)
    }
    if (!container) {
      container = document.body
    }
    return container
  }

  handleChildrenClick = event => {
    const { children } = this.props
    if (React.isValidElement(children) && React.Children.only(children)) {
      const { onClick } = children.props
      if (onClick) {
        onClick(event)
      }
    }
    this.togglePopper()
  }

  triggerFocus = type => {
    const { trigger } = this.props
    if (trigger === 'focus') {
      this.togglePopper(type === 'focus')
    }
  }

  getChildrenEventFromTrigger = () => {
    const { trigger } = this.props
    if (trigger === 'hover') {
      return {
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
      }
    } else if (trigger === 'click') {
      return {
        onClick: this.handleChildrenClick,
      }
    }
  }

  /**
   * 强制让 popover 获取焦点
   *
   * @memberof Popover
   */
  manualFocus = () => {
    const { current } = this.popoverRef
    if (current) {
      current.focus()
    }
  }

  render() {
    const {
      children,
      content,
      transitionName,
      style,
      className,
      popupClassName,
      popupStyle,
      zIndex,
      unmountOnExit,
    } = this.props

    const { visible, isFirstRender } = this.state

    const containerStyle = {
      zIndex,
      ...popupStyle,
    }

    let newChildren = (
      <span
        ref={this.getChildrenRef}
        key={children.key || 'popoverChildren'}
        {...this.getChildrenEventFromTrigger()}
        className="popover-children-container"
      >
        {children}
      </span>
    )

    let contentCls = popupClassName

    if (typeof popupClassName === 'boolean') {
      if (popupClassName) {
        contentCls = 'popover-content'
      } else {
        contentCls = ''
      }
    }

    const contentNode = <div className={contentCls}>{content}</div>

    const cls = classNames('popover', {
      [className]: !!className,
    })

    return (
      <div
        tabIndex="0"
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        ref={this.popoverRef}
        style={style}
        className={cls}
      >
        {newChildren}
        <Portal getContainer={this.getPopupMountContainer}>
          {!isFirstRender && (
            <div
              style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            >
              <div
                tabIndex="0"
                ref={this.contentRef}
                style={containerStyle}
                className="popover-container"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                key="popoverContent"
              >
                <Transition
                  unmountOnExit={unmountOnExit}
                  transitionName={transitionName}
                  in={visible}
                >
                  {contentNode}
                </Transition>
              </div>
            </div>
          )}
        </Portal>
      </div>
    )
  }
}
