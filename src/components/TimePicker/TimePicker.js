import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import TimePickerBase from './TimePickerBase'
import Input from '../Input'
import Popover from '../Popover'
import Icon from '../Icon'
import './style/timepicker.scss'

export default class TimePicker extends Component {
  static propTypes = {
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    defaultValue: PropTypes.object,
    format: PropTypes.string,
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    style: PropTypes.object,
    popupStyle: PropTypes.object,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    disabled: PropTypes.bool,
    clearable: PropTypes.bool,
    readonly: PropTypes.bool,
    extra: PropTypes.any,
    bound: PropTypes.object,
    zIndex: PropTypes.number,
    getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  }

  static defaultProps = {
    showHour: true,
    showMinute: true,
    showSecond: true,
    // defaultValue: moment(),
    readonly: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue,
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps || 'defaultValue' in nextProps) {
      return {
        value: nextProps.value || nextProps.defaultValue,
      }
    }
    return null
  }

  handleChange = value => {
    this.setValue(value)
  }

  handleClear(event) {
    event.stopPropagation()
    this.setValue(null)
  }

  setValue(value) {
    if (!('value' in this.props)) {
      this.setState({ value })
    }
    const { onChange } = this.props
    onChange && onChange(value, value && value.format(this.getFormat()))
  }

  getFormat() {
    const { format, showHour, showMinute, showSecond } = this.props
    if (format) {
      return format
    }

    return [
      showHour ? 'HH' : '',
      showMinute ? 'mm' : '',
      showSecond ? 'ss' : '',
    ]
      .filter(item => !!item)
      .join(':')
  }

  render() {
    const { value } = this.state
    const {
      disabled,
      clearable,
      defaultValue,
      showHour,
      showMinute,
      showSecond,
      readonly,
      extra,
      bound,
      style,
      zIndex,
      getPopupContainer,
      ...rest
    } = this.props
    const suffix = clearable ? (
      <span onClick={e => this.handleClear(e)}>
        <Icon type="close" />
      </span>
    ) : (
      <Icon type="clock-circle-o" />
    )

    let popContent = (
      <TimePickerBase
        {...rest}
        onChange={this.handleChange}
        value={this.state.value}
        defaultValue={defaultValue}
        showHour={showHour}
        showMinute={showMinute}
        showSecond={showSecond}
        key="timerPockerBase"
      />
    )

    if (extra) {
      popContent = (
        <React.Fragment>
          {popContent}
          {React.isValidElement(extra)
            ? React.cloneElement(extra, {
              key: extra.key || 'timerPickerExtra',
            })
            : extra}
        </React.Fragment>
      )
    }

    let result = value
    if (moment.isMoment(value)) {
      result = value.format(this.getFormat())
    } else if (value) {
      const formatValue = moment(value, this.getFormat())
      if (formatValue.isValid()) {
        result = formatValue.format(this.getFormat())
      }
    } else {
      result = ''
    }

    return (
      <Popover
        content={popContent}
        trigger="click"
        stretchWidth
        zIndex={zIndex}
        bound={bound}
        getPopupContainer={getPopupContainer}
      >
        <Input
          {...rest}
          style={style}
          suffix={suffix}
          disabled={disabled}
          value={result}
          readonly={readonly}
        />
      </Popover>
    )
  }
}
