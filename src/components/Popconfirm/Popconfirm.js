import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popover from '../Popover'
import Icon from '../Icon'
import Button from '../Button'
import './style/style.scss'

function noop() {}

const iconTypes = {
  info: 'info-circle',
  success: 'check-circle',
  error: 'exclamation-circle',
  warning: 'exclamation-circle',
  loading: 'loading',
}

export default class Popconfirm extends Component {
  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    type: PropTypes.oneOf(['info', 'warning', 'error', 'success']),
    style: PropTypes.object,
    className: PropTypes.string,
    placement: PropTypes.string,
    footer: PropTypes.node,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    onClickOutSide: PropTypes.func,
    okProps: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    cancelProps: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }

  static defaultProps = {
    type: 'warning',
    placement: 'top',
    onOk: noop,
    onCancel: noop,
    onVisibleChange: noop,
    onClickOutSide: noop,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  getVisible = () => {
    if (!('visible' in this.props)) {
      return this.state.visible
    }
    return this.props.visible
  }

  setVisible = visible => {
    if (!('visible' in this.props)) {
      this.setState({
        visible,
      })
    }
    const { onVisibleChange } = this.props
    onVisibleChange(visible)
  }

  handleCancleClick = () => {
    this.setVisible(false)
    const { onCancel } = this.props
    onCancel()
  }

  handleOkClick = () => {
    this.setVisible(false)
    const { onOk } = this.props
    onOk()
  }

  handleClickOutSide = () => {
    const { onClickOutSide } = this.props
    onClickOutSide(false)
    this.setVisible(false)
  }

  handleChildrenClick = () => {
    const { children } = this.props
    let clickListener = null
    if (React.isValidElement(children)) {
      clickListener = children.props.onClick
    }
    if (clickListener) {
      clickListener()
    }
    if (!('visible' in this.props)) {
      this.setState({
        visible: true,
      })
    }
  }

  renderFooter = () => {
    const { footer, okProps, cancelProps } = this.props
    let newOkProps = {}
    let newCancelProps = {}
    let okText = '确认'
    let cancelText = '取消'

    if (typeof okProps === 'string') {
      okText = okProps
    } else {
      newOkProps = { ...okProps }
      okText = newOkProps.text
      delete newOkProps.text
    }

    if (typeof cancelProps === 'string') {
      cancelText = cancelProps
    } else {
      newCancelProps = { ...cancelProps }
      cancelText = newCancelProps.text
      delete newCancelProps.text
    }

    if (!footer) {
      return (
        <div className="popconfirm-footer">
          <Button
            onClick={this.handleCancleClick}
            size="tiny"
            type="primary"
            ghost
            {...newCancelProps}
          >
            {cancelText || '取消'}
          </Button>
          <Button
            onClick={this.handleOkClick}
            size="tiny"
            type="primary"
            {...newOkProps}
          >
            {okText || '确认'}
          </Button>
        </div>
      )
    } else {
      return footer
    }
  }

  renderContent = () => {
    const { title, content, type, style, className } = this.props
    const cls = classNames('popconfirm', {
      [`popconfirm-${type}`]: !!type,
      [className]: !!className,
    })
    return (
      <div className={cls} style={style}>
        {title && (
          <div className="popconfirm-header">
            <Icon type={iconTypes[type]} />
            <span className="popconfirm-header-content">{title}</span>
          </div>
        )}
        {content && <div className="popconfirm-content">{content}</div>}
        {this.renderFooter()}
      </div>
    )
  }

  render() {
    const { children, placement, ...rest } = this.props
    const restProps = { ...rest }

    delete restProps.style
    delete restProps.className

    const content = this.renderContent()

    const visible = this.getVisible()

    let newChildren = children

    if (React.isValidElement(newChildren)) {
      newChildren = React.cloneElement(children, {
        onClick: this.handleChildrenClick,
      })
    }

    return (
      <Popover
        visible={visible}
        {...restProps}
        onClickOutSide={this.handleClickOutSide}
        placement={placement}
        content={content}
      >
        {newChildren}
      </Popover>
    )
  }
}
