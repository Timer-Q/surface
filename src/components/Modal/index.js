import Modal from './Modal'
import confirm from './confirm'

Modal.confirm = props => {
  const config = {
    type: 'confirm',
    showCancel: true,
    ...props,
  }
  return confirm(config)
}

Modal.info = props => {
  const config = {
    type: 'info',
    iconType: 'info-circle',
    showCancel: false,
    ...props,
  }
  return confirm(config)
}

Modal.success = props => {
  const config = {
    type: 'success',
    iconType: 'check-circle',
    showCancel: false,
    ...props,
  }
  return confirm(config)
}

Modal.error = props => {
  const config = {
    type: 'error',
    iconType: 'close-circle',
    showCancel: true,
    ...props,
  }
  return confirm(config)
}

Modal.warn = Modal.warning = props => {
  const config = {
    type: 'warning',
    iconType: 'exclamation-circle',
    showCancel: true,
    ...props,
  }
  return confirm(config)
}

export default Modal
