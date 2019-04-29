import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index.scss'

function noop() {}

export default class Input extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['large', 'default', 'small', 'tiny']),
    autoComplete: PropTypes.string,
    type: PropTypes.string,
    prefixClass: PropTypes.string.isRequired,
    addonBefore: PropTypes.any,
    addonAfter: PropTypes.any,
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    onChange: PropTypes.func,
    affixType: PropTypes.oneOf(['text', 'button']),
    prefix: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    suffix: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    id: PropTypes.string,
    counter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    readonly: PropTypes.bool,
    bordered: PropTypes.bool,
    className: PropTypes.any,
    title: PropTypes.any,
    children: PropTypes.any,
    style: PropTypes.object,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onPressEnter: PropTypes.func,
    onClear: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    isListenComposition: PropTypes.bool,
    onCompositionStart: PropTypes.func,
    onCompositionUpdate: PropTypes.func,
    onCompositionEnd: PropTypes.func,
  }

  static defaultProps = {
    prefixClass: 'input',
    size: 'default',
    type: 'text',
    affixType: 'text',
    bordered: true,
    isListenComposition: false,
    onCompositionStart: noop,
    onCompositionUpdate: noop,
    onCompositionEnd: noop,
  }

  constructor(props) {
    super(props)
    this.state = {
      valueLength: props.value ? props.value.length : 0,
    }
    this.beyondCounter = false
    this.inputRef = React.createRef()
    this.isCompositionEnd = false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value } = nextProps
    if (!value) return { valueLength: 0 }
    if (prevState.valueLength === nextProps.value.length) return null
    return {
      valueLength: nextProps.value.length,
    }
  }

  fixControlledValue(value) {
    if (typeof value === 'undefined' || value === null) {
      return ''
    }
    return value
  }

  /**
   * input 有三种形态：
   * 1. 普通input        -> renderInput
   * 2. 带 icon (affix)   -> renderInputWithIcon
   * 3. 带 addon         -> renderInputWithAddon
   */

  getInputClassName() {
    const { prefixClass, size, disabled, bordered } = this.props
    return classNames(prefixClass, {
      [`input-${size}`]: size,
      'input-disabled': disabled,
      'without-border': !bordered,
    })
  }

  checkBoundary = value => {
    const { onChange, type } = this.props
    if (onChange && type === 'number') {
      // eslint-disable-next-line
      const reg = /^(\-|\+)?\d+(\.\d+)?$/
      if (reg.test(value)) {
        if ('min' in this.props && value <= this.props.min) {
          onChange(this.props.min)
        }
        if ('max' in this.props && value >= this.props.max) {
          onChange(this.props.max)
        }
      } else {
        onChange('')
      }
    }
  }

  focus = () => {
    setTimeout(() => {
      const { current } = this.inputRef
      if (current) {
        current.focus()
      }
    })
  }

  blur = () => {
    setTimeout(() => {
      const { current } = this.inputRef
      if (current) {
        current.blur()
      }
    })
  }

  handleChange = event => {
    const { onChange, isListenComposition } = this.props
    if (isListenComposition) {
      if (!this.isComposition && onChange) {
        onChange(event.target.value, this.props, event)
      }
    } else if (onChange) {
      onChange(event.target.value, this.props, event)
    }
  }

  handleBlur = e => {
    const { onBlur } = this.props
    this.checkBoundary(e.target.value)
    onBlur && onBlur(e)
  }

  handleFocus = e => {
    const { onFocus } = this.props
    onFocus && onFocus(e)
  }

  handleKeyDown = e => {
    const { onPressEnter, onKeyDown } = this.props
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e)
    }
    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  handleKeyUp = () => {
    if ('onKeyUp' in this.props) {
      const { onKeyUp } = this.props
      onKeyUp && onKeyUp()
    }
  }

  handleClear = () => {
    if (!('value' in this.props)) {
      this.inputRef.current.value = ''
    }
    const { onClear } = this.props
    onClear && onClear()
  }

  // 监听拼音输入
  handleComposition = event => {
    if (event.type === 'compositionstart') {
      const { onCompositionStart } = this.props
      onCompositionStart(event)
      this.isComposition = true
    }
    if (event.type === 'compositionupdate') {
      const { onCompositionUpdate } = this.props
      onCompositionUpdate(event)
      this.isComposition = true
    }
    if (event.type === 'compositionend') {
      const { onCompositionEnd } = this.props
      onCompositionEnd(event)
      this.isComposition = false
      this.handleChange(event)
    }
  }

  getHandleComposition = () => {
    const { isListenComposition } = this.props
    if (isListenComposition) {
      return this.handleComposition
    }
    return null
  }

  renderInupt() {
    /* eslint-disable */
    const {
      type,
      addonBefore,
      onPressEnter,
      addonAfter,
      prefixClass,
      suffixClass,
      bordered,
      style,
      children,
      counter,
      suffix,
      prefix,
      autoComplete,
      readonly,
      affixType,
      isListenComposition,
      ...otherProps
    } = this.props
    /* eslint-enable */
    if ('value' in this.props) {
      otherProps.value = this.fixControlledValue(otherProps.value)
      delete otherProps.defaultValue
    }
    return this.renderInputWithIcon(
      <input
        {...otherProps}
        ref={this.inputRef}
        readOnly={readonly}
        type={type}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        onChange={this.handleChange}
        onCompositionStart={this.getHandleComposition()}
        onCompositionUpdate={this.getHandleComposition()}
        onCompositionEnd={this.getHandleComposition()}
        className={this.getInputClassName()}
        autoComplete={autoComplete}
      />
    )
  }

  renderAffixType = affix => {
    if (React.isValidElement(affix)) {
      let newCls = affix.props.className
      newCls = newCls ? `${newCls} input-affix-button` : 'input-affix-button'
      return React.cloneElement(affix, { className: newCls })
    }
    return affix
  }

  renderInputWithIcon(child) {
    const { props } = this
    if (!('prefix' in props || 'suffix' in props || 'counter' in props)) {
      return child
    }
    if (
      process.env.NODE_ENV !== 'production' &&
      'suffix' in props &&
      'counter' in props
    ) {
      console.warn(
        'suffix 和 counter 不能同时存在，如果同时存在，优先选用 counter'
      )
    }
    // 加工 prefix
    const prefix = props.prefix ? (
      <span className="input-prefix">{this.renderAffixType(props.prefix)}</span>
    ) : null

    // 加工 suffix + counter
    let beyondCounter
    if (props.counter && this.state.valueLength > props.counter) {
      beyondCounter = true
    } else {
      beyondCounter = false
    }

    const cls = beyondCounter ? 'input-suffix-error' : null
    const suffix = (
      <span className="input-suffix">
        {props.counter ? (
          <span className={cls}>
            {this.state.valueLength}/{props.counter}
          </span>
        ) : (
          this.renderAffixType(props.suffix) || null
        )}
      </span>
    )

    const classes = classNames('input-affix-wrapper', {
      'input-counter': !!props.counter,
      [`input-affix-${props.affixType}`]: !!props.affixType,
    })

    return (
      <span className={classes}>
        {prefix}
        {React.cloneElement(child, {
          style: child.props.style,
          className: this.getInputClassName(),
        })}
        {suffix}
      </span>
    )
  }

  renderInputWithAddon(child) {
    const { props } = this
    if (!props.addonBefore && !props.addonAfter) {
      return child
    }
    const addonBefore = props.addonBefore ? (
      <span className="input-addon">{props.addonBefore}</span>
    ) : null
    const addonAfter = props.addonAfter ? (
      <span className="input-addon">{props.addonAfter}</span>
    ) : null

    const classes = classNames(
      'input-addon-wrapper',
      `input-addon-${props.size}`
    )

    return (
      <span className={classes}>
        {addonBefore}
        {child}
        {addonAfter}
      </span>
    )
  }

  render() {
    /* eslint-disable */
    const {
      disabled,
      className,
      placeholder,
      title,
      prefixClass,
      onBlur,
      onFocus,
      onPressEnter,
      onChange,
      onClick,
      bordered,
      addonBefore,
      addonAfter,
      readonly,
      value,
      suffix,
      prefix,
      affixType,
      isListenComposition,
      ...rest
    } = this.props
    /* eslint-enable */
    const classes = classNames('input-wrapper', {
      'is-disabled': !!disabled,
      [className]: className,
    })
    return (
      <div {...rest} className={classes}>
        {title && <div className="input-title">{title}</div>}
        {this.renderInputWithAddon(this.renderInupt())}
      </div>
    )
  }
}
