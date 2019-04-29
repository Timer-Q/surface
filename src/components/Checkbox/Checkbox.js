import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index.scss'

export default class Checkbox extends Component {
  static propTypes = {
    type: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.any,
    checked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    defaultChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    children: PropTypes.any,
    style: PropTypes.object,
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    size: PropTypes.oneOf(['large', 'default', 'small', 'tiny']),
    labelClassName: PropTypes.string,
    extra: PropTypes.any,
    indeterminate: PropTypes.bool, // 半选状态
  }

  static defaultProps = {
    prefixCls: 'checkbox',
    type: 'checkbox',
    size: 'default',
    disabled: false,
  }

  constructor(props) {
    super(props)

    const checked = 'checked' in props ? props.checked : props.defaultChecked

    this.state = {
      checked,
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if ('checked' in nextProps) {
      return {
        checked: nextProps.checked,
      }
    }
    return null
  }

  handleChange = event => {
    const { onChange, disabled, children, value } = this.props

    if (disabled) return

    // 如果 props 中没有传入 checked
    if (!('checked' in this.props)) {
      this.setState({
        checked: event.target.checked,
      })
    }

    if (onChange) {
      onChange(value || children || event.target.checked, this.props, event)
    }
  }

  render() {
    const {
      disabled,
      readOnly,
      type,
      onClick,
      onFocus,
      onBlur,
      value,
      children,
      prefixCls,
      defaultChecked, // eslint-disable-line
      labelClassName,
      extra,
      style,
      className,
      indeterminate,
      size,
      ...otherProps
    } = this.props

    const { checked } = this.state
    const checkboxWrapperClasses = classNames(`${prefixCls}-wrapper`, {
      [className]: !!className,
      [`${prefixCls}-${size}`]: size,
      'is-disabled': disabled,
      'is-enable': !disabled,
      'is-checked': checked,
      'is-indeterminate': indeterminate,
    })

    const checkboxClasses = classNames(`${prefixCls}-input`)

    const labelCls = classNames(`${prefixCls}-label`, {
      [labelClassName]: labelClassName,
    })

    return (
      <div style={style} className={checkboxWrapperClasses}>
        <label className={labelCls}>
          <input
            {...otherProps}
            className={checkboxClasses}
            type={type}
            disabled={disabled}
            readOnly={readOnly}
            onClick={onClick}
            onChange={this.handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            value={value}
            checked={!!checked}
          />
          <span className={`${prefixCls}-inner`} />
          {children && (
            <span className={`${prefixCls}-label-content`}>{children}</span>
          )}
        </label>
        {extra && <span className={`${prefixCls}-extra`}>{extra}</span>}
      </div>
    )
  }
}
