import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index.scss'

function noop() {}

export default class Switch extends Component {
  static propTypes = {
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    disabled: PropTypes.bool,
    checkedChildren: PropTypes.any,
    unCheckedChildren: PropTypes.any,
    onChange: PropTypes.func,
    onMouseUp: PropTypes.func,
    onClick: PropTypes.func,
    tabIndex: PropTypes.number,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    autoFocus: PropTypes.bool,
    loadingIcon: PropTypes.node,
    size: PropTypes.oneOf(['small', 'default', 'large']),
  }

  static defaultProps = {
    prefixCls: 'switch',
    checkedChildren: null,
    unCheckedChildren: null,
    className: '',
    defaultChecked: false,
    onChange: noop,
    onClick: noop,
    size: 'default',
  }

  constructor(props) {
    super(props)

    let checked = false
    if ('checked' in props) {
      checked = !!props.checked
    } else {
      checked = !!props.defaultChecked
    }
    this.state = { checked }
  }

  componentDidMount() {
    const { autoFocus, disabled } = this.props
    if (autoFocus && !disabled) {
      this.focus()
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if ('checked' in nextProps) {
      return {
        checked: !!nextProps.checked,
      }
    }
    return null
  }

  setChecked(checked) {
    if (this.props.disabled) {
      return
    }
    this.setState({
      checked,
    })
    this.props.onChange(checked)
  }

  toggle = () => {
    const { onClick } = this.props
    const checked = !this.state.checked
    this.setChecked(checked)
    onClick(checked)
  }

  handleKeyDown = e => {
    if (e.keyCode === 37) {
      // Left
      this.setChecked(false)
    } else if (e.keyCode === 39) {
      // Right
      this.setChecked(true)
    }
  }

  // Handle auto focus when click switch in Chrome
  handleMouseUp = e => {
    if (this.node) {
      this.node.blur()
    }
    if (this.props.onMouseUp) {
      this.props.onMouseUp(e)
    }
  }

  focus() {
    this.node.focus()
  }

  blur() {
    this.node.blur()
  }

  saveNode = node => {
    this.node = node
  }

  render() {
    const {
      className,
      prefixCls,
      disabled,
      loadingIcon,
      checkedChildren,
      unCheckedChildren,
      size,
      ...restProps
    } = this.props
    const checked = this.state.checked
    const switchClassName = classNames({
      [className]: !!className,
      [prefixCls]: true,
      [`${prefixCls}-${size}`]: true,
      [`${prefixCls}-checked`]: checked,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enable`]: !disabled,
    })
    return (
      <button
        {...restProps}
        type="button"
        disabled={disabled}
        className={switchClassName}
        ref={this.saveNode}
        onKeyDown={this.handleKeyDown}
        onClick={this.toggle}
        onMouseUp={this.handleMouseUp}>
        {loadingIcon}
        <span className={`${prefixCls}-inner`}>
          {checked ? checkedChildren : unCheckedChildren}
        </span>
      </button>
    )
  }
}
