import React from 'react'
import classNames from 'classnames'
import DatePicker from './DatePicker'
import DatePickerBase from './DatePickerBase'

export default class FullDatePicker extends DatePicker {
  render() {
    const dateValue = this.getDateValue()
    const { popupClassName } = this.props
    const cls = classNames('date-picker-full', {
      [popupClassName]: popupClassName,
    })
    return (
      <DatePickerBase
        {...this.props}
        value={dateValue}
        onChange={this.handleChange}
        popupClassName={cls}
        visible={true}
      />
    )
  }
}
