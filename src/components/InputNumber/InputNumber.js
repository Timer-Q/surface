import React , { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import KeyCode from './KeyCode'
import './style/index.scss'

function isNegativeZero(number) {
  return number === 0 && (1 / number) === -Infinity
}
function noop() {
}

function preventDefault(e) {
  e.preventDefault()
}

function defaultParser(input) {
  /* eslint-disable no-useless-escape */
  return input.replace(/[^\w\.-]+/g, '')
}

function getValidValue(value, min , max ) {
  let val = parseFloat(value, 10)
  if (isNaN(val)) {
    return value
  }
  if (min != undefined && val < min) {
    val = min
  }
  if (max != undefined && val > max) {
    val = max
  }
  return val
}
/**
 * When click and hold on a button - the speed of auto changin the value.
 */
const SPEED = 200

/**
 * When click and hold on a button - the delay before auto changin the value.
 */
const DELAY = 600

/**
 * Max Safe Integer -- on IE this is not available, so manually set the number in that case.
 * The reason this is used, instead of Infinity is because numbers above the MSI are unstable
 */
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1

export default class InputNumber extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['large', 'default', 'small']),
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    focusOnUpDown: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    prefixCls: PropTypes.string,
    disabled: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    upHandler: PropTypes.node,
    downHandler: PropTypes.node,
    formatter: PropTypes.func,
    parser: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseUp: PropTypes.func,
    precision: PropTypes.number,
    required: PropTypes.bool,
    pattern: PropTypes.string,
    decimalSeparator: PropTypes.string,
  }

  static defaultProps = {
    size: 'default',
    focusOnUpDown: true,
    prefixCls: 'input',
    min: -MAX_SAFE_INTEGER,
    step: 1,
    style: {},
    onChange: noop,
    onKeyDown: noop,
    onFocus: noop,
    onBlur: noop,
    parser: defaultParser,
    required: false,
  }

  constructor(props) {
    super(props)

    let value
    if ('value' in props) {
      value = props.value
    } else {
      value = props.defaultValue
    }
    value = this.toNumber(value)

    this.state = {
      inputValue: this.toPrecisionAsStep(value),
      value,
      focused: props.autoFocus,
    }
  }

  componentDidMount() {
    this.componentDidUpdate()
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      const value =  getValidValue(nextProps.value, nextProps.min, nextProps.max)
      return {
        value ,
        inputValue:  value,
      }
    }
    return null
  }

  componentDidUpdate() {
    // Restore cursor
    try {
      // Firefox set the input cursor after it get focused.
      // This caused that if an input didn't init with the selection,
      // set will cause cursor not correct when first focus.
      // Safari will focus input if set selection. We need skip this.
      if (this.cursorStart !== undefined && this.state.focused) {
        // In most cases, the string after cursor is stable.
        // We can move the cursor before it

        if (
          // If not match full str, try to match part of str
          !this.partRestoreByAfter(this.cursorAfter)
        ) {
          // If not match any of then, let's just keep the position
          // TODO: Logic should not reach here, need check if happens
          let pos = this.cursorStart + 1

          // If not have last string, just position to the end
          if (!this.cursorAfter) {
            pos = this.input.value.length
          } else if (this.lastKeyCode === KeyCode.BACKSPACE) {
            pos = this.cursorStart - 1
          } else if (this.lastKeyCode === KeyCode.DELETE) {
            pos = this.cursorStart
          }
          this.fixCaret(pos, pos)
        } else if (this.currentValue === this.input.value) {
          // Handle some special key code
          switch (this.lastKeyCode) {
            case KeyCode.BACKSPACE:
              this.fixCaret(this.cursorStart - 1, this.cursorStart - 1)
              break
            case KeyCode.DELETE:
              this.fixCaret(this.cursorStart + 1, this.cursorStart + 1)
              break
            default:
            // Do nothing
          }
        }
      }
    } catch (e) {
      // Do nothing
    }

    // Reset last key
    this.lastKeyCode = null

    // pressingUpOrDown is true means that someone just click up or down button
    if (!this.pressingUpOrDown) {
      return
    }
    if (this.props.focusOnUpDown && this.state.focused) {
      if (document.activeElement !== this.input) {
        this.input.focus()
      }
    }

    this.pressingUpOrDown = false
  }

  componentWillUnmount() {
    this.stop()
  }

  onKeyDown = (e, ...args) => {
    const { onKeyDown } = this.props

    if (e.keyCode === KeyCode.UP) {
      const ratio = this.getRatio(e)
      this.up(e, ratio)
      this.stop()
    } else if (e.keyCode === KeyCode.DOWN) {
      const ratio = this.getRatio(e)
      this.down(e, ratio)
      this.stop()
    }

    this.lastKeyCode = e.keyCode
    if (onKeyDown) {
      onKeyDown(e, ...args)
    }
  }

  onKeyUp = (e, ...args) => {
    const { onKeyUp } = this.props

    this.stop()

    // Trigger user key up
    if (onKeyUp) {
      onKeyUp(e, ...args)
    }
  }

  onChange = (e) => {
    if (this.state.focused) {
      this.inputting = true
    }
    const input = this.props.parser(this.getValueFromEvent(e))
    this.setState({ inputValue: input })
    this.props.onChange(this.toNumberWhenUserInput(input)) // valid number or invalid string
  }

  onMouseUp = (...args) => {
    const { onMouseUp } = this.props

    if (onMouseUp) {
      onMouseUp(...args)
    }
  };

  onFocus = (...args) => {
    this.setState({
      focused: true,
    })
    this.props.onFocus(...args)
  }

  onBlur = (e, ...args) => {
    this.inputting = false
    this.setState({
      focused: false,
    })
    const value = this.getCurrentValidValue(this.state.inputValue)
    e.persist() 
    this.setValue(value, () => {
      this.props.onBlur(e, ...args)
    })
  }

  getCurrentValidValue(value) {
    let val = value
    if (val === '') {
      val = ''
    } else if (!this.isNotCompleteNumber(val)) {
      val = getValidValue(val, this.props.min, this.props.max)
    } else {
      val = this.state.value
    }
    return this.toNumber(val)
  }

  getRatio(e) {
    let ratio = 1
    if (e.metaKey || e.ctrlKey) {
      ratio = 0.1
    } else if (e.shiftKey) {
      ratio = 10
    }
    return ratio
  }

  getValueFromEvent(e) {
    // optimize for chinese input expierence
    let value = e.target.value.trim().replace(/。/g, '.')

    if ('decimalSeparator' in this.props) {
      value = value.replace(this.props.decimalSeparator, '.')
    }

    return value
  }

  setValue(v, callback) {
    // trigger onChange
    const newValue = this.isNotCompleteNumber(parseFloat(v, 10)) ? undefined : parseFloat(v, 10)
    const changed = newValue !== this.state.value ||
      `${newValue}` !== `${this.state.inputValue}` 
    if (!('value' in this.props)) {
      this.setState({
        value: newValue,
        inputValue: this.toPrecisionAsStep(v),
      }, callback)
    } else {
      // always set input value same as value
      this.setState({
        inputValue: this.toPrecisionAsStep(this.state.value),
      }, callback)
    }
    if (changed) {
      this.props.onChange(newValue)
    }
  }

  getPrecision(value) {
    if ('precision' in this.props) {
      return this.props.precision
    }
    const valueString = value.toString()
    if (valueString.indexOf('e-') >= 0) {
      return parseInt(valueString.slice(valueString.indexOf('e-') + 2), 10)
    }
    let precision = 0
    if (valueString.indexOf('.') >= 0) {
      precision = valueString.length - valueString.indexOf('.') - 1
    }
    return precision
  }

  // step={1.0} value={1.51}
  // press +
  // then value should be 2.51, rather than 2.5
  // if this.props.precision is undefined
  // https://github.com/react-component/input-number/issues/39
  getMaxPrecision(currentValue, ratio = 1) {
    if ('precision' in this.props) {
      return this.props.precision
    }
    const { step } = this.props
    const ratioPrecision = this.getPrecision(ratio)
    const stepPrecision = this.getPrecision(step)
    const currentValuePrecision = this.getPrecision(currentValue)
    if (!currentValue) {
      return ratioPrecision + stepPrecision
    }
    return Math.max(currentValuePrecision, ratioPrecision + stepPrecision)
  }

  getPrecisionFactor(currentValue, ratio = 1) {
    const precision = this.getMaxPrecision(currentValue, ratio)
    return Math.pow(10, precision)
  }

  getInputDisplayValue = () => {
    const { focused, inputValue, value } = this.state
    let inputDisplayValue
    if (focused) {
      inputDisplayValue = inputValue
    } else {
      inputDisplayValue = this.toPrecisionAsStep(value)
    }

    if (inputDisplayValue === undefined || inputDisplayValue === null) {
      inputDisplayValue = ''
    }

    return inputDisplayValue
  };


  fixCaret(start, end) {
    if (start === undefined || end === undefined || !this.input || !this.input.value) {
      return 
    }

    try {
      const currentStart = this.input.selectionStart
      const currentEnd = this.input.selectionEnd

      if (start !== currentStart || end !== currentEnd) {
        this.input.setSelectionRange(start, end)
      }
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
    }
  }

  restoreByAfter = (str) => {
    if (str === undefined) return false

    const fullStr = this.input.value
    const index = fullStr.lastIndexOf(str)

    if (index === -1) return false

    if (index + str.length === fullStr.length) {
      this.fixCaret(index, index)

      return true
    }
    return false
  };

  partRestoreByAfter = (str) => {
    if (str === undefined) return false

    // For loop from full str to the str with last char to map. e.g. 123
    // -> 123
    // -> 23
    // -> 3
    return Array.prototype.some.call(str, (_, start) => {
      const partStr = str.substring(start)

      return this.restoreByAfter(partStr)
    })
  };

  formatWrapper(num) {
    if (isNegativeZero(num)) {
      return '-0'
    }
    if (this.props.formatter) {
      return this.props.formatter(num)
    }
    return num
  }

  toPrecisionAsStep(num) {
    if (this.isNotCompleteNumber(num) || num === '') {
      return num
    }
    const precision = Math.abs(this.getMaxPrecision(num))
    if (precision === 0) {
      return num.toString()
    }
    if (!isNaN(precision)) {
      return Number(num).toFixed(precision)
    }
    return num.toString()
  }

  // '1.' '1x' 'xx' '' => are not complete numbers
  isNotCompleteNumber(num) {
    return (
      isNaN(num) ||
      num === '' ||
      num === null ||
      (num && num.toString().indexOf('.') === num.toString().length - 1)
    )
  }

  toNumber(num) {
    if (this.isNotCompleteNumber(num)) {
      return num
    }
    if ('precision' in this.props) {
      return Number(Number(num).toFixed(this.props.precision))
    }
    return Number(num)
  }

  // '1.0' '1.00'  => may be a inputing number
  toNumberWhenUserInput(num) {
    // num.length > 16 => prevent input large number will became Infinity
    if ((/\.\d*0$/.test(num) || num.length > 16) && this.state.focused) {
      return num
    }
    return this.toNumber(num)
  }

  upStep(val, rat) {
    const { step, min } = this.props
    const precisionFactor = this.getPrecisionFactor(val, rat)
    const precision = Math.abs(this.getMaxPrecision(val, rat))
    let result
    if (typeof val === 'number') {
      result =
        ((precisionFactor * val + precisionFactor * step * rat) /
        precisionFactor).toFixed(precision)
    } else {
      result = min === -Infinity ? step : min
    }
    return this.toNumber(result)
  }

  downStep(val, rat) {
    const { step, min } = this.props
    const precisionFactor = this.getPrecisionFactor(val, rat)
    const precision = Math.abs(this.getMaxPrecision(val, rat))
    let result
    if (typeof val === 'number') {
      result =
        ((precisionFactor * val - precisionFactor * step * rat) /
        precisionFactor).toFixed(precision)
    } else {
      result = min === -Infinity ? -step : min
    }
    return this.toNumber(result)
  }

  step(type, e, ratio = 1, recursive) {
    this.stop()
    if (e) {
      e.persist()
      e.preventDefault()
    }
    const props = this.props
    if (props.disabled) {
      return
    }
    const value = this.getCurrentValidValue(this.state.inputValue) || 0
    if (this.isNotCompleteNumber(value)) {
      return
    }
    let val = this[`${type}Step`](value, ratio)
    const outOfRange = val > props.max || val < props.min
    if (val > props.max) {
      val = props.max
    } else if (val < props.min) {
      val = props.min
    }
    this.setValue(val)
    this.setState({
      focused: true,
    })
    if (outOfRange) {
      return
    }
    this.autoStepTimer = setTimeout(() => {
      this[type](e, ratio, true)
    }, recursive ? SPEED : DELAY)
  }

  stop = () => {
    if (this.autoStepTimer) {
      clearTimeout(this.autoStepTimer)
    }
  }

  down = (e, ratio, recursive) => {
    this.pressingUpOrDown = true
    this.step('down', e, ratio, recursive)
  }

  up = (e, ratio, recursive) => {
    this.pressingUpOrDown = true
    this.step('up', e, ratio, recursive)
  }

  saveUp = (node) => {
    this.upHandler = node
  }

  saveDown = (node) => {
    this.downHandler = node
  }

  saveInput = (node) => {
    this.input = node
  }

  render() {
    const props = { ...this.props }
    const { prefixCls, disabled, readOnly,size ,bordered } = props
    const editable = !props.readOnly && !props.disabled
    const classes = classNames({
      [prefixCls]: true,
      'input': true,
      [props.className]: !!props.className,
      'input-focused': this.state.focused,
      'input-small': size === 'small',
      'input-large': size === 'large',
      'input-default': size === 'default',
      'input-disabled':  !editable,
      'without-border': bordered,
    })
    const wrapClass = classNames({
      [`${prefixCls}-number-wrap`]: true,
      [`${prefixCls}-number-small`]: size === 'small',
      [`${prefixCls}-number-large`]: size === 'large',
      [`${prefixCls}-number-default`]: size === 'default',
      [`${prefixCls}-number-disabled`]: !editable,
    })
    let upDisabledClass = ''
    let downDisabledClass = ''
    const { value } = this.state
    if (value || value === 0) {
      if (!isNaN(value)) {
        const val = Number(value)
        if (val >= props.max) {
          upDisabledClass = `${prefixCls}-handler-up-disabled`
        }
        if (val <= props.min) {
          downDisabledClass = `${prefixCls}-handler-down-disabled`
        }
      } else {
        upDisabledClass = `${prefixCls}-handler-up-disabled`
        downDisabledClass = `${prefixCls}-handler-down-disabled`
      }
    }

    const dataAttributeProps = {}
    for (const key in props) {
      if (
        props.hasOwnProperty(key) &&
        key.substr(0, 5) === 'data-' 
      ) {
        dataAttributeProps[key] = props[key]
      }
    }

    // focus state, show input value
    // unfocus state, show valid value
    const inputDisplayValue = this.getInputDisplayValue()

    let upEvents
    let downEvents
    
    upEvents = {
      onMouseDown: (editable && !upDisabledClass) ? this.up : noop,
      onMouseUp: this.stop,
      onMouseLeave: this.stop,
    }
    downEvents = {
      onMouseDown: (editable && !downDisabledClass) ? this.down : noop,
      onMouseUp: this.stop,
      onMouseLeave: this.stop,
    }

    let inputDisplayValueFormat = this.formatWrapper(inputDisplayValue)
    if ('decimalSeparator' in this.props) {
      inputDisplayValueFormat = inputDisplayValueFormat
        .toString()
        .replace('.', this.props.decimalSeparator)
    }
    const isUpDisabled = !!upDisabledClass || disabled || readOnly
    const isDownDisabled = !!downDisabledClass || disabled || readOnly
    // ref for test
    return (
      <div
        className={wrapClass}
        style={props.style}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onMouseOver={props.onMouseOver}
        onMouseOut={props.onMouseOut}
      >
        <div className={`${prefixCls}-handler-wrap`}>
          <div
            ref={this.saveUp}
            disabled={isUpDisabled}
            unselectable="unselectable"
            {...upEvents}
            className={`${prefixCls}-handler ${prefixCls}-handler-up ${upDisabledClass}`}
          >
            {this.props.upHandler || <span
              unselectable="unselectable"
              className={'icon iconfont iconfont-up'}
              onClick={preventDefault}
            />}
          </div>
          <div
            ref={this.saveDown}
            disabled={isDownDisabled}
            unselectable="unselectable"
            {...downEvents}
            className={`${prefixCls}-handler ${prefixCls}-handler-down ${downDisabledClass}`}
          >
            {this.props.downHandler || <span
              unselectable="unselectable"
              className={'icon iconfont iconfont-down'}
              onClick={preventDefault}
            />}
          </div>
        </div>
        <div
          className={`${prefixCls}-input-wrap`}
        >
          <input
            required={props.required}
            type={props.type}
            placeholder={props.placeholder}
            onClick={props.onClick}
            onMouseUp={this.onMouseUp}
            className={classes}
            autoComplete="off"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyDown={editable ? this.onKeyDown : noop}
            onKeyUp={editable ? this.onKeyUp : noop}
            autoFocus={props.autoFocus}
            maxLength={props.maxLength}
            readOnly={props.readOnly}
            disabled={props.disabled}
            max={props.max}
            min={props.min}
            step={props.step}
            name={props.name}
            id={props.id}
            onChange={this.onChange}
            ref={this.saveInput}
            value={inputDisplayValueFormat}
            pattern={props.pattern}
            {...dataAttributeProps}
          />
        </div>
      </div>
    )
  }
}


