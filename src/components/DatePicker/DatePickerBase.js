import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import Icon from '../Icon'
import Checkbox from '../Checkbox'
import TimePicker from '../TimePicker'
import Button from '../Button'
import {
  getDays,
  weekDays,
  allMonths,
  isSame,
  isMonthYearBefore,
  isMonthYearAfter,
  formatDate,
  getWeeksOfOneMonth,
} from './utils'

export default class DatePickerBase extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
    ]),
    mode: PropTypes.oneOf(['multiple', 'range']),
    format: PropTypes.string,
    popupClassName: PropTypes.string,
    popupStyle: PropTypes.object,
    size: PropTypes.string,
    disabledDate: PropTypes.func,
    dateRender: PropTypes.func,
    visible: PropTypes.bool,
    showTime: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  }

  static defaultProps = {
    format: 'YYYY-MM-DD',
    disabledDate() {},
    dateRender() {},
    showTime: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      panelType: 'day',
      value: this.getSelectedDay(),
      multipleValue: Array.isArray(props.value) ? props.value : [props.value],
    }
    this.firstRender = true
  }

  getTimeInfo = () => {
    const { showTime } = this.props
    if (showTime && typeof showTime !== 'boolean') {
      return showTime
    }
    return {}
  }

  getSelectedDay = () => {
    const { mode, value, showTime } = this.props
    if (mode === 'multiple') {
      // 取最后一天
      return value ? moment(value[value.length - 1]) : moment()
    }
    if (showTime) {
      const timeInfo = this.getTimeInfo()
      if (!value && 'defaultValue' in timeInfo) {
        return moment(timeInfo.defaultValue, timeInfo.format || 'HH:mm:ss')
      }
    }
    return value || moment()
  }

  getDateObj() {
    const { mode, value: propsValue = [] } = this.props
    const { value } = this.state

    if (mode === 'multiple') {
      // 选中的值组成的日历 格式为 {2018: 9: [,,2018-09-03,,,]}
      // 2018 年 9 月份第 3 天有日期 2018-09-03
      this.virtualCalendar = {}
      this.selectedWeekInfo = {}
      const valueYear = value.year()
      const valueMonth = value.month()
      this.currentMonthSelectedDays = {
        [valueYear]: {
          [valueMonth]: [],
        },
      }
      this.virtualCalendar = {
        [valueYear]: {
          [valueMonth]: [],
        },
      }
      if (Array.isArray(propsValue)) {
        propsValue.map(date => {
          let dateCopy = date
          if (typeof date === 'string') {
            dateCopy = moment(dateCopy)
          }
          const currentYear = dateCopy.year()
          const currentMonth = dateCopy.month()
          const dateOfMonth = dateCopy.date()
          const currentWeekDay = dateCopy.day()

          if (valueMonth === currentMonth && valueYear === currentYear) {
            this.virtualCalendar[currentYear][currentMonth][dateOfMonth] = date
            this.currentMonthSelectedDays[currentYear][currentMonth].push(date)

            this.selectedWeekInfo[currentWeekDay] =
              (this.selectedWeekInfo[currentWeekDay] || 0) + 1
          }
        })
      }
    }

    const days = getDays(value)
    return days
  }

  handleChange = (value, extra) => {
    const { onChange } = this.props
    if (onChange) {
      onChange(value, extra)
    }
    this.setState({
      panelType: 'day',
    })
  }

  /**
   * 选择日期
   */
  handleDateClick = (date, isDisabled, event) => {
    event.stopPropagation()
    if (!isDisabled) {
      let result = date
      const { mode, value } = this.props
      if (mode === 'multiple' && Array.isArray(value)) {
        result = [...value]
        const strDate = formatDate(this.props, date)
        if (value.includes(strDate)) {
          result.splice(value.indexOf(strDate), 1)
        } else {
          result.push(strDate)
        }
        this.handleChange(result, true)
      } else {
        this.handleChange(result)
      }
      this.setState({
        value: date,
      })
    }
  }

  toggleDaysCheck = (isCheckAllMonth, weekDay, checkboxProps) => {
    const { disabledDate } = this.props
    // 此处的 value 是依据 props 中 value 的最后一项， 通过changeMonth、changeYear得到
    const { value: selectedValue } = this.state
    const result = []
    this.days.forEach(day => {
      const dayOfMonth = day.day()
      if (day.month() === selectedValue.month() && !disabledDate(day)) {
        // 是否选择全月
        if (!isCheckAllMonth) {
          // 星期相等
          if (dayOfMonth === parseInt(weekDay, 10)) {
            result.push(day.format(this.props.format))
          }
        } else {
          result.push(day.format(this.props.format))
        }
      }
    })

    const { value } = this.props
    let newValue = value || []

    const { checked, indeterminate } = checkboxProps
    if (checked || indeterminate) {
      newValue = newValue.filter(value => !result.includes(value))
    } else if (!checked) {
      newValue = [...new Set(newValue.concat(result))]
    }

    this.handleChange(newValue, true)
  }

  changeYear(perYear) {
    const { value } = this.state
    const date = value.clone().add(perYear, 'year')
    this.setState({
      value: date,
    })
  }

  changeMonth(perMonth) {
    const { value } = this.state
    const date = value.clone().add(perMonth, 'month')
    this.setState({
      value: date,
    })
  }

  chooseMonth(monthObj) {
    const date = this.state.value.clone().month(monthObj.value)
    this.setState({
      value: date,
      panelType: 'day',
    })
  }

  chooseYear(years, event) {
    event.stopPropagation()
    const { value } = this.state
    const date = value.clone().year(years)
    this.setState({
      value: date,
      panelType: 'day',
    })
  }

  changeDecadeYear(step, event) {
    event.stopPropagation()
    const { value } = this.state
    const date = value.clone().add(step * 10, 'year')
    this.setState({
      value: date,
    })
  }

  handleTimeChange = value => {
    const newValue = value.clone()
    this.setState({
      value: newValue,
    })
  }

  handleChooseTime = () => {
    const { value } = this.state
    this.handleChange(value)
    this.setState({ panelType: 'day' })
  }

  setNow = () => {
    this.handleChange(moment())
    this.setState({ panelType: 'day' })
  }

  showPanel = (type, event) => {
    event.stopPropagation()
    this.setState({ panelType: type })
  }

  renderDays() {
    const { value: selectedDay } = this.state
    const { disabledDate, dateRender } = this.props
    const value = this.getSelectedDay()
    if (!this.days) return
    let tr = []
    const dayList = []
    this.days.forEach((day, index) => {
      const isSelectedDate = isSame(
        value,
        day,
        this.virtualCalendar,
        this.props
      )
      const isDisabled = disabledDate(day)
      const dateCls = classNames('date', {
        'is-selected': isSelectedDate,
        'date-pre': isMonthYearBefore(selectedDay, day),
        'date-after': isMonthYearAfter(selectedDay, day),
        'is-disabled': isDisabled,
      })

      const child = dateRender(day) || day.date()

      const td = (
        <td
          key={index}
          className={dateCls}
          onClick={this.handleDateClick.bind(this, day, isDisabled)}>
          {child}
        </td>
      )
      tr.push(td)
      if ((index + 1) % 7 === 0) {
        dayList.push(<tr key={index}>{tr}</tr>)
        tr = []
      }
    })
    return dayList
  }

  renderWeekDays() {
    const { mode } = this.props

    return weekDays.map(weekDay => {
      let child = weekDay.label
      if (mode === 'multiple') {
        this.weeksOfMonthInfo = getWeeksOfOneMonth(this.state.value)
        const { weeks, dayOfFirstDay, dayofLastDay } = this.weeksOfMonthInfo
        let weekDaysOfMonth = weeks
        if (weekDay.value < dayOfFirstDay) {
          weekDaysOfMonth -= 1
        }
        if (weekDay.value > dayofLastDay) {
          weekDaysOfMonth -= 1
        }
        const selectedWeekDays = this.selectedWeekInfo[weekDay.value]
        child = (
          <Checkbox
            value={weekDay.value}
            indeterminate={
              selectedWeekDays > 0 && selectedWeekDays < weekDaysOfMonth
            }
            checked={selectedWeekDays == weekDaysOfMonth}
            onChange={this.toggleDaysCheck.bind(this, false)}>
            {weekDay.label}
          </Checkbox>
        )
      }
      return <th key={weekDay.value}>{child}</th>
    })
  }

  renderMonthPanel() {
    const { value } = this.state
    const year = value.year()
    const months = value.month()
    const { panelType } = this.state
    if (panelType !== 'month') return null

    const monthNodes = allMonths.map((month, index) => {
      const cls = classNames('date-picker-panel-content-item-cell', {
        'is-selected': months === month.value,
      })
      return (
        <span
          key={index}
          onClick={this.chooseMonth.bind(this, month)}
          className="date-picker-panel-content-item">
          <span className={cls}>{month.label}</span>
        </span>
      )
    })

    const monthsHeader = (
      <div className="date-picker-title date-picker-large-title">
        <div className="date-picker-title-btn">
          <Icon
            onClick={this.changeYear.bind(this, -1, 'month')}
            type="double-left"
          />
        </div>
        <div className="date-picker-title-content">
          <span onClick={this.showPanel.bind(this, 'year')}>{year}</span>
        </div>
        <div className="date-picker-title-btn">
          <Icon
            onClick={this.changeYear.bind(this, 1, 'month')}
            type="double-right"
          />
        </div>
      </div>
    )
    return (
      <div
        style={{ display: panelType === 'month' ? 'block' : 'none' }}
        className="date-picker-panel">
        {monthsHeader}
        <div className="date-picker-panel-content">{monthNodes}</div>
      </div>
    )
  }

  renderYearPanel() {
    const { value } = this.state
    const year = value.year()
    const { panelType } = this.state
    if (panelType !== 'year') return null
    const decadeYearsStart = parseInt(year / 10, 10) * 10
    const decadeYearsEnd = decadeYearsStart + 9
    const decadeYears = []
    for (let i = 0; i < 10; i++) {
      const stepYear = decadeYearsStart + i
      const cls = classNames('date-picker-panel-content-item-cell', {
        'is-selected': year === stepYear,
      })
      decadeYears.push(
        <span
          key={i}
          onClick={e => this.chooseYear(stepYear, e)}
          className="date-picker-panel-content-item">
          <span className={cls}>{stepYear}</span>
        </span>
      )
    }

    const yearsHeader = (
      <div className="date-picker-title date-picker-large-title">
        <div className="date-picker-title-btn">
          <Icon
            onClick={e => this.changeDecadeYear(-1, e)}
            type="double-left"
          />
        </div>
        <div className="date-picker-title-content">
          <span onClick={e => this.showPanel('year', e)}>
            {decadeYearsStart} - {decadeYearsEnd}
          </span>
        </div>
        <div className="date-picker-title-btn">
          <Icon
            onClick={e => this.changeDecadeYear(1, e)}
            type="double-right"
          />
        </div>
      </div>
    )
    return (
      <div
        style={{ display: panelType === 'year' ? 'block' : 'none' }}
        className="date-picker-panel">
        {yearsHeader}
        <div className="date-picker-panel-content">{decadeYears}</div>
      </div>
    )
  }

  renderTimePanel() {
    const { showTime } = this.props
    const { value } = this.state
    const timeHeader = (
      <div className="date-picker-title date-picker-small-title">
        <div className="date-picker-title-content">
          <span className="date-picker-title-content-time">
            {value.format(this.props.format)}
          </span>
        </div>
      </div>
    )
    const timePickerProps = typeof showTime === 'boolean' ? {} : showTime
    return (
      <div className="date-picker-panel">
        {timeHeader}
        <div className="date-picker-panel-content">
          <TimePicker.TimePickerBase
            onChange={this.handleTimeChange}
            value={this.state.value}
            {...timePickerProps}
          />
        </div>
      </div>
    )
  }

  render() {
    const {
      format,
      popupStyle,
      popupClassName,
      size,
      mode,
      showTime,
    } = this.props
    const { value, panelType } = this.state

    const result = Array.isArray(value) ? moment(value[0], format) : value

    this.days = this.getDateObj()

    const cls = classNames('date-picker', {
      [popupClassName]: !!popupClassName,
      [`date-picker-${size}`]: size,
    })

    const currentMonth = result.month()
    const currentYear = result.year()

    // 选择全月需要 该月所有天数 & 已选择的天数
    // TODO: disabled 的天数未能做校验
    let daysInMonth = 0
    let selectedDaysLength = 0
    if (mode === 'multiple') {
      daysInMonth = result.daysInMonth()
      selectedDaysLength = this.currentMonthSelectedDays[currentYear][
        currentMonth
      ].length
    }

    return (
      <div className={cls} style={popupStyle}>
        <div className="date-picker-title">
          <div className="date-picker-title-btn">
            <Icon
              title="选择上一年"
              onClick={this.changeYear.bind(this, -1, 'day')}
              type="double-left"
            />
            <Icon
              title="选择上个月"
              onClick={e => this.changeMonth(-1, e)}
              type="left"
            />
          </div>
          <div className="date-picker-title-content">
            <a
              title="选择年"
              className="date-picker-title-content-item"
              href="javascript:;"
              onClick={e => this.showPanel('year', e)}>
              {currentYear}年
            </a>
            <a
              title="选择月"
              className="date-picker-title-content-item"
              href="javascript:;"
              onClick={e => this.showPanel('month', e)}>
              {currentMonth + 1}月
            </a>
          </div>
          <div className="date-picker-title-btn">
            <Icon
              type="right"
              title="选择下个月"
              onClick={e => this.changeMonth(1, e)}
            />
            <Icon
              title="选择下一年"
              type="double-right"
              onClick={this.changeYear.bind(this, 1, 'day')}
            />
          </div>
        </div>
        <table className="date-picker-content">
          <thead className="date-picker-content-header">
            <tr>{this.renderWeekDays()}</tr>
          </thead>
          <tbody>{this.renderDays()}</tbody>
        </table>
        {mode !== 'multiple' && (
          <div className="date-picker-footer">
            <Button onClick={this.setNow} link size="small">
              {showTime ? '此刻' : '今天'}
            </Button>
            <span>
              {panelType === 'day' && showTime && (
                <span
                  onClick={this.showPanel.bind(this, 'time')}
                  className="date-picker-footer-button"
                  key="toggle-choose-time">
                  选择时间
                </span>
              )}
              {panelType === 'time' && (
                <React.Fragment>
                  <span
                    onClick={this.showPanel.bind(this, 'day')}
                    className="date-picker-footer-button"
                    key="toggle-choose-time">
                    选择日期
                  </span>
                  <Button
                    key="choose-time"
                    size="tiny"
                    onClick={this.handleChooseTime}>
                    确定
                  </Button>
                </React.Fragment>
              )}
            </span>
          </div>
        )}
        {mode === 'multiple' && (
          <div className="date-picker-footer">
            <Checkbox
              checked={selectedDaysLength === daysInMonth}
              indeterminate={selectedDaysLength > 0}
              value={currentMonth}
              onChange={this.toggleDaysCheck.bind(this, true)}>
              全月
            </Checkbox>
          </div>
        )}
        {panelType === 'month' && this.renderMonthPanel()}
        {panelType === 'year' && this.renderYearPanel()}
        {panelType === 'time' && this.renderTimePanel()}
      </div>
    )
  }
}
