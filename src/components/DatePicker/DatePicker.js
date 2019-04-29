import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import Popover from '../Popover'
import Input from '../Input'
import Icon from '../Icon'
import DatePickerBase from './DatePickerBase'
import { formatDate } from './utils'
import './style/datepicker.scss'

export default class DatePicker extends PureComponent {
  static propTypes = {
    format: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
    ]),
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    popupStyle: PropTypes.object,
    disabled: PropTypes.bool,
    mode: PropTypes.oneOf(['multiple', 'range']),
    clearable: PropTypes.bool,
    getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    format: 'YYYY-MM-DD',
  }

  constructor(props) {
    super(props)
    let dateValue
    if ('value' in props) {
      dateValue = props.value
    } else if ('defaultValue' in props) {
      dateValue = props.defaultValue
    } else {
      dateValue = moment()
    }
    this.state = {
      dateValue: dateValue,
      visible: false,
    }
  }

  handleClick = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  handleChange = (selectedDate, keepPopShow) => {
    const { mode } = this.props
    let dateValue = selectedDate
    if (mode !== 'multiple' && typeof dateValue !== 'string') {
      dateValue = formatDate(this.props, selectedDate)
    }

    if (dateValue === this.dateValue) return

    if (!('value' in this.props)) {
      this.setState({ dateValue })
    }

    const { onChange } = this.props
    if (onChange) {
      onChange(dateValue, selectedDate)
    }

    if (!keepPopShow) {
      this.setState({
        visible: !this.state.visible,
      })
    }
  }

  handleClickOutSide = visible => {
    this.setState({
      visible,
    })
  }

  handleClear = () => {
    const { onClear } = this.props
    if (!('value' in this.props)) {
      this.setState({
        dateValue: '',
      })
    }
    if (onClear) {
      onClear()
    }
  }

  getDateValue = () => {
    let dateValue
    if ('value' in this.props) {
      dateValue = this.props.value
    } else {
      dateValue = this.state.dateValue || this.props.defaultValue
    }
    if (dateValue && typeof dateValue === 'string') {
      dateValue = moment(dateValue)
    }
    return dateValue
  }

  renderSuffix = () => {
    let suffix = <Icon type="calendar-o" />
    const { clearable, onClear } = this.props
    const isValidateValue = Array.isArray(this.dateValue) ? this.dateValue.length > 0 : !!this.dateValue
    if ((clearable || onClear) && isValidateValue) {
      suffix = <Icon type="close" onClick={this.handleClear} />
    }
    return suffix
  }

  render() {
    const {
      placeholder,
      disabled,
      className,
      mode,
      style,
      getPopupContainer,
      zIndex,
      ...rest
    } = this.props

    const { visible } = this.state

    this.dateValue = this.getDateValue()
    let inputValue = this.dateValue
    if (mode === 'multiple') {
      const length = inputValue && inputValue.length
      if (length > 2) {
        inputValue = `已选择${length}个日期`
      }
    } else if (inputValue && !Array.isArray(inputValue)) {
      inputValue = moment(inputValue).format(rest.format)
    }

    const cls = classNames('date-picker-wrapper', {
      'is-disabled': disabled,
    })

    const childrenCls = classNames('date-picker-input', {
      [className]: !!className,
    })

    return (
      <div className={cls}>
        <Popover
          trigger="click"
          visible={visible}
          getPopupContainer={getPopupContainer}
          zIndex={zIndex}
          unmountOnExit
          onClickOutSide={this.handleClickOutSide}
          content={
            <DatePickerBase
              mode={mode}
              {...rest}
              visible={visible}
              value={this.dateValue}
              onChange={this.handleChange}
            />
          }>
          <Input
            className={childrenCls}
            value={inputValue}
            suffix={this.renderSuffix()}
            style={style}
            size={rest.size}
            placeholder={placeholder}
            disabled={disabled}
            onClick={this.handleClick}
          />
        </Popover>
      </div>
    )
  }
}
