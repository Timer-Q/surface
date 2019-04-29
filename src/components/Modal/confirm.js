import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ModalBase from './ModalBase'
import Button from '../Button'
import Icon from '../Icon'

// FIXME: ActionButton 需要写成 class 的方式 因为有 loading 的 state
const ActionButton = props => {
  const onClick = () => {
    const { closeModal, actionFn } = props
    // 处理 promise
    if (actionFn) {
      let result
      if (actionFn.length) {
        result = actionFn(closeModal)
      } else {
        result = actionFn()
        if (!result) {
          closeModal()
        }
      }

      if (result && result.then) {
        result.then(
          args => {
            closeModal(args)
          },
          () => {
            console.error('sth error')
          }
        )
      }
    } else {
      closeModal()
    }
  }

  //eslint-disable-next-line
  const { children, closeModal, actionFn, ...rest } = props
  return (
    <Button {...rest} onClick={onClick}>
      {children}
    </Button>
  )
}

const ComfirmModal = props => {
  const {
    okType,
    onOk,
    okText,
    close,
    maskClosable,
    title,
    iconType,
    content,
    innderHtml,
    onCancel,
    onClose,
    showCancel,
    cancelText,
    type,
    footer,
    ...rest
  } = props

  const cancelBtn = showCancel && (
    <ActionButton
      size="small"
      closeModal={close}
      type="default"
      actionFn={onCancel}
    >
      {cancelText || '取 消'}
    </ActionButton>
  )

  const okBtn = (
    <ActionButton size="small" closeModal={close} type={okType} actionFn={onOk}>
      {okText || '确 定'}
    </ActionButton>
  )

  const newFooter = React.isValidElement(footer) ? (
    footer
  ) : (
    <span className="modal-content-footer">
      {cancelBtn}
      {okBtn}
    </span>
  )

  const icon = iconType || 'confirm-icon'
  const iconClass = `modal-icon-${type}`

  const titleNode = (
    <div className="modal-title">
      {<Icon className={iconClass} size="large" type={icon} />} {title}
    </div>
  )

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else if (onCancel) {
      onCancel()
    }
    close()
  }

  return (
    <ModalBase
      size="small"
      {...rest}
      title={titleNode}
      onClose={handleClose}
      maskClosable={!!maskClosable}
      confirm
      footer={newFooter}
    >
      {innderHtml ? (
        <span dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        content
      )}
    </ModalBase>
  )
}

export default function confirm(config) {
  let div = document.createElement('div')
  document.body.appendChild(div)

  function close(...args) {
    render({
      ...config,
      visible: false,
      close,
      afterClose: destroy.bind(this, ...args),
    })
  }

  function destroy(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }

    const triggerCancel =
      args && args.length && args.some(arg => arg && arg.triggerCancel)

    if (config.onCancel && triggerCancel) {
      config.onCancel(...args)
    }
  }

  function render(props) {
    ReactDOM.render(<ComfirmModal {...props} />, div)
  }

  render({ ...config, visible: true, close })

  return {
    destroy: close,
  }
}

ComfirmModal.propTypes = {
  okType: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  close: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  maskClosable: PropTypes.bool,
  showCancel: PropTypes.bool,
  title: PropTypes.string,
  iconType: PropTypes.string,
  content: PropTypes.any,
  innderHtml: PropTypes.bool,
  type: PropTypes.string,
  footer: PropTypes.node,
}

ActionButton.propTypes = {
  children: PropTypes.any,
  closeModal: PropTypes.func,
  actionFn: PropTypes.func,
}
