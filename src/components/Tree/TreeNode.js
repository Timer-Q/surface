import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Checkbox from '../Checkbox'
import ClassName from 'classnames'
import { isArray } from 'util'
export default class TreeNode extends Component {
  static propTypes = {
    children: PropTypes.node,
    title:PropTypes.any,
    parentKey:PropTypes.string,
    currentKey:PropTypes.string,
    severEvent:PropTypes.object,
    treeConnect:PropTypes.object,
    defaultExpandAll:PropTypes.bool,
    defaultExpandedKeys:PropTypes.array,
    defaultExpandParent:PropTypes.bool,
    defaultCheckedKeys:PropTypes.array,
    selectedKeys:PropTypes.array,
    expandedKeys:PropTypes.array,
    disabled:PropTypes.bool,
    checkable:PropTypes.bool,
    multiple:PropTypes.bool,
    defaultSelectedKeys:PropTypes.array,
    checkedKeys:PropTypes.array,
    extraHtml:PropTypes.object,
    className:PropTypes.string,
    theme:PropTypes.bool,
    isChild:PropTypes.bool,
    treeExpendedKeys:PropTypes.array,
    realSearchKeys:PropTypes.array,
  }
  constructor(props){
    super(props)
    this.state = {
      ifParent:this.props.children ? true : false,
      ifLeaf:this.props.children ? false : true,
      title:this.props.title || '--',
      severEvent : this.props.severEvent,
      checkedKeys:this.props.checkedKeys,
      parentKey : this.props.parentKey,//这个值非常的重要相当于它可以作为父子组件的DNA来使用
      currentKey : this.props.currentKey,
      allLeafChildKeys:[],//父节点所有叶子节点的key
      allChildKeys:[],
      treeOpen:false,
      allLeafCheckedKeys:[],//父节点下面所有选中的叶子子节点的key
      parentCheckStatus:0,
      disabled:this.props.disabled,
      treeSelect:false,
      indeterminate:false,
      checked:false,
    }
    this.severEvent = this.props.severEvent,
    this.parentKey = this.props.parentKey,//这个值非常的重要相当于它可以作为父子组件的DNA来使用
    this.currentKey = this.props.currentKey
  }
  componentDidMount(){
    this.registeEvent()
    this.getAllChildTreeNode()
    this.getInitTreeselect()
  }
  
