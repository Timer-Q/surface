import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Portal from '../utils/Portal'
import Transition from '../Transition'
import Button from '../Button'
import Icon from '../Icon'
import './style/modal.scss'

let defaultZIndex = 3000
function calculateZIndex() {
  return (defaultZIndex += 1)
}

export default class ModalBase extends Component {
  static propTypes = {
    title: PropTypes.any,
    footer: PropTypes.any,
    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    closable: PropTypes.bool,
    children: PropTypes.any,
    confirmLoading: PropTypes.bool,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    afterClose: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    getPopupContainer: PropTypes.func,
    cancelText: PropTypes.string,
    okText: PropTypes.string,
    okType: PropTypes.string,
    showCancel: PropTypes.bool,
    confirm: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    size: PropTypes.oneOf(['large', 'default', 'small']),
  }

  static defaultProps = {
    mask: true,
    visible: false,
    closable: true,
    showCancel: true,
    maskClosable: true,
    size: 'default',
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
    }
    this.zIndex = calculateZIndex()
    this.modalRef = React.createRef()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible === prevState.visible) {
      return null
    }
    return { visible: nextProps.visible }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const result = nextState.visible !== this.state.visible
    if (result && nextState.visible) {
      this.zIndex = calculateZIndex()
    }
    return true
  }

  closeModal = event => {
    if (!('visible' in this.props)) {
      this.setState({
        visible: false,
      })
    }
    const { onClose, onCancel } = this.props

    if (onClose) {
      onClose(event)
    } else if (onCancel) {
      onCancel(event)
    }
  }

  renderMask() {
    const { maskClosable } = this.props

    return (
      <div
        className="modal-mask"
        onClick={maskClosable ? this.closeModal : undefined}
      />
    )
  }

  renderContentChildren = children => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child) && 'zIndex' in child.props) {
        return React.cloneElement(child, { zIndex: this.zIndex + 1 })
      }
      return child
    })
  }

  handleOk = event => {
    event.stopPropagation()
    const { onOk } = this.props
    onOk && onOk(event)
  }

  handleCancel = () => {
    if (!('visible' in this.props)) {
      this.setState({
        visible: false,
      })
    }
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  renderFooter() {
    const {
      cancelText,
      okText,
      confirmLoading,
      okType,
      showCancel,
      footer,
    } = this.props
    let footerNode = (
      <div className="modal-content-footer">
        {showCancel && (
          <Button
            size="small"
            type="default"
            key="model-footer-cancel"
            onClick={this.handleCancel}
          >
            {cancelText || '取 消'}
          </Button>
        )}
        <Button
          size="small"
          key="modal-footer-ok"
          type={okType}
          loading={confirmLoading}
          onClick={this.handleOk}
        >
          {okText || '确 定'}
        </Button>
      </div>
    )
    if ('footer' in this.props) {
      if (typeof footer === 'boolean') {
        if (footer === false) {
          footerNode = null
        }
      } else {
        footerNode = footer
      }
    }

    return <div key="modal-footer">{footerNode}</div>
  }

  renderDialog() {
    const { title, closable, children, confirm } = this.props

    const closer = closable && (
      <button
        key="modal-close"
        className="modal-close"
        onClick={this.closeModal}
      >
        <Icon type="close" />
      </button>
    )

    let headerNode = ''
    if ('title' in this.props) {
      headerNode = (
        <div key="modal-content-header" className="modal-content-header">
          <div
            key="modal-content-header-title"
            className="modal-content-header-title"
          >
            {title}
          </div>
          {closer}
        </div>
      )
    }

    const body = children && (
      <div key="modal-content-body" className="modal-content-body">
        {this.renderContentChildren(children)}
      </div>
    )

    const contentCls = classNames('modal-content', {
      'modal-confirm': confirm,
    })

    return (
      <div className={contentCls}>
        {headerNode}
        {body}
        {this.renderFooter()}
      </div>
    )
  }

  getPopupMountContainer = () => {
    const { getPopupContainer } = this.props
    let container = getPopupContainer && getPopupContainer()
    if (!container) {
      container = document.body
    }
    return container
  }

  handleEnter = node => {
    const el = this.modalRef.current || node.parentNode

    if (el) {
      el.classList.add('is-show')
    }
  }

  handleExited = node => {
    const el = this.modalRef.current || node.parentNode
    if (el) {
      el.classList.remove('is-show')
    }
    const { afterClose } = this.props
    if (afterClose) {
      afterClose()
    }
  }

  render() {
    const { visible } = this.state
    const { style, className, size, mask, ...rest } = this.props

    const wrapperCls = classNames('modal-wrapper', {
      [className]: className,
      [`modal-size-${size}`]: size,
    })

    const maskNode = mask ? (
      <Transition in={visible} transitionName="mode-fade">
        {this.renderMask()}
      </Transition>
    ) : null

    return (
      <Portal getContainer={this.getPopupMountContainer}>
        <div
          ref={this.modalRef}
          id={rest.id}
          className="modal"
          style={{ zIndex: this.zIndex }}
        >
          {maskNode}
          <Transition
            in={visible}
            onEnter={this.handleEnter}
            onExited={this.handleExited}
            transitionName="mode-scale"
          >
            <div style={style} className={wrapperCls}>
              {this.renderDialog()}
            </div>
          </Transition>
        </div>
      </Portal>
    )
  }
}
