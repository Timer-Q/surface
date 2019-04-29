import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Provider } from './context'
import Popover from '../Popover'
import Icon from '../Icon'
import Tag from '../Tag'
import { getMapKey, defaultFilterFn } from './utils.js'

import './style/select.scss'

export default class Select extends Component {
  static propTypes = {
    children: PropTypes.any,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onClick: PropTypes.func,
    onEnter: PropTypes.func,
    onClear: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
      PropTypes.number,
    ]),
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    clearable: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    filterOption: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filterDisabledOption: PropTypes.bool, // 是否过滤掉 disabled 状态的 option
    addonBefore: PropTypes.any,
    addonAfter: PropTypes.any,
    className: PropTypes.string,
    title: PropTypes.node,
    size: PropTypes.oneOf(['tiny', 'small', 'default', 'large']),
    bordered: PropTypes.bool,
    style: PropTypes.object,
    isListenKeyboard: PropTypes.bool,
    readonly: PropTypes.bool,
    defaultOption: PropTypes.node,
    getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    mode: PropTypes.oneOf(['multiple']),
    onVisibleChange: PropTypes.func,
    showSuffix: PropTypes.bool,
    zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    filterDisabledOption: false,
    isListenKeyboard: true,
    bordered: true,
    readonly: false,
    size: 'default',
    showSuffix: true,
    onVisibleChange() {},
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue,
      inputValue: '',
      visible: false,
      keyupCacheIndex: null,
    }
    this.dropDownEl = React.createRef()
    this.selectContentrRef = React.createRef()
    this.inputRef = React.createRef()
    this.valueRef = React.createRef()
    this.filterable = true
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      }
    }
    return null
  }

  componentDidUpdate() {
    if (!this.dropDownEl.current) {
      return null
    }
    // keyboard up down events: options scroll position
    if (this.props.isListenKeyboard) {
      // eslint-disable-next-line
      const optionsEl = ReactDOM.findDOMNode(this.dropDownEl.current)
      if (optionsEl) {
        const optionsRect = optionsEl.getBoundingClientRect()
        const { keyupCacheIndex } = this.state
        // 如果有选中的值
        const selectedIndex =
          this.selectedIndex >= 0 ? this.selectedIndex : keyupCacheIndex

        const selectedOptionEl = optionsEl.children[selectedIndex]
        if (selectedOptionEl) {
          const selectedOptionRect = selectedOptionEl.getBoundingClientRect()
          if (selectedOptionRect.top >= optionsRect.top + optionsRect.height) {
            optionsEl.scrollTop +=
              selectedOptionRect.top -
              (optionsRect.top + optionsRect.height) +
              selectedOptionRect.height
          }
          if (selectedOptionRect.top < optionsRect.top) {
            optionsEl.scrollTop -= optionsRect.top - selectedOptionRect.top
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this.clearBlurTimer()
  }

  /**
   * 根据 props defaultProps state 获取value 和 inputValue
   */
  getValue = () => {
    const { value, defaultValue, mode } = this.props
    const { value: stateValue } = this.state
    let result = value
    if ('value' in this.props) {
      result = value
    } else {
      result =
        stateValue !== undefined && stateValue !== null
          ? stateValue
          : defaultValue
    }
    if (mode === 'multiple' && !Array.isArray(result)) {
      result = []
    }
    return result
  }

  getLabel = () => {
    const value = this.value
    let label = Select.getLabelFromValue(value, this.optionsInfo)
    if (!label) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        label = this.props.placeholder || ''
      }
    }
    return label
  }

  /**
   * 获取所有options
   * @param {*} children
   * @param {*} options
   * @param {*} optionsInfo
   */
  static getOptionsFromChildren(children, options = [], optionsInfo = {}) {
    React.Children.forEach(children, child => {
      if (!child) return
      if (child.type.isSelectOptGroup) {
        Select.getOptionsFromChildren(
          child.props.children,
          options,
          optionsInfo
        )
      } else {
        options.push(child)
        optionsInfo[getMapKey(child.props.value)] = {
          option: child,
          value: child.props.value, // option 的 value
          label: child.props.label || child.props.children, // option 显示的名字
        }
      }
    })
    return { options, optionsInfo }
  }

  /**
   * 通过 Select 的 value 和 optionsInfo 获取选中的值需要显示的label
   * @param {*} props
   * @param {*} optionsInfo 包含所有 option 信息的对象
   */
  static getLabelFromValue(value, optionsInfo) {
    let label = value
    if (value === undefined || value === null) {
      label = ''
    } else if (Array.isArray(value)) {
      label = ''
    } else if (
      optionsInfo[getMapKey(value)] !== undefined &&
      optionsInfo[getMapKey(value)] !== null
    ) {
      label = optionsInfo[getMapKey(value)].label
    }
    return label
  }

  handleClick() {
    const { disabled, onClick } = this.props
    if (!disabled) {
      if (onClick) {
        onClick()
      }
    }
  }

  handleIconClick(event) {
    event.preventDefault()
    this.handleClick()
  }

  handleFocus(e) {
    this.isInputFocus = true
    const { onFocus } = this.props
    onFocus && onFocus(e)
  }

  handleBlur(e) {
    this.isInputFocus = false
    const { onBlur } = this.props
    onBlur && onBlur(e)
  }

  handleKeyDown(options, event) {
    if (!this.props.isListenKeyboard || !this.state.visible) return
    if (!event) return
    let { keyupCacheIndex } = this.state
    if (keyupCacheIndex === null || keyupCacheIndex === undefined) {
      keyupCacheIndex = -1
    }
    if (options && options.length) {
      const optionsLength = options.length
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (keyupCacheIndex < optionsLength - 1) {
          keyupCacheIndex++
        } else {
          keyupCacheIndex = optionsLength - 1
        }
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (keyupCacheIndex > 0) {
          keyupCacheIndex--
        } else {
          keyupCacheIndex = 0
        }
      }
      this.setState(previousState => {
        if (keyupCacheIndex === previousState.keyupCacheIndex) return null
        return {
          keyupCacheIndex,
        }
      })
    }
    if (event.key === 'Enter') {
      this.optionClick(options[keyupCacheIndex])
      const { onEnter } = this.props
      setTimeout(() => {
        onEnter && onEnter(event)
      })
    }
  }

  /**
   * Input Change
   * @param {*} value input value
   */
  handleChange = event => {
    const value = event.target.value
    const { onSearch } = this.props
    onSearch && onSearch(value)
    this.setState(
      { inputValue: value, visible: true },
      this.handleVisibleChange.bind(this, true)
    )
  }

  /**
   * 通过 输入的值 和 option
   * @param {*} input input 输入的值
   * @param {*} child option
   * @param {*} defaultFilter 过滤的方法
   */
  filterOption(input, child, defaultFilter = defaultFilterFn) {
    const { filterDisabledOption, filterOption } = this.props
    if (!input) return true
    // TODO: 可以传入一个 filterOption，自定义过滤规则，后面规范一下
    let filterFn = filterOption

    if ('filterOption' in this.props) {
      if (typeof filterOption === 'boolean') {
        // filterOption === true 的时候 代表不需要过滤 故 this.filterable === false
        this.filterable = !filterOption
        if (filterOption === false) {
          filterFn = defaultFilter
        }
      }
    } else {
      this.filterable = false
      filterFn = defaultFilter
    }

    if (!this.filterable || !filterFn) {
      return true
    } else if (typeof filterFn === 'function') {
      return filterFn.call(this, input, child, filterDisabledOption)
    } else if (filterDisabledOption && child.props.disabled) {
      return false
    }
    return true
  }

  handleDeleteValue = (itemValue, event) => {
    const { mode } = this.props
    let value = this.value
    if (mode === 'multiple') {
      value = value.slice()
      let index = value.indexOf(itemValue)
      if (index >= 0) {
        value.splice(index, 1)
      }
      if (!('value' in this.props)) {
        this.setState({
          value,
        })
      }
      const { onChange } = this.props
      if (onChange) {
        onChange(value, itemValue, event)
      }
    }
  }

  /**
   * 获取过滤后的 option
   * @param {*} children
   */
  renderFilterOptionsFromChildren(children = this.props.children) {
    let filteredOption = []
    const { keyupCacheIndex, inputValue } = this.state

    React.Children.forEach(children, (child, index) => {
      if (!child) return

      if (child.type.isSelectOptGroup) {
        filteredOption.push(
          <div className="option-group" key={index}>
            {child.props.label}
          </div>
        )
        const subOptions = this.renderFilterOptionsFromChildren(
          child.props.children
        )
        filteredOption = filteredOption.concat(subOptions)
        return
      } else if (this.filterOption(inputValue, child)) {
        let newChild = child
        if (React.isValidElement(newChild)) {
          React.cloneElement(child, {
            key: child.key || index,
            isCached: keyupCacheIndex === index,
          })
        }
        filteredOption.push(newChild)
      }
    })

    if (
      !filteredOption ||
      (Array.isArray(filteredOption) && filteredOption.length === 0)
    ) {
      const { defaultOption } = this.props
      filteredOption = (
        <div className="option">
          {defaultOption ? defaultOption : '暂无数据'}
        </div>
      )
    }

    return filteredOption
  }

  /**
   * option 中某一项点击的时候
   * @param {*} option
   */
  optionClick(option, index, event) {
    if (!option) return
    const { onChange, mode, disabled } = this.props
    const {
      value: optionValue,
      children: optionChildren,
      label,
      disabled: optionDisabled,
    } = option.props

    if (!disabled && !optionDisabled) {
      this.selectedIndex = index
      let value = this.value
      let inputValue = this.state.inputValue

      if (mode === 'multiple' && Array.isArray(value)) {
        value = value.slice()
        const { current } = this.selectContentrRef
        if (current) {
          setTimeout(() => {
            current.focus()
          })
        }
        if (value.includes(optionValue)) {
          value = value.filter(item => item !== optionValue)
        } else {
          value.push(optionValue)
        }
      } else {
        if (value === optionValue && inputValue === optionChildren) {
          return
        }
        value = optionValue
        inputValue = optionChildren || label
      }
      this.setState({
        value,
        inputValue: '',
      })
      if (onChange) {
        onChange(value, option.props, event)
      }
    }
  }

  handleClear = event => {
    event && event.stopPropagation()
    if (!this.props.disabled) {
      this.setState({
        inputValue: '',
      })
      if (!('value' in this.props)) {
        this.setState({
          value: this.props.mode === 'multiple' ? [] : '',
        })
      }
      const { onClear } = this.props
      onClear && onClear()
    }
  }

  clearBlurTimer = () => {
    if (this.contentBlurTimer) {
      clearTimeout(this.contentBlurTimer)
      this.contentBlurTimer = null
    }
  }

  handleContentFocus = () => {
    this.clearBlurTimer()
    const { disabled } = this.props
    if (!disabled) {
      if (this.isFocus) {
        return
      }
      const { current } = this.inputRef
      if (current) {
        current.focus()
      }
      this.isFocus = true
      this.setState(
        {
          visible: true,
        },
        this.handleVisibleChange.bind(this, true)
      )
    }
  }

  handleContentBlur = () => {
    this.clearBlurTimer()
    this.contentBlurTimer = setTimeout(() => {
      if (!this.isFocus) {
        return
      }
      const { current } = this.inputRef
      if (current) {
        current.blur()
      }
      this.isFocus = false
      this.setState(
        {
          visible: false,
        },
        this.handleVisibleChange.bind(this, false)
      )
    }, 100)
  }

  handleContentClick = event => {
    event.preventDefault()
    const { onClick } = this.props
    if (onClick) {
      onClick(this.state.visible, this.value, event)
    }
  }

  handleVisibleChange = visible => {
    if (visible && !this.isFocus) {
      this.clearBlurTimer()
    }
    const { onVisibleChange } = this.props
    onVisibleChange(visible)
  }

  renderBaseInput = value => {
    const {
      // disabled,
      readonly,
      onSearch,
      clearable,
      showSuffix,
      mode,
    } = this.props
    const { visible, inputValue } = this.state
    const isFilterable = 'filterOption' in this.props

    let suffix
    if (showSuffix) {
      suffix = (
        <Icon
          onClick={this.handleIconClick.bind(this)}
          className={visible ? 'suffix-rotate' : null}
          type="down"
        />
      )
      if (clearable) {
        const isValidateValue = Array.isArray(value)
          ? value.length > 0
          : !!value
        suffix = isValidateValue ? (
          <Icon onMouseDown={this.handleClear} type="close" />
        ) : (
          suffix
        )
      } else if (onSearch) {
        suffix = <Icon type="search" />
      }
    }

    const selectionCls = classNames('select-selection', {
      'is-single': mode !== 'multiple',
    })

    return (
      <div className={selectionCls} onClick={this.handleClick.bind(this)}>
        {
          <input
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown.bind(this, this._options)}
            value={inputValue}
            className="select-selection-input"
            key="select-input"
            ref={this.inputRef}
            autoComplete="off"
            // disabled={disabled}
            readOnly={readonly || !isFilterable}
          />
        }
        {suffix && <span className="select-selection-suffix">{suffix}</span>}
      </div>
    )
  }

  renderChildren = value => {
    const { mode } = this.props

    if (mode === 'multiple' && Array.isArray(value)) {
      return (
        <ul className="select-multiple">
          {value.map((item, index) => {
            return (
              <li
                className="select-multiple-item select-multiple-value"
                key={index}>
                <Tag
                  type="gray"
                  closable={true}
                  onClose={this.handleDeleteValue.bind(this, item)}>
                  {Select.getLabelFromValue(item, this.optionsInfo)}
                </Tag>
              </li>
            )
          })}
          <li className="select-multiple-item select-multiple-input">
            {this.renderBaseInput(value)}
          </li>
        </ul>
      )
    }
    return this.renderBaseInput(value)
  }

  render() {
    this.optionsInfo = Select.getOptionsFromChildren(
      this.props.children
    ).optionsInfo

    const {
      children,
      className,
      size,
      style,
      getPopupContainer,
      disabled,
      bordered,
      title,
      zIndex,
      placeholder,
    } = this.props

    const { visible, inputValue } = this.state
    this.value = this.getValue()
    this.label = this.getLabel()

    this._options = this.renderFilterOptionsFromChildren(children, this.value)

    const selectCls = classNames('select-wrapper', {
      'is-actived': visible,
      [className]: className,
    })

    const contentCls = classNames('select-content', {
      'is-disabled': disabled,
      'has-border': bordered,
      [`select-content-${size}`]: size,
      'is-focus': this.isFocus,
    })

    const dropdownCls = classNames('select-dropdown', {
      'is-opened': visible,
      [`select-${size}`]: size,
    })

    const titleCls = classNames('select-content-title', {
      [`select-content-title-${size}`]: size,
    })

    const valueStyle = {
      opacity: this.isInputFocus || this.label === placeholder ? 0.565 : 1,
      display: inputValue ? 'none' : 'block',
    }

    return (
      <div key="select-wrapper" style={style} className={selectCls}>
        {title && <div className={titleCls}>{title}</div>}
        <Provider
          value={{
            selectedValue: this.value, // 用给 Option 判断是否选中
            optionClick: this.optionClick.bind(this), // 某一项 Option 点击时，可以获取到 点击的 Option，触发 Select 的 onChange 方法
          }}>
          <Popover
            trigger="click"
            visible={visible}
            style={{ width: '100%' }}
            key="select-popover"
            getPopupContainer={getPopupContainer}
            stretchWidth={true}
            zIndex={zIndex}
            content={
              <div className="select-wrapper">
                <ul className={dropdownCls} ref={this.dropDownEl}>
                  {this._options}
                </ul>
              </div>
            }>
            <div
              ref={this.selectContentrRef}
              tabIndex="-1"
              onFocus={this.handleContentFocus}
              onBlur={this.handleContentBlur}
              onClick={this.handleContentClick}
              className={contentCls}>
              {this.renderChildren(this.value)}
              <div
                className="select-value"
                ref={this.valueRef}
                style={valueStyle}
                title={this.label}>
                &nbsp;
                {this.label}
              </div>
            </div>
          </Popover>
        </Provider>
      </div>
    )
  }
}
