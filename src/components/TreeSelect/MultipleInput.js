import React, { Component } from 'react'
import ClassNames from 'classnames'
import Icon from '../Icon'
import PropTypes from 'prop-types'

export default class MultipleInput extends Component {
  static propTypes = {
    showPopover: PropTypes.func,
    wrapSelected: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.array,
    delSelectedData: PropTypes.func,
    disabled: PropTypes.bool,
    closePopover: PropTypes.func,
    handleSelectWrapEvent: PropTypes.func,
    allowClear: PropTypes.bool,
    clearValue: PropTypes.func,
    onSearch: PropTypes.func,
    style: PropTypes.object,
    size: PropTypes.string,
    showSearch: PropTypes.bool,
  }
  constructor(props) {
    super(props)
    this.state = {
      wrapSelected: false,
      inputInsert: false,
      showDel:false,
      inputKey:Date.now(),
    }
    this.isFocus = false
    this.lockClick = false
    this.textInput = React.createRef()
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
    this.textInput.current.focus()
    setTimeout(()=>{
      this.lockClick = false
    },200)
  }
  valueChange(e){
    let textInput = this.textInput.current
    textInput.style.width = e.target.value.length * 10 + 4 + 'px'
    if(e.target.value.length === 0){
      this.setState({inputInsert:false})
    }else{
      this.setState({inputInsert:true})
    }
    this.props.onSearch(e.target.value)
  }
  clearSelect(){
    // if(this.isFocus){
    //   this.isFocus = !this.isFocus
    //   return
    // }
    this.isFocus = false
    this.setState({inputInsert:false,inputKey:Date.now()})
  }
  clearInput(){
    this.setState({inputInsert:false,inputKey:Date.now()})
  }
  delSelectedData(delObj,e){
    e.stopPropagation()
    this.props.delSelectedData(delObj)
  }
  clearValue(){
    this.props.clearValue()
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
    const hidePlaceholder = this.props.value && this.props.value.length > 0 ? true : this.state.inputInsert
    const {inputKey,showDel} = this.state
    const {disabled,style,size,wrapSelected,value,showSearch} = this.props
    const treeSelectMulDivClass = ClassNames('tree-select-input-wrap', {'tree-select-input-selected': wrapSelected,'tree-select-disabled':disabled})
    const treeSelectMulSonDivClass = ClassNames('tree-select-input-collect tree-select-input-selection tree-select-height-'+`${size}`,{'tree-select-hover-border':!disabled})
    const treeSelectMulDivIconClass = ClassNames({ 'tree-select-down': !wrapSelected, 'tree-select-up': wrapSelected, 'tree-select-v-h':showDel })
    const treeSelectMulIconClose = ClassNames('tree-select-icon-wrap',{'tree-select-v-h':!showDel})
    const treeSelectDivUl = 'tree-select-selection_rendered f-c tree-select-multiple-ul tree-select-multiple-ul-'+`${size}`
    const treeSelectMulInputClass = ClassNames('tree-select-search_field',{'tree-select-d-n':!showSearch})
    return (
      <div 
        style={style} 
        className={treeSelectMulDivClass}
        onMouseEnter={this.mouseEnter.bind(this)}
        onClick={this.handleSelectWrapEvent.bind(this)}
        onMouseLeave={this.mouseLeave.bind(this)}>
        <div className={treeSelectMulSonDivClass}>
          <ul className={treeSelectDivUl}>
            {
              value.map((item,index)=>{
                return (
                  <li className={ClassNames('tree-select-selection__choice f-c m-r-2',{'tree-select-selection-extratagtext':item.value === 'extraTagText'})} key={item.key+''+index}>
                    {item.title}
                    {!disabled && item.value !== 'extraTagText' ? <span className="tree-select-selection_choice_remove">
                      <i className="tree-select-remove-icon" onClick={this.delSelectedData.bind(this,item)}>
                        <svg id="tree-select-del-svg" viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                      </i>
                    </span> : ''}
                  </li>
                )
              })
            }
            <li className="tree-select-selection-input"><input ref={this.textInput} key={inputKey} type="text" style={{ width: 4 }} onChange={this.valueChange.bind(this)} className={treeSelectMulInputClass} /></li>
          </ul> 
          
        </div>
        <div className="tree-select-icon-wrap">
          {!disabled ? <Icon type="down" className={treeSelectMulDivIconClass} /> : ''}
        </div>
        <div
          className={treeSelectMulIconClose}
          onClick={this.clearValue.bind(this)}>
          <Icon type="close-circle" className="tree-select-close" id="tree-select-close"/>
        </div>
        {!hidePlaceholder ?  <div className="placeholder-text text-shadow">
          {this.props.placeholder || '请选择'}
        </div> : ''}
      </div>
    )
  }
}