  //根据传入的数据判断当前节点是否是展开的状态
  analyseTreeOpen(){
    
    let _defaultExpandedKeys = isArray(this.props.defaultExpandedKeys) ? this.props.defaultExpandedKeys.slice(0) : undefined,_defaultExpandAll = this.props.defaultExpandAll,
      _allChildKeys = isArray(this.state.allChildKeys) ? this.state.allChildKeys.slice(0) : undefined,
      _expandedKeys = isArray(this.props.expandedKeys) ? this.props.expandedKeys.slice(0) : undefined,
      _defaultExpandParent = this.props.defaultExpandParent

    if(this.props.children){
      if(_defaultExpandAll){
        return true
      }else if(_expandedKeys && _expandedKeys.length > 0){
        if(_expandedKeys.indexOf(this.currentKey) >= 0){
          return true
        }
      }else if(_defaultExpandedKeys && _defaultExpandedKeys.length > 0){
        if(_defaultExpandedKeys.indexOf(this.currentKey) >= 0){
          return true
        }
      }
      // if(_defaultExpandAll || (_defaultExpandedKeys && _defaultExpandedKeys.indexOf(this.currentKey) >= 0)){//如果默认展开全部的属性也即defaultExpandAll为真的时候或者_defaultExpandedKeys里面包含当前属性的时候返回true
      //   return true
      // }
      //如果默认展开父节点的属性为true的时候并且当前子节点的key列表里面包含defaultExpandedKeys里面的某个值，也即默认展开的数组里面有自己的子节点或叶子节点那么当前父节点的展开装填应该是true
      if(_defaultExpandParent && _defaultExpandedKeys && _defaultExpandedKeys.some((item)=>{return _allChildKeys.indexOf(item) >= 0 })){
        return true
      }
    }
    return false
  }
  //处理props传过来的默认值
  dealDefaultDataFromProps(){
    let _treeOpen = this.analyseTreeOpen(),expandedKeys = [1].slice(0)
    if(_treeOpen){
      if(!expandedKeys){
        this.props.treeExpendedKeys.push(this.currentKey)
      }
      this.setState({treeOpen:_treeOpen})
    }
    
    if(this.props.defaultCheckedKeys && this.props.defaultCheckedKeys.length > 0){//如果在checkable的模式下，有defaultCheckedKeys的话
      this.dealDefaultCheckedKeys(this.props.defaultCheckedKeys)
    }

  }
  //处理defaultCheckedKeys
  dealDefaultCheckedKeys(checkedKeys){
    let _currentKey = this.currentKey,
      _allLeafChildKeys = this.state.allLeafChildKeys || [],
      _allChildKeys = this.state.allChildKeys || [],
      _realParentKeys = this.parentKey.split(','),
      _treeConnect = this.props.treeConnect,
      _parentCheckedKeys = []
    _realParentKeys = _realParentKeys.slice(0,_realParentKeys.length - 1)
    if(checkedKeys.indexOf(_currentKey) >= 0){//如果要默认选中的数组包含当前节点的话那么不管是叶子节点还是父节点都做如下处理
      this.setState({checked:true,indeterminate:false,allLeafCheckedKeys:_allLeafChildKeys})
    }
    //如果要默认选中的节点数组里面包含当前节点的父节点，要注意的一点是我们的parentKey里面的最后一个节点包含了本身的currentKey所以在下面处理的时候尽量去掉防止多处理一次
    if(this.ifConationSome(_realParentKeys,checkedKeys) && !this.state.checked){
      this.setState({checked:true,indeterminate:false,allLeafCheckedKeys:_allLeafChildKeys})
    }
    //如果默认当前节点的子节点中包含选中的节点数组中的某一个的话，那么是要区分包含的是叶子节点，还是下级的父节点
    if(this.ifConationSome(checkedKeys,_allChildKeys)){
      checkedKeys.forEach((item)=>{
        if(_allChildKeys.indexOf(item) >= 0){
          if(_treeConnect[item].allLeafChildKeys && _treeConnect[item].allLeafChildKeys.length != 0){
            _parentCheckedKeys = _parentCheckedKeys.concat(_treeConnect[item].allLeafChildKeys)
          }else{//包含叶子节点直接push
            _parentCheckedKeys.push(item)
          }
        }
      })
      _parentCheckedKeys = Array.from(new Set(_parentCheckedKeys))
      if(_parentCheckedKeys.length === _allLeafChildKeys.length){
        this.setState({checked:true,indeterminate:false,allLeafCheckedKeys:_parentCheckedKeys})
      }else{
        this.setState({checked:false,indeterminate:true,allLeafCheckedKeys:_parentCheckedKeys})
      }
    }
  }
  //根据checkedKeys获得当前节点的checked状态
  getCheckedStatusFromProps(checkedKeys){
    let _currentKey = this.currentKey,
      _allLeafChildKeys = this.state.allLeafChildKeys || [],
      _allChildKeys = this.state.allChildKeys || [],
      _realParentKeys = this.parentKey.split(','),
      _treeConnect = this.props.treeConnect,
      _parentCheckedKeys = []
    _realParentKeys = _realParentKeys.slice(0,_realParentKeys.length - 1)
    
    if(checkedKeys.indexOf(_currentKey) >= 0){//如果要默认选中的数组包含当前节点的话那么不管是叶子节点还是父节点都做如下处理
      return {_checked:true,_indeterminate:false}
    }
    //如果要默认选中的节点数组里面包含当前节点的父节点，要注意的一点是我们的parentKey里面的最后一个节点包含了本身的currentKey所以在下面处理的时候尽量去掉防止多处理一次
    if(this.ifConationSome(_realParentKeys,checkedKeys) && !this.state.checked){
      return {_checked:true,_indeterminate:false}
    }
    //如果当前节点的子节点中包含要默认选中的节点数组中的某一个的话，那么是要区分包含的是叶子节点，还是下级的父节点
    if(this.ifConationSome(checkedKeys,_allChildKeys)){
      checkedKeys.forEach((item)=>{
        if(_allChildKeys.indexOf(item) >= 0){
          if(_treeConnect[item].allLeafChildKeys && _treeConnect[item].allLeafChildKeys.length != 0){
            _parentCheckedKeys = _parentCheckedKeys.concat(_treeConnect[item].allLeafChildKeys)//这个地方可能会存在数组里面的元素重复的情况
          }else{//包含叶子节点直接push
            _parentCheckedKeys.push(item)
          }
        }
      })
      _parentCheckedKeys = Array.from(new Set(_parentCheckedKeys))
      if(_parentCheckedKeys.length === _allLeafChildKeys.length){
        return {_checked:true,_indeterminate:false}
      }else{
        return {_checked:false,_indeterminate:true}
      }
    }
    return {_checked:this.state.checked,_indeterminate:this.state.indeterminate}
  }
  ifConationSome(testArr,containArr){
    return testArr.some((item)=>{
      return containArr.indexOf(item) >= 0
    })
  }
  registeEvent(){//在节点上注册事件接收其它节点点击回传事件
    this.severEvent.on('getCheckedCallback',this.getCheckedCallback.bind(this))
    this.severEvent.on('onSelect',this.onSelect.bind(this))

  }
  getCheckedCallback(currentKey,checkStatus,allLeafChildKeys){//获取到点击的子节点的key后开始处理,childKey表示点击的子节点的key值，checkStatus表示点击的那个子节点的状态
    if(allLeafChildKeys.length === 0 && this.state.allLeafChildKeys.indexOf(currentKey) >= 0){//点击的是叶子节点
      this.justCalculateDataFromRootLeaf(currentKey,checkStatus)
    }
    if(allLeafChildKeys.length !== 0){//点击的是一个父节点
      this.calculateDataFromRootParent(currentKey,checkStatus,allLeafChildKeys)
    }
  }
  //如果点击的是一个父节点的时候交由此函数处理，传参currentKey表示点击的那个元素的key值，allLeafChildKeys表示点击的那个节点的所有叶子节点的key值
  calculateDataFromRootParent(currentKey,checkStatus,allLeafChildKeys){
    let _parentKeys = this.parentKey.split(','),_allChildKeys = this.state.allChildKeys
    if(_parentKeys.indexOf(currentKey) >= 0){//如果中间的某个父节点被点击了那么处理的方式应该是它的子节点和它本身全部处理一下，然后它后面的是父节点的节点处理一下，另外如果它本身也是子节点的话还要通知它的父节点
      if(this.props.children){
        this.sonParentDealData(checkStatus,allLeafChildKeys)
      }else{
        this.setState({checked:checkStatus})//叶子节点
      }
    }else if(_allChildKeys.indexOf(currentKey) >= 0){
      this.parentDealData(checkStatus,allLeafChildKeys)
    }
  }
  //紧接上个函数如果现在的节点是当前点击的这个节点父节点或者说祖父节点那么由下面这个函数来处理
  parentDealData(checkStatus,allLeafChildKeys){
    let _allLeafCheckedKeys = this.state.allLeafCheckedKeys.slice(0),_allLeafChildKeys = this.state.allLeafChildKeys
    if(checkStatus){//如果这个父节点是选中的状态那么它的父节点应该吧当前节点的所有叶子节点都置为选中的状态
      allLeafChildKeys.forEach((item)=>{
        if(_allLeafCheckedKeys.indexOf(item) < 0){
          _allLeafCheckedKeys.push(item)
        }
      })
      if(_allLeafCheckedKeys.length === _allLeafChildKeys.length){
        this.setState({checked:true,indeterminate:false,allLeafCheckedKeys:_allLeafCheckedKeys})
      }else{
        this.setState({checked:false,indeterminate:true,allLeafCheckedKeys:_allLeafCheckedKeys})
      }
    }else{
      allLeafChildKeys.forEach((item)=>{
        if(_allLeafCheckedKeys.indexOf(item) >= 0){
          _allLeafCheckedKeys.splice(_allLeafCheckedKeys.indexOf(item),1)
        }
      })
      if(_allLeafCheckedKeys.length === 0){
        this.setState({checked:false,indeterminate:false,allLeafCheckedKeys:_allLeafCheckedKeys})
      }else{
        this.setState({checked:false,indeterminate:true,allLeafCheckedKeys:_allLeafCheckedKeys})
      }
    }
  }
  //如果当前节点是点击的这个节点子节点并且同时它又是一个父节点的话那么下面这个函数
  sonParentDealData(checkStatus){
    if(checkStatus){
      this.setState({checked:true,indeterminate:false,allLeafCheckedKeys:this.state.allLeafChildKeys})
    }else{
      this.setState({checked:false,indeterminate:false,allLeafCheckedKeys:[]})
    }
  }
  //单纯的处理从根节点传过来的数据,childKey是点击的根节点上面的唯一值，checkStatus是根节点上的check返回的状态
  justCalculateDataFromRootLeaf(childKey,checkStatus){
    let _allLeafChildKeys = this.state.allLeafChildKeys,_allLeafCheckedKeys = this.state.allLeafCheckedKeys.slice(0),_parentCheckStatus = this.state.parentCheckStatus
    if(_allLeafChildKeys.indexOf(childKey) >= 0){
      if(checkStatus){
        _allLeafCheckedKeys.push(childKey)
        if(_allLeafCheckedKeys.length === _allLeafChildKeys.length){//已经完全选中了
          _parentCheckStatus = 2
        }else{
          _parentCheckStatus = 1
        }
      }else{
        if(_allLeafCheckedKeys.indexOf(childKey) >= 0){
          _allLeafCheckedKeys.splice(_allLeafCheckedKeys.indexOf(childKey),1)
        }
        if(_allLeafCheckedKeys.length === 0){//选中的数组里面已经不包含别的元素了
          _parentCheckStatus = 0
        }else{
          _parentCheckStatus = 1
        }
      }
      this.setState({allLeafCheckedKeys:_allLeafCheckedKeys,indeterminate:_parentCheckStatus === 1 ? true : false,checked:_parentCheckStatus === 2 ? true : false})
    }
  }
  //这个方法很重要，它的作用是根据this.props.children来获取每个父节点所包含的所有根子节点
  getAllChildTreeNode(){
    if(!this.props.children){
      this.props.treeConnect[this.currentKey] = {
        allLeafChildKeys:[],
        allChildKeys:[],
      }
      this.dealDefaultDataFromProps()
      return
    }
    let _children = this.props.children,_allLeafChildKeys = this.state.allLeafChildKeys,_allChildKeys = this.state.allChildKeys
    function getRealChildKey(children){
      children.map((item)=>{
        if(item.props.children){
          _allChildKeys.push(item.key)
          getRealChildKey(item.props.children)
        }else{
          _allChildKeys.push(item.key)
          _allLeafChildKeys.push(item.key)
        }
      })
    }
    getRealChildKey(_children)
    this.props.treeConnect[this.currentKey] = {
      allLeafChildKeys:_allLeafChildKeys,
      allChildKeys:_allChildKeys,
    }
    this.setState({allLeafChildKeys:_allLeafChildKeys,allChildKeys:_allChildKeys},()=>{
      this.dealDefaultDataFromProps()
    })
  }
  checkChange(status){
    if(!this.props.checkedKeys || !isArray(this.props.checkedKeys)){
      this.setState({checked:status,indeterminate:false})
      this.severEvent.emit('getCheckedCallback',this.currentKey,status,this.state.allLeafChildKeys || [])
    }
    this.severEvent.emit('treeCheckChange',this.parentKey,this.state.allChildKeys,status,this.currentKey,this)
  }
  expendCurTree(treeOpen){
    if(!this.props.expandedKeys){
      this.setState({treeOpen:!this.state.treeOpen},()=>{
        this.severEvent.emit('onExpand',this.currentKey,this.state.treeOpen,this)
      })
    }else{
      this.severEvent.emit('onExpand',this.currentKey,!treeOpen,this)
    }
  }
  //选中当前节点
  selectCurTree(selectStatus){
    if(this.props.disabled){
      return 
    }
    if(this.props.selectedKeys){
      this.severEvent.emit('onSelect',this.currentKey,!selectStatus,this)
      return
    }
    this.setState({treeSelect:!selectStatus},()=>{
      this.severEvent.emit('onSelect',this.currentKey,this.state.treeSelect,this)
    })
  }
  onSelect(currentKey){
    if(!this.props.multiple && this.currentKey != currentKey && !this.props.selectedKeys){//每个节点都有监听别的节点是否被选中，但是如果是在selectkeys存在的情况下节点的选中由render里面来决定。
      this.setState({treeSelect:false})
    }
  }
  getInitTreeselect(){
    if(this.props.defaultSelectedKeys.indexOf(this.currentKey) >= 0 && !this.props.selectedKeys){
      this.setState({treeSelect:true})
    }
  }
  getSelectStatusFromProps(){
    if(this.props.selectedKeys.indexOf(this.currentKey) >= 0){
      return true
    } 
    return false
  }
  componentWillUnmount(){
    this.setState = ()=>{
      return
    }
  }
  getShowTreeNode(){
    const _isParent = this.props.children ? true : false
    const _selectStatus = this.props.selectedKeys && isArray(this.props.selectedKeys) ? this.getSelectStatusFromProps() : this.state.treeSelect
    const { _checked,_indeterminate} = this.props.checkedKeys && isArray(this.props.checkedKeys) ? this.getCheckedStatusFromProps(this.props.checkedKeys) : {_checked:this.state.checked,_indeterminate:this.state.indeterminate}
    const {disabled} = this.state
    const {expandedKeys,realSearchKeys,children,theme} = this.props
    const treeOpen = expandedKeys ? this.analyseTreeOpen() : this.state.treeOpen
    const searchBold = realSearchKeys && realSearchKeys.indexOf(this.currentKey) >= 0 ? true : false
    const treeLiClassName = ClassName('tree-li-title',{'text-disabled':disabled,'tree-li-selected':_selectStatus && !theme,'tree-li-unselected':!_selectStatus && !this.props.disabled && !theme,'text-color-ui':_selectStatus && theme,'text-searched-bold':searchBold})
    if(_isParent){
      return(
        <li className={ClassName('tree-li',{'background-grey':this.props.theme,'background-selected':this.props.theme && _selectStatus})}>
          <div className={ClassName(this.props.className,'tree-height-full',{'p-l-18':this.props.isChild && this.props.theme})}>
            <span className={ClassName('tree-li-icon',{'text-disabled':disabled,'tree-v-h':!children || children.length == 0})} onClick={disabled ? ()=>{} : this.expendCurTree.bind(this,treeOpen)}>
              <i className={ClassName('tree-switch-icon tree-icon',{'tree-switch-open':treeOpen,'tree-switch-close':!treeOpen})}>
                <svg viewBox="0 0 1024 1024" className="" data-icon="caret-down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg>
              </i>
            </span>
            {this.props.checkable ? <span className={ClassName('tree-li-checkbox',{'text-disabled':disabled})}><Checkbox disabled={disabled} indeterminate={_indeterminate} checked={_checked} onChange={this.checkChange.bind(this)} /></span> : ''}
            {this.props.extraHtml ? 
              <div className="tree-li-html">{this.props.extraHtml}</div> : 
              <span onClick={this.selectCurTree.bind(this,_selectStatus)} className={treeLiClassName}>{this.state.title || '---'}</span>}
          </div>
          <ul className={ClassName('tree-ul',{'tree-ul-open':treeOpen,'tree-ul-close':!treeOpen,'tree-ui-style':this.props.theme})}>
            {this.props.children.map((child)=>{
              if(React.isValidElement(child)){
                return React.cloneElement(child,{
                  theme:this.props.theme,
                  isChild:true,
                  parentKey:this.props.parentKey+','+child.key,
                  currentKey:child.key,
                  severEvent:this.props.severEvent,
                  treeConnect:this.props.treeConnect,
                  checkable:this.props.checkable,
                  defaultExpandAll:this.props.defaultExpandAll,
                  className:this.props.className,
                  defaultCheckedKeys:this.props.defaultCheckedKeys,
                  defaultExpandedKeys:this.props.defaultExpandedKeys,
                  defaultExpandParent:this.props.defaultExpandParent,
                  defaultSelectedKeys:this.props.defaultSelectedKeys,
                  disabled:this.props.disabled,
                  checkedKeys:this.props.checkedKeys,
                  selectedKeys:this.props.selectedKeys,
                  expandedKeys:this.props.expandedKeys,
                  multiple:this.props.multiple,
                  treeExpendedKeys:this.props.treeExpendedKeys,
                  realSearchKeys:this.props.realSearchKeys,
                })
              }
            })}
          </ul>
        </li>
      )
    }else{
      return(
        <li className={ClassName('tree-li',{'background-grey':this.props.theme,'background-selected':this.props.theme && _selectStatus})}>
          <div className={ClassName(this.props.className,'tree-height-full',{'p-l-18':this.props.isChild && this.props.theme})}>
            <span className="tree-li-icon"></span>
            {this.props.checkable ? <span className={ClassName('tree-li-checkbox',{'text-disabled':disabled})}><Checkbox disabled={disabled} indeterminate={_indeterminate} checked={_checked} onChange={this.checkChange.bind(this)} /></span> : ''}
            {this.props.extraHtml ? 
              <div className="tree-li-html">{this.props.extraHtml}</div> : 
              <span onClick={this.selectCurTree.bind(this,_selectStatus)} className={ClassName('tree-li-title',{'text-disabled':disabled,'tree-li-selected':_selectStatus && !this.props.theme,'tree-li-unselected':!_selectStatus && !this.props.disabled && !this.props.theme,'text-color-ui':_selectStatus && this.props.theme,'text-searched-bold':searchBold})}>{this.state.title || '---'}</span>}      
          </div>
        </li>
      )
    }
  }
  render() {
    return this.getShowTreeNode()
  }
}
