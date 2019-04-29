import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon'
import ClassNames from 'classnames'
import { analyseIsArray, extend, isArray } from './utils'

export default class Menus extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    options: PropTypes.array,
    value: PropTypes.array,
    optionTypes: PropTypes.object,
    closePopover: PropTypes.func,
    setValue: PropTypes.func,
    visible: PropTypes.bool,
    valueName: PropTypes.string,
    labelName: PropTypes.string,
    childrenName: PropTypes.string,
    wrapWidth: PropTypes.number,
    notFoundContent: PropTypes.string,
    changeHide: PropTypes.bool,
    size: PropTypes.string,
    hideScrollBar: PropTypes.bool,
    forbidScroll: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      options: extend(true, [], this.props.options),
      defaultValueArr: this.props.value || [],
      valueName: this.props.valueName || 'value',
      labelName: this.props.labelName || 'label',
      childrenName: this.props.childrenName || 'children',
      selectedStr: this.props.value || [],
      wrapWidth: this.props.wrapWidth,
    }
    this.state.filterOptions = this.props.visible
      ? this.getDefaultOptions()
      : []
  }

  handleClick(currentoption, optionAll, menuIndex, event) {
    event.stopPropagation()
    event.preventDefault()
    let _childrenName = this.state.childrenName,
      _valueName = this.state.valueName,
      _value = currentoption[_valueName],
      currentChildArr = [],
      filterOptions = this.state.filterOptions //_value是唯一值

    if (currentoption[_childrenName].length > 0) {
      //如果当前的元素还有子children的话,那么应该把它的children元素打入列表里面，并且设置当前列表的选中状态然后更新数据
      currentChildArr = this.findCurChild(optionAll, _value)
      filterOptions = this.getOptionsList(
        filterOptions,
        currentChildArr,
        menuIndex,
        _value
      )
    } else {
      //如果没有子元素的话那么应该设置当前状态，并保存选中值
      filterOptions = this.setActiveOption(filterOptions, menuIndex, _value)
    }
    filterOptions = this.getRealDisplayOptions(filterOptions)
    this.setState({ filterOptions: filterOptions }, () => {
      let _isLeafChild = currentoption[_childrenName].length <= 0
      this.props.setValue(this.state.selectedStr, _isLeafChild)
      if (_isLeafChild || this.props.changeHide) {
        //如果选中了最后一项
        this.props.closePopover()
      }
    })
  }
  //根据传过来的menuIndex正确返回合适的menulist,传参说明filterOptions是当前显示的下面menu的数据，currentChildArr是当前点击的哪个列表下面的children,menuIndex表示当前点击的是那个列表
  getOptionsList(filterOptions, currentChildArr, menuIndex, _value) {
    let _filterOptions = filterOptions,
      _currentChildArr = currentChildArr,
      _menuIndex = menuIndex
    _filterOptions = this.setActiveOption(_filterOptions, menuIndex, _value)

    _filterOptions = _filterOptions.slice(0, _menuIndex + 1)
    //这里需要重置下currentChildArr里面的状态主要是active的值重置为false
    _currentChildArr.forEach(item => {
      item.active = false
    })
    _filterOptions.push(_currentChildArr)
    return _filterOptions
  }
  //选中当前点击的条目，并且给它active属性设置为true,传参activeOptions为当前的filterOptions,menuIndex表示要更新第几个数组，value是唯一标识
  setActiveOption(activeOptions, menuIndex, value) {
    let _activeOptions = activeOptions,
      _selectedStr = this.state.selectedStr,
      _menuIndex = menuIndex,
      _valueName = this.state.valueName
    _selectedStr = _selectedStr.slice(0, _menuIndex)
    _activeOptions[menuIndex].forEach(item => {
      if (item[_valueName] === value) {
        item.active = true
        _selectedStr.push(item[_valueName])
      } else {
        item.active = false
      }
    })
    this.setState({ selectedStr: _selectedStr })
    return _activeOptions
  }
  //根据点击的那个元素的value在当前这个列表下找到其对应的children，并返回。参数说明arr当前点击的数据所在的数组,value是当前点击的那条数据的value
  findCurChild(arr, value) {
    let _valueName = this.state.valueName,
      _childrenName = this.state.childrenName
    if (arr && isArray(arr)) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][_valueName] === value) {
          return arr[i][_childrenName]
        }
      }
    }
  }
  //获取默认要展示的数据，根据有没有value渲染不同的值
  getDefaultOptions = () => {
    let options = this.state.options,
      _value = this.state.defaultValueArr,
      _options = []
    if (_value && analyseIsArray(_value) && _value.length > 0) {
      //value存在的情况下，处理value
      _options = this.getOptionsByDefaultValue(options, _value)
    } else {
      //没有value的时候展示默认的数据，但是下面级联的选择只需要展示第一列,下面这行是吧options转成一个二维数组
      _options.push(options)
    }
    return this.getRealDisplayOptions(_options)
  }
  getOptionsByDefaultValue(options, value) {
    //根据默认值,在下拉列表打开的时候选中，根据用户传入的值来做匹配的
    let _options = [],
      i = 0,
      _value = value,
      _currentOptions = options,
      _valueName = this.state.valueName,
      _childrenName = this.state.childrenName
    while (i < _value.length) {
      (function(currentArr, valueStr) {
        let valueIsCorrect = false
        currentArr.forEach(item => {
          if (item[_valueName] === valueStr) {
            item.active = true
            valueIsCorrect = true
            _currentOptions = item[_childrenName]
            _options.push(currentArr)
            if (
              !_value[i + 1] &&
              item[_childrenName] &&
              isArray(item[_childrenName])
            ) {
              //哈哈哈哈这个地方简直是神来之笔，这块的作用是判断在父元素选中的情况下该不该把它的child也放在list里面
              _options.push(item[_childrenName])
            }
          }
        })
        if (!valueIsCorrect) {
          //如果value里面有个数据错误或者说没有匹配到,那么就只显示到它的前一项，并且如果前一项如果有children的话，那么也把children显示出来
          if (_options.length > 0) {
            let _tempOption = _options[_options.length - 1]
            _tempOption.forEach(item => {
              if (
                item.active &&
                item[_childrenName] &&
                isArray(item[_childrenName])
              ) {
                _options.push(item[_childrenName])
              }
            })
          } else {
            _options.push(options)
          }
          i = _value.length
        }
      })(_currentOptions, _value[i])
      i++
    }
    return _options
  }
  //处理数据，保证传入的options一定是一个二维数组，然后对数据做一定的处理 这里相当于深拷贝了这个数组
  getRealDisplayOptions(options) {
    let optionsArr = [],
      _labelName = this.state.labelName,
      _valueName = this.state.valueName,
      _childrenName = this.state.childrenName
    options.forEach(item => {
      let itemArr = []
      item.forEach(innerItem => {
        let _tempObj = {}
        _tempObj[_labelName] = innerItem[_labelName]
        _tempObj[_valueName] = innerItem[_valueName]
        _tempObj.active = innerItem.active || false
        _tempObj[_childrenName] =
          innerItem[_childrenName] && isArray(innerItem[_childrenName])
            ? innerItem[_childrenName]
            : []

        itemArr.push(_tempObj)
      })
      optionsArr.push(itemArr)
    })
    return optionsArr
  }
  getOption(option, menuIndex) {
    let _valueName = this.state.valueName,
      _labelName = this.state.labelName
    return (
      <li
        onClick={this.handleClick.bind(this, option, menuIndex)}
        className="cascader-menu-item"
        key={option[_valueName]}>
        {option[_labelName]}
        <Icon type="right" />
      </li>
    )
  }
  render() {
    const _valueName = this.state.valueName,
      _labelName = this.state.labelName,
      _childrenName = this.state.childrenName
    const {size,forbidScroll} = this.props
    return (
      <div className={ClassNames('cascader-menus',{'cascader-small-font-size':size === 'small','cascader-base-font-size':size === 'default','cascader-large-font-size':size === 'large'})}>
        {this.state.filterOptions.map((options, menuIndex) => {
          if (options && options.length > 0) {
            return (
              <ul className={ClassNames('cascader-menu',{'hide-scroll':forbidScroll ? true : this.props.hideScrollBar,'scroll-height-default':!forbidScroll})} key={menuIndex}>
                {options.map(option => {
                  return (
                    <li
                      onClick={this.handleClick.bind(this,option,options,menuIndex)}
                      className={ClassNames('cascader-menu-item', {'cascader-menu-item-active': option.active})}
                      key={option[_valueName] + menuIndex}>
                      {option[_labelName]}
                      {option[_childrenName] && option[_childrenName].length > 0 ? <Icon type="right" /> : ''}
                    </li>
                  )
                })}
              </ul>
            )
          }
        })}
        {this.state.filterOptions[0] &&
        this.state.filterOptions[0].length === 0 ? (
            <div className="not-found" style={{ width: this.state.wrapWidth }}>
              {this.props.notFoundContent || '暂无数据'}
            </div>
          ) : (
            ''
          )}
      </div>
    )
  }
}
