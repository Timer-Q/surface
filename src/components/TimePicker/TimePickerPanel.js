import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { formatOption } from './utils'
import Selecter from './Selecter'

export default class TimePickerPanel extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    hourOptions: PropTypes.array,
    minuteOptions: PropTypes.array,
    secondOptions: PropTypes.array,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    onChange: PropTypes.func,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.formatRule = 'HH:mm:ss'
  }

  onItemChange = (type, itemValue, option) => {
    const { onChange, value } = this.props
    let time = value
    if (!moment.isMoment(value)) {
      const formatValue = moment(value, this.formatRule)
      time = formatValue
      if (!formatValue.isValid()) {
        time = moment('00:00:00', this.formatRule)
      }
    }
    // if (!value || typeof value === "string" || !value.isValid()) {
    //   time = moment("00:00:00", this.formatRule)
    // }
    if (type === 'hour') {
      time.hour(+itemValue)
    } else if (type === 'minute') {
      time.minute(+itemValue)
    } else if (type === 'second') {
      time.second(+itemValue)
    }

    onChange(time, option)
  }

  getValidValue() {
    const { value: propsValue, defaultValue } = this.props
    this.value = propsValue || defaultValue
    if (!moment.isMoment(this.value)) {
      const formatValue = moment(this.value, this.formatRule)
      if (formatValue.isValid()) {
        this.value = formatValue
      }
    }
  }

  renderHours = () => {
    const { hourOptions, showHour, ...rest } = this.props
    if (!showHour) {
      return null
    }
    return (
      <Selecter
        type="hour"
        onSelect={this.onItemChange}
        size={rest.size}
        options={hourOptions.map(option => formatOption(option))}
        selectedIndex={hourOptions.indexOf(
          this.value && this.value.hour && this.value.hour()
        )}
      />
    )
  }

  renderMinutes = () => {
    const { minuteOptions, showMinute, ...rest } = this.props
    if (!showMinute) {
      return null
    }
    return (
      <Selecter
        type="minute"
        onSelect={this.onItemChange}
        size={rest.size}
        options={minuteOptions.map(option => formatOption(option))}
        selectedIndex={minuteOptions.indexOf(
          this.value && this.value.minute && this.value.minute()
        )}
      />
    )
  }

  renderSeconds = () => {
    const { secondOptions, showSecond, ...rest } = this.props
    if (!showSecond) {
      return null
    }
    return (
      <Selecter
        type="second"
        onSelect={this.onItemChange}
        size={rest.size}
        options={secondOptions.map(option => formatOption(option))}
        selectedIndex={secondOptions.indexOf(
          this.value && this.value.second && this.value.second()
        )}
      />
    )
  }

  render() {
    this.getValidValue()
    return (
      <div className="timepicker-panel">
        {this.renderHours()}
        {this.renderMinutes()}
        {this.renderSeconds()}
      </div>
    )
  }
}
