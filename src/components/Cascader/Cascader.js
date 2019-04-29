import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Popover from '../Popover'
import Input from '../Input'
import ClassNames from 'classnames'
import Menus from './Menus'
import SearchMenus from './SearchMenus'

import './style/cascader.scss'
import Icon from '../Icon'
import { isArray } from './utils'

export default class Cascader extends Component {
  static propTypes = {
    children: PropTypes.node,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    labelName: PropTypes.string,
    valueName: PropTypes.string,
    childrenName: PropTypes.string,
    searchAble: PropTypes.bool,
    style: PropTypes.object,
    getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    value: PropTypes.array,
    onChange: PropTypes.func,
    clearAble: PropTypes.bool,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.array,
    changeHide: PropTypes.bool,
    listenEveryChange: PropTypes.bool,
    size: PropTypes.string,
    showClear: PropTypes.bool,
    onSearch: PropTypes.func,
    searchLabelName: PropTypes.string,
    searchValueName: PropTypes.string,
    searchOptions: PropTypes.array,
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: false,//控制级联组件里面Popover的展开与否
      cascaderKey: Date.now(),
      iconType: '',
      valueStr: '',//选中后的value的值
      valueName: this.props.valueName || 'value',//决定根据下拉列表的数据里的哪个字段来作为唯一值
      labelName: this.props.labelName || 'label',//决定根据下拉列表的数据里面的哪个字段作为显示值
      childrenName: this.props.childrenName || 'childrenName',//决定根据下拉列表里面的数据那个字段作为children的集合
      changeHide: this.props.changeHide || false,//决定级联组件是否需要每次改变值的时候就要把Popover关掉
      allOptionsStrArr: [],//searchMenus里面需要的options,主要是对传进来options做处理后显示
      searchFilter: false,//开始搜索的时候将此值设置为true用来表示是否开启了搜索的模式
      showClear:this.props.showClear,//是否显示可以清除搜索的标志
      searchFilterInput: false,//点击输入框的时候将此值设置为true表示输入框是否是搜索也即可以输入的模式
      filterSearchStr: '',//输入框搜索的值
      inputPlaceholder: this.props.placeholder || '',//输入框的placeholder
      value: [],//级联组件点击后选择的值
      searchValue:[],//搜索模式下选择的值，数组里面只能有一个值，下面有时候会把此值设置为空字符串，对于结果来说是没有影响的
    }
    this.lockClick = false
    if (!this.analyseValueOrDefaultValue()) {
      this.state.valueStr = this.getValueFromOptions(this.props.defaultValue || [],this.props)
      this.state.value = this.props.defaultValue
    }else{
      this.state.valueStr = this.getValueFromOptions(this.props.value || [],this.props)//这个只是在mouseEnter的时候用来判断是不是需要显示删除图标
    }
    this.state.allOptionsStrArr = this.getAllValueStr(this.props.options)
  }
  //这个函数的作用是返回用来搜索的对象数组，对象里面包含两个值分别是label(显示值)和value(键值).里面采用了递归的方式
  getAllValueStr(options) {
    let _options = options,
      _allOptionsStrArr = [],
      _labelName = this.state.labelName,
      _valueName = this.state.valueName,
      _childrenName = this.state.childrenName
    function realGetAllValueStr(arrOpt, labelStr, valueStr) {
      arrOpt.forEach(item => {
        let _resultStr = labelStr
            ? labelStr + ' / ' + item[_labelName]
            : item[_labelName],
          _resultValue = valueStr.slice(0)
        _resultValue.push(item[_valueName])
        if (item[_childrenName]) {
          realGetAllValueStr(item[_childrenName], _resultStr, _resultValue)
        } else {
          _allOptionsStrArr.push({
            label: _resultStr,
            value: _resultValue,
          })
        }
      })
    }
    realGetAllValueStr(_options, '', [])
    return _allOptionsStrArr
  }
  //这个函数的作用是根据传入的value或者说是defaultValue获取最后真实显示在input上面的字符串，因为可能传过来的value、defaultValue里面的值子元素里面可能没有所以这里要处理下
  getValueFromOptions(valueArr,nextProps) {
    let _valueArr = valueArr,
      _options = nextProps.options,
      _labelStr = '',
      _labelArr = [],
      i = 0
    if(!(isArray(nextProps.searchOptions) && nextProps.searchOptions.length > 0)){
      while (i < _valueArr.length) {
        (function(currentOption, currentValue) {
          currentOption.forEach(item => {
            if (item[nextProps.valueName] === currentValue) {
              _labelArr.push(item[nextProps.labelName])
              _options = item[nextProps.childrenName]
            }
          })
        })(_options, _valueArr[i])
        i++
      }
      _labelStr = _labelArr.join('/')
    }else{
      nextProps.searchOptions.forEach((item)=>{
        if(nextProps.value.indexOf(item[nextProps.searchValueName]) >= 0){
          _labelStr = item[nextProps.searchLabelName]
        }
      })
    }
    return _labelStr
  }
  //再点击下面的列表后设置input的值并且触发父元素的onchange事件
  setValue(strArr, isLeafChild) {
    let _strArr = this.getValueFromOptions(strArr,this.props) //回传过来的arr包含的都是value值转成对应的label显示
    if ((isLeafChild || this.props.listenEveryChange) && this.props.onChange) {
      this.props.onChange(strArr)
    }
    if (!this.analyseValueOrDefaultValue()) {
      this.setState({ value: strArr, valueStr: _strArr,searchValue:[] })
    }
    this.resetStatus()
  }
  //在异步搜索的情况下设置值
  setSearchValue(value,label){
    this.setState({valueStr:label,searchFilterInput: false,inputPlaceholder: this.props.placeholder || '',filterSearchStr: ''})
    this.props.onChange(value,label)
    //this.resetStatus()
  }
  //在可以搜索的模式下重置，搜索状态的状态值
  resetStatus() {
    this.setState({
      searchFilterInput: false,
      inputPlaceholder: this.props.placeholder || '',
      searchFilter: false,
      filterSearchStr: '',
    })
  }
  //inpu输入框点击后需要打开或者关闭popover，并且根据是否可以搜索的标签来改变下面的一些状态值，比如展示配合搜索的下拉列表，和把当前的输入框里面的值设置为和searchMenus对应的input里面的placeholder
  handleClick (){
    //关闭弹框
    const { visible } = this.state
    if (this.props.disabled || this.lockClick) {
      return
    }
    this.lockClick = true
    if (this.props.searchAble && !this.state.searchFilterInput && !this.state.visible) {
      this.setState({
        searchFilterInput: true,
        inputPlaceholder: this.state.valueStr || this.props.placeholder,
      })
    }
    this.setState({
      visible: !visible,
      cascaderKey: Date.now(),
      filterSearchStr:'',
      iconType: visible ? 'down' : 'up',
      showDel: false,
    })
    setTimeout(() => {
      this.lockClick = false
    }, 200)
  }
  //关闭popover的函数，和hanleClick不同的是里面不在设置配合搜索相关的值了
  closePopover() {
    const { visible } = this.state
    if (this.props.disabled || !visible) {
      return
    }

    this.setState({
      visible: false,
      cascaderKey: Date.now(),
      iconType: visible ? 'down' : 'up',
      showDel: false,
      searchFilterInput:false,
      searchFilter: false,
    })
  }
  //鼠标移入触发这个函数，里面的操作包括显示在有值的情况下显示删除的图标
  mouseEnter() {
    if (!this.state.showDel && this.state.valueStr && !this.props.disabled) {
      this.setState({ showDel: true })
    }
  }
  //判断父组件包含value还是defaultValue
  analyseValueOrDefaultValue() {
    if (this.props.value && isArray(this.props.value)) {
      return true
    } else if (this.props.defaultValue && isArray(this.props.defaultValue)) {
      return false
    }
  }
  //再点击删除的图标的时候触发此函数
  clearValue() {
    let stateObj = {}
    if (this.analyseValueOrDefaultValue()) {
      stateObj = { value: [] }
    } else {
      stateObj = { value: [], valueStr: '' }
    }
    this.setState(stateObj, () => {
      this.mouseLeave()
      this.props.onChange([])
    })
    this.resetStatus()
  }
  //鼠标移出的时候触发此操作，比如隐藏删除的图标
  mouseLeave() {
    if (this.state.showDel) {
      this.setState({ showDel: false })
    }
  }
  //在searchAble为真的时候可以执行此函数
  inputValueChange(e) {
    if (e) {
      this.setState({ filterSearchStr: e, searchFilter: true })
    } else {
      this.setState({ filterSearchStr: '', searchFilter: false })
    }
    if(this.props.onSearch){
      this.props.onSearch(e)
    }
  }
  //获取和value相关的属性，单独提出来一个函数主要是因为searchValue、value、valueStr这三个属性根据value、searchOptions的有无会有不同的值产生所以需要每次都计算一下，如果用静态函数的话那么整个页面会多一个类似的函数
  getValueRelatedProperty(){
    let _props = this.props
    if(_props.value){
      let _valueStr = this.getValueFromOptions(_props.value,_props)
      return {
        valueStr:_valueStr,
        value: isArray(_props.searchOptions) && _props.searchOptions.length > 0 ? [] : _props.value,
        searchValue: isArray(_props.searchOptions) && _props.searchOptions.length > 0 ? _props.value : [],
      }
    }else{
      return {
        searchValue:this.state.searchValue,
        value:this.state.value,
        valueStr:this.state.valueStr,
      }
    }
  }
  render() {
    const { visible,searchFilter,changeHide,cascaderKey,allOptionsStrArr,filterSearchStr,inputPlaceholder,iconType,showDel,showClear } = this.state
    const { searchValue, value, valueStr} = this.getValueRelatedProperty()
    const { className, placeholder, style, size, getPopupContainer } = this.props
    const searchOptionsStatus = isArray(this.props.searchOptions) && this.props.searchOptions.length > 0 ? true : false
    const noSearchModal = !this.props.searchOptions
    const showDelStatus = (showDel || showClear) && valueStr && this.props.clearAble
    const menus = (
      <Menus
        {...this.props}
        changeHide={changeHide}
        visible={visible}
        value={value}
        setValue={this.setValue.bind(this)}
        closePopover={this.closePopover.bind(this)}
        key={cascaderKey}
        wrapWidth={this.cascaderwrap ? this.cascaderwrap.clientWidth : 0}
        size={size || 'default'}
      />
    )
    const searchMenus = (
      <SearchMenus
        {...this.props}
        wrapWidth={this.cascaderwrap ? this.cascaderwrap.clientWidth : 0}
        allOptionsStrArr={allOptionsStrArr}
        setValue={this.setValue.bind(this)}
        closePopover={this.closePopover.bind(this)}
        searchOptions={this.props.searchOptions}
        searchLabelName={this.props.searchLabelName}
        searchValueName={this.props.searchValueName}
        searchValue = {searchValue}
        setSearchValue={this.setSearchValue.bind(this)}
        filterSearchStr={filterSearchStr}
        size={size || 'default'}
      />
    )
    return (
      <div
        className={ClassNames(
          className,
          'cascader-d-i-b cascader-pos-r cascader-wrap'
        )}
        ref={c => {
          this.cascaderwrap = c
        }}
        onMouseEnter={this.mouseEnter.bind(this)}
        onMouseLeave={this.mouseLeave.bind(this)}>
        <Popover
          getPopupContainer={getPopupContainer}
          onClickOutSide={this.closePopover.bind(this)}
          visible={visible}
          popupClassName="cascader-popover"
          content={noSearchModal ? searchFilter ? searchMenus : menus : (searchFilter || searchValue) && searchOptionsStatus ? searchMenus : menus}>
          {!this.state.searchFilterInput ? (
            <Input
              disabled={this.props.disabled}
              readonly={true}
              value={valueStr}
              style={style}
              size={size || 'default'}
              onClick={this.handleClick.bind(this)}
              placeholder={placeholder || '请选择'}
            />
          ) : (
            <Input
              disabled={this.props.disabled}
              style={style}
              size={size || 'default'}
              onChange={this.inputValueChange.bind(this)}
              value={filterSearchStr}
              onClick={this.handleClick.bind(this)}
              placeholder={inputPlaceholder || '请选择'}
            />
          )}
        </Popover>
        <div className="icon-wrap">
          <Icon
            type="down"
            className={ClassNames({
              'cascader-down': iconType == 'down',
              'cascader-up': iconType == 'up',
              'v-h': showDelStatus,
            })}
          />
        </div>
        <div
          className={ClassNames('icon-wrap f-14', {
            'v-h': !showDelStatus,
          })}
          onClick={this.clearValue.bind(this)}>
          <Icon type="close-circle" className="cascader-close" />
        </div>
      </div>
    )
  }
}
