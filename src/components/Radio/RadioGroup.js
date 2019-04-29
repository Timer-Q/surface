import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Radio from './Radio'

export default class RadioGroup extends Component {
  static propTypes = {
    value: PropTypes.any,
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    children: PropTypes.any,
    onChange: PropTypes.func,
    mode: PropTypes.oneOf(['horizontal', 'vertical']),
    disabled: PropTypes.bool,
    options: PropTypes.array,
    name: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    mode: 'horizontal',
  }

  constructor(props) {
    super(props)
    this.state = {
      value:
        props.value ||
        props.defaultValue ||
        this.getCheckedValue(props.children),
    }
  }

  getCheckedValue(children) {
    let value = null
    React.Children.forEach(children, child => {
      if (child && child.props && child.props.checked) {
        value = child.props.value
      }
    })
    return value
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ('value' in nextProps) {
      if (prevState.value === nextProps.value) return null
      return {
        value: nextProps.value,
      }
    }
    return null
  }

  handleChange = (value, props, event) => {
    const preValue = this.state.value
    const curValue = value
    if (!('value' in this.props)) {
      this.setState({
        value,
      })
    }
    const { onChange } = this.props
    if (onChange && preValue !== curValue) {
      // NOTE: 这里传入 curValue 还是 e 需再商定
      onChange(value, props, event)
    }
  }

  renderRadios() {
    const { disabled, options, name, children, size } = this.props
    const { value } = this.state
    if (options && options.length > 0) {
      return options.map((option, index) => {
        if (typeof option === 'string') {
          return (
            <Radio
              key={index}
              disabled={disabled}
              value={option}
              onChange={this.handleChange}
              checked={value === option}
              name={name}>
              {option}
            </Radio>
          )
        } else {
          return (
            <Radio
              size={option.size}
              key={index}
              disabled={option.disabled || disabled}
              value={option.value}
              onChange={this.handleChange}
              checked={value === option.value}
              name={name}>
              {option.label}
            </Radio>
          )
        }
      })
    } else {
      return React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          const checked = value === child.props.value
          const childDisabled = child.props.disabled
          return React.cloneElement(child, {
            onChange: this.handleChange,
            checked,
            disabled: childDisabled || disabled,
            size,
          })
        }
        return child
      })
    }
  }

  render() {
    const { mode, style, className } = this.props // eslint-disable-line
    const cls = classNames('radio-group', {
      [`radio-group-${mode}`]: mode,
      [className]: className,
    })
    return (
      <div style={style} className={cls}>
        {this.renderRadios()}
      </div>
    )
  }
}
