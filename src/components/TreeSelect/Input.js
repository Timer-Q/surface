import React, { Component } from 'react'
import ClassNames from 'classnames'
import Icon from '../Icon'
import PropTypes from 'prop-types'

export default class Input extends Component {
  static propTypes = {
    showPopover: PropTypes.func,
    wrapSelected: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.array,
    disabled: PropTypes.bool,
    handleSelectWrapEvent: PropTypes.func,
    allowClear: PropTypes.bool,
    clearValue: PropTypes.func,
    onSearch: PropTypes.func,
    style: PropTypes.object,
    size: PropTypes.string,
    closePopover: PropTypes.func,
  }
  constructor(props) {
    super(props)
    this.state = {
      wrapSelected: false,
      showDel:false,
      inputKey:Date.now(),
    }
    this.isFocus = false
    this.lockClick = false
  }
 
  clearValue(){
    this.props.clearValue()
  }
  clearSelect(){
    this.isFocus = false
  }
  handleSelectWrapEvent(e) { 
    // e.stopPropagation()
    if(this.props.disabled || e.target.id === 'tree-select-del-svg' || e.target.id === 'tree-select-close' || this.lockClick){
      return 
    }
    if(this.isFocus){
      this.props.closePopover()
      return
    }
    this.lockClick = true
    this.props.handleSelectWrapEvent()
    this.isFocus = true   
    setTimeout(()=>{
      this.lockClick = false
    },200)
  }
  mouseEnter(){
    if(this.props.allowClear && this.props.value && this.props.value.length > 0 && !this.state.showDel){
      this.setState({showDel:true})
    }
  }
  mouseLeave(){
    if(this.state.showDel){
      this.setState({showDel:false})
    }
  }
  render() {
    const {wrapSelected,style,size,disabled,placeholder} = this.props
    const {showDel} = this.state
    const treeSelectMulDivClass = ClassNames('tree-select-input-wrap', {'tree-select-input-selected': wrapSelected,'tree-select-disabled':disabled})
    const treeSelectSonDivClass = ClassNames('tree-select-input-single tree-select-input-selection tree-single-select-height-'+`${size}`)
    const treeSelectMulIconClose = ClassNames('tree-select-icon-wrap',{'tree-select-v-h':!showDel || disabled})
    const treeSelectSinDownIconClass = ClassNames('tree-select-icon-wrap',{'tree-single-select-icon-disabled':disabled})
    const value = this.props.value ? this.props.value[0] : undefined
    return (
      <div style={style} 
        onMouseEnter={this.mouseEnter.bind(this)}
        onMouseLeave={this.mouseLeave.bind(this)}
        onClick={this.handleSelectWrapEvent.bind(this)}
        className={treeSelectMulDivClass}>
        <div className={treeSelectSonDivClass}>  
          <span className={ClassNames('placeholder-text',{'text-normal':value,'text-shadow':!value})}>{value ? value.title : placeholder || '请选择'}</span> 
        </div>
        <div className={treeSelectSinDownIconClass}>
          <Icon type="down" className={ClassNames({ 'tree-select-down': !wrapSelected, 'tree-select-up': wrapSelected })} />
        </div>
        <div
          className={treeSelectMulIconClose}
          onClick={this.clearValue.bind(this)}>
          <Icon type="close-circle" className="tree-select-close" id="tree-select-close"/>
        </div>
      </div>
    )
  }
}
