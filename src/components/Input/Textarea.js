import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class Textarea extends Component {
  static propTypes = {
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    title: PropTypes.any,
    counter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  static defaultProps = {
    prefixCls: 'input',
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue || '',
    }
  }

  getValue() {
    if ('value' in this.props) {
      return this.props.value
    }
    return this.state.value || this.props.defaultValue || ''
  }

  getBeyondCounter = value => {
    clearTimeout(this.timer)
    this.isBeyondCounter
    this.isBeyondCounter = value.length > this.props.counter
  }

  handleChange = event => {
    const value = event.target.value
    this.getBeyondCounter(value)
    if (!('value' in this.props)) {
      this.setState({
        value,
      })
    }
    const { onChange } = this.props
    if (onChange) {
      onChange(value)
    }
  }

  render() {
    /* eslint-disable */
    const {
      prefixCls,
      title,
      autosize,
      counter,
      className,
      disabled,
      ...rest
    } = this.props
    /* eslint-enable */

    if (counter > 0) {
      this.hasCounter = true
    }
    let counterCls = 'textarea-suffix'
    if (this.isBeyondCounter) {
      counterCls = `${counterCls} textarea-suffix-error`
    }
    const value = this.getValue()

    const wrapperCls = classNames('input-wrapper', {
      [className]: className,
      'is-disabled': disabled,
    })

    return (
      <div className={wrapperCls}>
        {title && <div className="input-title">{title}</div>}
        <textarea
          {...rest}
          value={value}
          onChange={e => this.handleChange(e)}
          className={prefixCls}
        />
        {this.hasCounter && (
          <span className={counterCls}>
            {value.length}/{counter}
          </span>
        )}
      </div>
    )
  }
}
