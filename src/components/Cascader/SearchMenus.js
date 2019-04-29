import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { isArray } from './utils'
import ClassNames from 'classnames'

export default class SearchMenus extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    allOptionsStrArr: PropTypes.array,
    filterSearchStr: PropTypes.string,
    setValue:PropTypes.func,
    closePopover:PropTypes.func,
    wrapWidth:PropTypes.number,
    notFoundContent:PropTypes.string,
    searchOptions: PropTypes.array,
    searchLabelName: PropTypes.string,
    searchValueName: PropTypes.string,
    setSearchValue: PropTypes.func,
    searchValue: PropTypes.array,
    size: PropTypes.string,
    hideScrollBar: PropTypes.bool,
    forbidScroll:PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      allOptionsStrArr : this.props.allOptionsStrArr,
      wrapWidth:this.props.wrapWidth,
      dealedOptions : [],
    }
  }
  
  dealSerchValue(str){
    let _dealOptions = [],_allOptionsStrArr = this.state.allOptionsStrArr
    _allOptionsStrArr.forEach((item)=>{
      if(item.label.indexOf(str) >= 0){
        _dealOptions.push({
          originValue:item.value,
          showStr:item.label.replace(item.label.slice(item.label.indexOf(str),item.label.indexOf(str)+str.length),'<span class="selected-text">'+str+'</span>'),
        })
      }
    })
    return _dealOptions
  }
  getValue(value){
    this.props.setValue(value)
    this.props.closePopover()
  }
  getSearchValue(value,label){
    this.props.setSearchValue([value],label)
    this.props.closePopover()
  }
  render() {
    const dealedOptions = this.dealSerchValue(this.props.filterSearchStr)
    const searchOptions = this.props.searchOptions || []
    const _searchLabelName = this.props.searchLabelName
    const _searchValueName = this.props.searchValueName
    const asyncSearch = this.props.searchOptions && isArray(this.props.searchOptions) ? true : false
    const {size,forbidScroll} = this.props
    const searchValue = this.props.searchValue.toString()
    return (
      <div className={ClassNames('cascader-menus',{'cascader-small-font-size':size === 'small','cascader-base-font-size':size === 'default','cascader-large-font-size':size === 'large'})}>
        {
          asyncSearch ? 
            <ul className={ClassNames('cascader-menu',{'hide-scroll':forbidScroll ? true : this.props.hideScrollBar,'scroll-height-default':!forbidScroll})} style={{width:this.state.wrapWidth}}>
              {
                searchOptions.map((option,index)=>{
                  return (
                    <li onClick={this.getSearchValue.bind(this,option[_searchValueName],option[_searchLabelName])} className={ClassNames('cascader-menu-search-item',{'cascader-menu-item-active': searchValue === option[_searchValueName]})} key={index}>
                      {option[_searchLabelName]}
                    </li>
                  )
                })
              }
            </ul>
            : 
            dealedOptions.length > 0 ?
              <ul className={ClassNames('cascader-menu',{'hide-scroll':forbidScroll ? true : this.props.hideScrollBar,'scroll-height-default':!forbidScroll})} style={{width:this.state.wrapWidth}}>
                {dealedOptions.map((option,index)=>{
                  return (
                    <li onClick={this.getValue.bind(this,option.originValue)} className="cascader-menu-search-item" dangerouslySetInnerHTML={(()=>{
                      return {
                        __html:option.showStr,
                      }
                    })()} key={index}></li>
                  )
                })
                }
              </ul>
              : <div className="not-found" style={{width:this.state.wrapWidth}}>{this.props.notFoundContent || '暂无数据'}</div> 
        }
      </div>
    )
  }
}
