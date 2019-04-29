import React, { Component } from 'react'
import Input from './Input'
import MultipleInput from './MultipleInput'
import Popover from '../Popover'
import PropTypes from 'prop-types'
import Tree from '../Tree'
import TreeNode from './TreeNode'
import './style/treeSelect.scss'
import { isArray,isString } from 'util'

export default class TreeSelect extends Component {
  static TreeNode = TreeNode
  static SHOW_ALL = 'show_all'
  static SHOW_PARENT = 'show_parent'
  static SHOW_CHILD = 'show_child'
  static propTypes = {
    multiple: PropTypes.bool,
    value:PropTypes.any,
    treeData: PropTypes.array,
    defaultValue: PropTypes.any,
    onChange: PropTypes.func,
    showCheckedStrategy: PropTypes.string,
    disabled:PropTypes.bool,
    allowClear:PropTypes.bool,
    dropdownClassName: PropTypes.string,
    stretchWidth: PropTypes.bool,
    maxTagCount: PropTypes.number,
    maxTagPlaceholder: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
    size: PropTypes.string,
    style: PropTypes.object,
    treeDefaultExpandAll: PropTypes.bool,
    treeDefaultExpandedKeys: PropTypes.array,
    treeExpandedKeys: PropTypes.array,
    onExpand: PropTypes.func,
    onCheck: PropTypes.func,
    onSelect: PropTypes.func,
    treeNodeFilterProp: PropTypes.string,
    treeNodeLabelProp: PropTypes.string,
    children: PropTypes.node,
    checkable: PropTypes.bool,
    showSearch: PropTypes.bool,
    test:PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
    this.searchInput = React.createRef()
    this.popOverContainer = React.createRef()
    this.state = {
      visible:false,
      wrapSelected:false,
      valueKeysArr:[],
      valueKeysTreeInfo:[],
      treeKeysFromValues:[],
      inSearchMode:false,
      allowClear:this.props.allowClear || false,
      placeholder:this.props.placeholder || '请选择',
      size:this.props.size || 'default',
      treeDefaultExpandAll:this.props.treeDefaultExpandAll || false,
      valueName:this.props.treeNodeFilterProp || 'value',
      labelName:this.props.treeNodeLabelProp || 'title',
      realSearchKeys:[],
      searchInputKey:Date.now(),
      searchChildren:[],
      searchExpandedKeys:[],
      searchTreeData:[],
    }
    this.treeSelectConnect = this.props.treeData ? this.getTreeConnect().stageObj : this.getTreeConnectFromChild().stageObj
    //树形节点里面所有节点的相关信息，包含了节点的key、value等
    this.treeNodeInfoKeys = this.props.treeData ? this.getTreeConnect().treeNodeInfoKeys : this.getTreeConnectFromChild().treeNodeInfoKeys
    this.treeNodeInfoValues = this.props.treeData ? this.getTreeConnect().treeNodeInfoValues : this.getTreeConnectFromChild().treeNodeInfoValues
    this.showCheckedStrategy = this.getShowCheckedStrategy()
    this.stopBlurEvent = false
  }
  componentDidMount() {
    this.initDeftualValueArr()
  }
  getShowCheckedStrategy(){
    if(!this.props.checkable){
      return TreeSelect.SHOW_ALL
    }
    return this.props.showCheckedStrategy || TreeSelect.SHOW_CHILD
  }
  initDeftualValueArr(){
    if(this.props.defaultValue){
      this.setState({
        valueKeysArr:this.getSelectedValue(this.props.defaultValue).valueKeysArr,
        valueKeysTreeInfo:this.getSelectedValue(this.props.defaultValue).valueKeysTreeInfo,
        treeKeysFromValues:this.getSelectedValue(this.props.defaultValue).treeKeysFromValues,
      })
    }
  }
  showPopover(){
    this.setState({visible:true},()=>{
      if(this.props.showSearch && !this.props.checkable && !this.props.multiple){
        this.searchInput.current.focus()
      }
    })
  }
  closePopover(){
    if(this.textInput.current){
      this.textInput.current.clearSelect()
    }
    this.setState({visible:false,wrapSelected:false})
  }
  
  handleSelectWrapEvent() {
    if(this.props.disabled){
      return
    }
    this.showPopover()
    this.setState({ wrapSelected: true })
  }
  //上面的input里面删除某一个节点的时候，执行此方法
  delSelectedData(valueKeysArr,delObj){
    let delItemValue = delObj.value,_treeSelectConnect = this.treeSelectConnect,_valueKeysArr = valueKeysArr
    if(_valueKeysArr.indexOf(delItemValue) >= 0){
      _valueKeysArr.splice(_valueKeysArr.indexOf(delItemValue),1)
    }
    if(_treeSelectConnect[delItemValue].allLeafChildKeys.length > 0){///如果叶子节点里面有数据的话，那么首先把父节点从列表里面清除然后把剩余的子节点加进来
      _valueKeysArr = _valueKeysArr.filter((item)=>{
        return _treeSelectConnect[delItemValue].allLeafChildKeys.indexOf(item) < 0
      })
    }
    this.receiveKeysChange(_valueKeysArr,'value')
  }
  //根据选择的value或者说是默认传进来的value根据一定的规则获得最后要给上面的输入框要显示的节点
  getSelectedValue(value){
    let _treeSelectConnect = this.treeSelectConnect,_value = value.slice(0),_resultData = [],_tempResultArr = [],_valueKeysTreeInfo = [],_maxTagCount = this.props.maxTagCount,_maxTagPlaceholder = this.props.maxTagPlaceholder,_treeKeysFromValues = []//filterData表示已经筛选过的数据，_value表示原始的数据源
    if(this.props.checkable){//如果checkable是true的话表示父子节点是关联在一起的，也就是说在选中了子节点或者父节点后会做一些处理后面可能会加上一个让父子关系分离的参数。如果checkable为false的话那么表示是基本的用法也就是说是select的模式这样的话父子节点本该就是分离的
      value.forEach((item)=>{//加入传进来的value里面包含中间的某一个父节点那么先把这个父节点的所有叶子节点都加进了统一处理
        if(_treeSelectConnect[item] && _treeSelectConnect[item].allLeafChildValues && _treeSelectConnect[item].allLeafChildValues.length > 0){
          _value = _value.concat(_treeSelectConnect[item].allLeafChildValues)
          _value.splice(_value.indexOf(item),1)
        }
      })
      _value = Array.from(new Set(_value))//去重
      _resultData = _value.slice(0)//_resultData表示最后要返回的数据
      Object.keys(_treeSelectConnect).forEach((prop)=>{//遍历传进来的树的数据根据value传进来的节点筛选出最后要显示在multipleInput上面的数据
        if(this.showCheckedStrategy !== TreeSelect.SHOW_CHILD){//如果是只显示叶子节点的模式那么走下面的分支
          if(_treeSelectConnect[prop].allLeafChildValues && _treeSelectConnect[prop].allLeafChildValues.length != 0){
            if(!this.notContainAllKey(_value,_treeSelectConnect[prop].allLeafChildValues)){//如果value里面包含了当前节点所有的叶子节点的话，表示要添加进来的元素是一个父节点，但是它可能也是别的元素的子节点这个我们下面做区分
              _tempResultArr = _resultData.slice(0)
              _resultData.forEach((item)=>{
                if(_treeSelectConnect[prop].allChildValues.indexOf(item) >= 0 && _treeSelectConnect[prop].allLeafChildValues.indexOf(item) < 0){//如果_resultData里面有当前节点的子节点，也即添加进来的节点是更高级的父节点
                  if(this.showCheckedStrategy === TreeSelect.SHOW_PARENT && _tempResultArr.indexOf(item) >= 0){
                    _tempResultArr.splice(_tempResultArr.indexOf(item),1)
                  }
                  if(_tempResultArr.indexOf(prop) < 0){
                    _tempResultArr.push(prop)
                  }
                }else if(_treeSelectConnect[prop].allLeafChildValues.indexOf(item) >= 0){//第一次添加进来叶子节点的父节点
                  if(_tempResultArr.indexOf(prop) < 0){
                    _tempResultArr.push(prop)
                  }
                }
              })
              if(this.showCheckedStrategy === TreeSelect.SHOW_PARENT){//如果传入的模式是只显示父元素的模式的话那么要把叶子元素删掉
                _tempResultArr = _tempResultArr.filter((filterKey)=>{
                  return _treeSelectConnect[prop].allLeafChildValues.indexOf(filterKey) < 0
                })
              }
              _resultData = _tempResultArr.slice(0)
            }
          }
        }
      })
    }else{
      _value = Array.from(new Set(_value))//去重
      _resultData = _value.slice(0)//_resultData表示最后要返回的数据
    }
    _valueKeysTreeInfo = this.getTreeInfoFromData(_resultData)
    _treeKeysFromValues = this.getTreeKeysFromData(_resultData)
    if(_maxTagCount && _valueKeysTreeInfo.length > parseInt(_maxTagCount)){
      _valueKeysTreeInfo = _valueKeysTreeInfo.slice(0,_maxTagCount)
      if(_maxTagPlaceholder){
        _valueKeysTreeInfo.push({
          value:'extraTagText',
          key:'extraTagText',
          title:_maxTagPlaceholder,
        })
      }
    }

    return {valueKeysArr:_resultData,valueKeysTreeInfo:_valueKeysTreeInfo,treeKeysFromValues:_treeKeysFromValues}
  }
  //如果sonArr里面有某一个元素不属于parentArr的话那么返回true
  notContainAllKey(parentArr,sonArr){
    return sonArr.some((item)=>{
      return parentArr.indexOf(item) < 0
    })
  }
  //如果parentArr包含sonArr里面的某一个元素的话那么返回true
  containSomeKey(parentArr,sonArr){
    return sonArr.some((item)=>{
      return parentArr.indexOf(item) >= 0
    })
  }
  //数据源是传入的treeData处理后的值，根据参数里面传入的value值来筛选出这些value值所代表的树节点的信息
  getTreeInfoFromData(filterValues){
    let _treeNodeInfoArr = [],_treeNodeInfoValues = this.treeNodeInfoValues
    filterValues.forEach((item)=>{
      _treeNodeInfoArr.push(_treeNodeInfoValues[item])
    })
    return _treeNodeInfoArr
  }
  //数据源是传入的treeData处理后的值，根据参数里面传入的value的值来筛选出这些value值所表示的树形节点的key值
  getTreeKeysFromData(filterValues){
    let _treeKeysFromValues = [],_treeNodeInfoValues = this.treeNodeInfoValues
    filterValues.forEach((item)=>{
      _treeKeysFromValues.push(_treeNodeInfoValues[item].key)
    })
    return _treeKeysFromValues
  }
  //数据源是传入的树形组件返回的keys值，从里面要筛选出来对应的value
  getValuesFromKeys(filterKeysOrValues,type){
    if(type === 'value'){
      return filterKeysOrValues
    }
    let _treeValuesFromKeys = [],_treeNodeInfoKeys = this.treeNodeInfoKeys
    filterKeysOrValues.forEach((item)=>{
      _treeValuesFromKeys.push(_treeNodeInfoKeys[item].value)
    })
    return _treeValuesFromKeys
  }
  //如果用户没有传入treeData的话那么需要从props.children里面去获取对应节点的value、key、title构造出一个类似treeData的数据结构
  getTreeConnectFromChild(){
    let _children = this.props.children,_stageObj = {},_this = this,_treeNodeInfoKeys = {},_treeNodeInfoValues = {},_valueName = this.state.valueName,_labelName = this.state.labelName
    function getTreeData(dataArr){
      dataArr.forEach((item)=>{
        if(item.props.children && isArray(item.props.children)){
          getTreeData(item.props.children)
          _stageObj[item.props[_valueName]] = _this.getLeafKeysValuesFromChild(item.props.children)
        }else{
          _stageObj[item.props[_valueName]] = {
            allChildKeys:[],
            allLeafChildKeys:[],
            allChildValues:[],
            allLeafChildValues:[],
          }
        }
        _treeNodeInfoValues[item.props[_valueName]] = {
          title: _this.getPropsNodeTitle(item.props[_labelName]),
          value:item.props[_valueName],
          key:item.key,
        }
        _treeNodeInfoKeys[item.key] = {
          title: _this.getPropsNodeTitle(item.props[_labelName]),
          value:item.props[_valueName],
          key:item.key,
        }
       
      })
    }
    getTreeData(_children)
    return {stageObj:_stageObj,treeNodeInfoKeys:_treeNodeInfoKeys,treeNodeInfoValues:_treeNodeInfoValues}
  }
  //用户如果自定义树形节点的话那么title会是一个react节点，此时就需要从reactNode里面获取具体的内容
  getPropsNodeTitle(reactNode){
    let _title = ''
    if(!reactNode.props){
      return reactNode
    }
    function realGetPropsNodeTitle(node){
      if(node.props){
        realGetPropsNodeTitle(node.props)
      }else{
        _title = node.children
      }
    }
    realGetPropsNodeTitle(reactNode)
    return _title
  }
  //根据传入的树形节点的数据把数据扁平化方便后面处理
  getTreeConnect(){
    let _treeData = this.props.treeData,_stageObj = {},_this = this,_treeNodeInfoKeys = {},_treeNodeInfoValues = {},_valueName = this.state.valueName,_labelName = this.state.labelName
    function getTreeData(dataArr){
      dataArr.forEach((item)=>{
        if(item.children && isArray(item.children)){
          getTreeData(item.children)
          _stageObj[item[_valueName]] = _this.getLeafKeysValues(item.children)
        }else{
          _stageObj[item[_valueName]] = {
            allChildKeys:[],
            allLeafChildKeys:[],
            allChildValues:[],
            allLeafChildValues:[],
          }
        }
        _treeNodeInfoValues[item[_valueName]] = {
          title:item[_labelName],
          value:item[_valueName],
          key:item.key,
        }
        _treeNodeInfoKeys[item.key] = {
          title:item[_labelName],
          value:item[_valueName],
          key:item.key,
        }
      })
    }
    getTreeData(_treeData)
    return {stageObj:_stageObj,treeNodeInfoKeys:_treeNodeInfoKeys,treeNodeInfoValues:_treeNodeInfoValues}
  }
  //第二层的递归加入当前的树节点有children的时候那么进行此次递归获取下面的所有的子节点和叶子节点
  getLeafKeysValues(childGroup){
    let _allChildKeys = [],_allLeafChildKeys = [],_allChildValues = [],_allLeafChildValues = [],_valueName = this.state.valueName
    function getRealChildKey(children){
      children.map((item)=>{
        if(item.children && isArray(item.children)){
          _allChildValues.push(item[_valueName])
          _allChildKeys.push(item.key)
          getRealChildKey(item.children)
        }else{
          _allChildKeys.push(item.key)
          _allLeafChildKeys.push(item.key)
          _allChildValues.push(item[_valueName])
          _allLeafChildValues.push(item[_valueName])
        }
      })
    }
    getRealChildKey(childGroup)
    return{
      allChildKeys:_allChildKeys,
      allLeafChildKeys:_allLeafChildKeys,
      allLeafChildValues:_allLeafChildValues,
      allChildValues:_allChildValues,
    }
  }
  //用户没有传入treeData的时候，第二层递归获取当前节点下面
  getLeafKeysValuesFromChild(childGroup){
    let _allChildKeys = [],_allLeafChildKeys = [],_allChildValues = [],_allLeafChildValues = [],_valueName = this.state.valueName
    function getRealChildKey(children){
      children.map((item)=>{
        if(item.props.children && isArray(item.props.children)){
          _allChildValues.push(item.props[_valueName])
          _allChildKeys.push(item.key)
          getRealChildKey(item.props.children)
        }else{
          _allChildKeys.push(item.key)
          _allLeafChildKeys.push(item.key)
          _allChildValues.push(item.props[_valueName])
          _allLeafChildValues.push(item.props[_valueName])
        }
      })
    }
    getRealChildKey(childGroup)
    return {
      allChildKeys:_allChildKeys,
      allLeafChildKeys:_allLeafChildKeys,
      allChildValues:_allChildValues,
      allLeafChildValues:_allLeafChildValues,
    }
  }
  renderTreeNodes(data){
    let _labelName = this.state.labelName
    return data.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item[_labelName]} key={item.key}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        )
      }
      return <Tree.TreeNode title={item[_labelName]} key={item.key}/>
    })
  }
  //接收变化后的keys并且根据props里面的一些参数决定这个值该怎么处理，尤其是value、defaultValue
  receiveKeysChange(keys,type){
    let _value = this.getValuesFromKeys(keys,type)
    let valueShowObj = this.getSelectedValue(_value)
    if(!this.props.value){//如果props里面传进来来了value那么表示这是一个受控的属性,需要用户自己去改变
      this.setState({valueKeysArr:valueShowObj.valueKeysArr,valueKeysTreeInfo:valueShowObj.valueKeysTreeInfo,treeKeysFromValues:valueShowObj.treeKeysFromValues})
    }
    if(this.props.onChange){
      if(this.props.multiple){
        this.props.onChange(valueShowObj.valueKeysArr)
      }else{
        this.props.onChange(valueShowObj.valueKeysArr[0])
      }
    }
    if(this.props.multiple){
      this.textInput.current.clearInput()
    }
    if(this.props.showSearch){//只有在搜索的条件下才会需要去清除，目前应该不需要区分是单选还是多选
      this.setState({inSearchMode:false,searchExpandedKeys:[],searchInputKey:Date.now(),realSearchKeys:[]},()=>{
        this.popOverContainer.current.manualFocus()
      })
    }
  }
  //如果触发了onCheck的话表示当前checkbox一定是显示的也即checkable一定是true
  onCheck(keys,nodeInfo){
    this.receiveKeysChange(keys,'key')
    if(this.props.onCheck){
      this.props.onCheck(keys,nodeInfo)
    } 
  }
  //树形节点展开的时候需要判断一下当前是否是搜索模式如果是则不向外面透传
  onExpand(keys,nodeInfo){
    let _inSearchMode = this.state.inSearchMode
    if(_inSearchMode){
      this.setState({searchExpandedKeys:keys})
    }else{
      if(this.props.onExpand){
        this.props.onExpand(keys,nodeInfo)
      }
    }
  }
  onSearch(searchValue){
    if(this.props.onSearch){
      this.props.onSearch(searchValue)
    }
    if(this.props.multiple){//如果是多选的话那么应该是吧
      if(this.props.treeData){//如果用户传进来了treeData来构建树的话
        this.renderTreeFromTreeData(searchValue)
      }else{
        this.renderTreeFromUserTree(searchValue)
      }
    }
  }
  //如果没有传入checkable或者说checkable是false的话那么onselect触发时是需要把选择的值反应到上面的输入框上面
  onSelect(keys,nodeInfo){
    if(!this.props.checkable){
      this.receiveKeysChange(keys,'key')
      // this.setState({})
    }
    if(this.props.onSelect){
      this.props.onSelect(keys,nodeInfo)
    }
    if(!this.props.checkable && !this.props.multiple){
      this.closePopover()
    }
  }
  //清空输入框里面的所有值
  clearValue(){ 
    if(!this.props.value){
      this.setState({valueKeysArr:[],valueKeysTreeInfo:[],treeKeysFromValues:[]})
    }
    if(this.props.multiple){
      if(this.props.onChange){
        this.props.onChange([])
      }
    }else{
      if(this.props.onChange){
        this.props.onChange('')
      }
    }
  }
  getValueFromProps(value){
    const _multiple = this.props.multiple,_value = value
    if(_multiple){
      if(_value && isArray(_value)){
        return _value
      }else if(_value && !isArray(_value)){
        return []
      }else if(!_value){
        return _value
      }
    }else{
      if(_value && isString(_value)){
        return [_value]
      }else if(_value && !isString(_value)){
        return []
      }else if(!_value){
        return _value
      }
    }
  }
  //判断当前节点和当前节点的子节点的value是否被包含在了searchValues里面
  treeContainSome(currentValue,searchValues){
    let _treeSelectConnect = this.treeSelectConnect
    if(searchValues.indexOf(currentValue) >= 0 || this.containSomeKey(searchValues,_treeSelectConnect[currentValue].allChildValues)){
      return true
    }
  }
  //单选框搜索根据value作为搜索键值来搜索
  singleSelectInputSearch(e){
    if(this.props.treeData){//如果用户传进来了treeData来构建树的话
      this.renderTreeFromTreeData(e.target.value)
    }else{
      this.renderTreeFromUserTree(e.target.value)
    }
  }
  //通过用户自己构建的一棵树来构建后面的搜索树
  renderTreeFromUserTree(searchStr){
    let _searchStr = searchStr,_searchValues = [],
      _searchConatinParentValues = [],
      _treeNodeInfoValues = this.treeNodeInfoValues,
      _children = this.props.children,
      _valueName = this.state.valueName,
      _copyChildren = [],
      _searchExpandedKeys = [],
      _realSearchKeys = [],
      _this = this
    Object.keys(_treeNodeInfoValues).forEach((prop)=>{
      if(prop.toString().indexOf(_searchStr) >= 0){
        _searchValues.push(prop)
        _searchConatinParentValues.push(prop)
      }
    })
    _children.forEach((item)=>{
      _copyChildren.push(React.cloneElement(item))
    })
    function delSearchFromTree(childrenArr){
      for(let i=0;i<childrenArr.length;i++){
        if(_this.treeContainSome(_copyChildren[i].props[_valueName],_searchValues)){
          _searchConatinParentValues.push(childrenArr[i].props[_valueName])
          if(childrenArr[i].props.children && childrenArr[i].props.children.length != 0){
            delSearchFromTree(childrenArr[i].props.children)
          }
        }else{
          childrenArr.splice(i,1)
          i = i - 1
        }
      }
    }
    delSearchFromTree(_copyChildren)
    _searchConatinParentValues = Array.from(new Set(_searchConatinParentValues))
    _searchExpandedKeys = this.getSearchExpandedKeysFromValues(_searchConatinParentValues)
    _realSearchKeys = this.getSearchExpandedKeysFromValues(_searchValues)
    this.setState({realSearchKeys:_realSearchKeys,searchChildren:_copyChildren,inSearchMode:true,searchExpandedKeys:_searchExpandedKeys})
  }
  //通过用户自己传进来的treeData来构建后面的搜索树
  renderTreeFromTreeData(searchStr){
    let _searchStr = searchStr,_searchValues = [],
      _searchConatinParentValues = [],
      _realSearchKeys = [],
      _valueName = this.state.valueName,
      _searchExpandedKeys = [],
      _treeNodeInfoValues = this.treeNodeInfoValues,
      _treeData = JSON.parse(JSON.stringify(this.props.treeData)),
      _this = this
    Object.keys(_treeNodeInfoValues).forEach((prop)=>{
      if(prop.toString().indexOf(_searchStr) >= 0){
        _searchValues.push(prop)
        _searchConatinParentValues.push(prop)
      }
    })
    function delSearchFromTree(children){
      for(let i = 0;i<children.length;i++){
        if(_this.treeContainSome(children[i][_valueName],_searchValues)){
          _searchConatinParentValues.push(children[i][_valueName])
          if(children[i].children && children[i].children.length != 0){
            delSearchFromTree(children[i].children)
          }
        }else{
          children.splice(i,1)
          i = i - 1
        }
      }
    }
    delSearchFromTree(_treeData)
    _searchConatinParentValues = Array.from(new Set(_searchConatinParentValues))
    _searchExpandedKeys = this.getSearchExpandedKeysFromValues(_searchConatinParentValues)
    _realSearchKeys = this.getSearchExpandedKeysFromValues(_searchValues)
    this.setState({realSearchKeys:_realSearchKeys,searchTreeData:_treeData,inSearchMode:true,searchExpandedKeys:_searchExpandedKeys})
  }
  //根据搜索匹配到的节点的value包括父节点是筛选出对应的keys
  getSearchExpandedKeysFromValues(valuesArr){
    let expandedKeys = [],_treeNodeInfoValues = this.treeNodeInfoValues
    valuesArr.forEach((item)=>{
      expandedKeys.push(_treeNodeInfoValues[item].key)
    })
    return expandedKeys
  }
  render() {
    const {searchChildren,realSearchKeys,searchExpandedKeys,searchInputKey,visible,allowClear,size,treeDefaultExpandAll,inSearchMode,searchTreeData,wrapSelected} = this.state
    const {treeData,dropdownClassName,stretchWidth,placeholder,disabled,multiple,style,checkable,treeExpandedKeys,children,showSearch,treeDefaultExpandedKeys} = this.props
   
    const value = this.getValueFromProps(this.props.value)
    const {valueKeysArr,valueKeysTreeInfo,treeKeysFromValues} = value ? this.getSelectedValue(value) : this.state
    const defaultValue = this.getValueFromProps(valueKeysArr)
    const selectedKeys = checkable ? [] : value ? this.getTreeKeysFromData(value) : defaultValue ? this.getTreeKeysFromData(valueKeysArr) : []
    //selectedkeys是父子节点没有关联的时候用的,如果有关联的话也就checkable为true的时候应该用的是checkedKeys
    //const TreeKeysObj = this.props.value ? { checkedKeys : checkable ? treeKeysFromValues : [],selectedKeys : checkable ? [] : selectedKeys} : { defaultCheckedKeys : checkable ? treeKeysFromValues : [],defaultSelectedKeys : checkable ? [] : selectedKeys}
    const TreeKeysObj = { checkedKeys : checkable ? treeKeysFromValues : [],selectedKeys : checkable ? [] : selectedKeys}
    const renderTree = ()=>{
      if(treeData){
        if(inSearchMode && searchTreeData.length === 0){
          return <div className="tree-not-found">暂无数据</div>
        }
      }else{
        if(!children || children.length === 0){
          return <div className="tree-not-found">暂无数据</div>
        }else if(inSearchMode && searchChildren.length === 0){
          return <div className="tree-not-found">暂无数据</div>
        }
      }
      return <Tree
        checkable={checkable || false}
        multiple={!checkable ? multiple || false : true}
        onCheck={this.onCheck.bind(this)}
        onExpand={this.onExpand.bind(this)}
        onSelect={this.onSelect.bind(this)}
        defaultExpandAll={treeDefaultExpandAll}
        defaultExpandedKeys={treeDefaultExpandedKeys}
        treeWrapClassName={dropdownClassName}
        realSearchKeys={realSearchKeys}
        expandedKeys={inSearchMode ? searchExpandedKeys : treeExpandedKeys}
        {...TreeKeysObj}
      >
        {inSearchMode 
          ? treeData ? this.renderTreeNodes(searchTreeData) : searchChildren 
          : treeData ? this.renderTreeNodes(treeData) : children}
      </Tree>
    }
    const getPopContent = ()=>{
      if(!checkable && !multiple && showSearch){
        return <div>
          <span className="tree-select-dropdown-search">
            <span className="tree-select-search__field__wrap">
              <input key={searchInputKey} ref={this.searchInput} type="text" className="tree-select-search__field" onChange={this.singleSelectInputSearch.bind(this)}  />
            </span>
          </span>
          {renderTree(treeData)}
        </div>
      }else{
        return renderTree(treeData)
      }
    }
    return (
      <div className="tree-select">
        <Popover 
          visible={visible}
          popupClassName= {stretchWidth ? 'tree-select-popover' : 'tree-select-popover tree-select-min-width'}
          onClickOutSide={this.closePopover.bind(this)}
          stretchWidth={stretchWidth}
          ref={this.popOverContainer}
          trigger="click" content={getPopContent()}>
          {multiple ? 
            <MultipleInput 
              closePopover={this.closePopover.bind(this)}
              disabled={disabled}
              onSearch={this.onSearch.bind(this)}
              placeholder={placeholder}
              size={size}
              handleSelectWrapEvent={this.handleSelectWrapEvent.bind(this)}
              delSelectedData={this.delSelectedData.bind(this,valueKeysArr)} 
              ref={this.textInput} 
              allowClear={allowClear}
              clearValue={this.clearValue.bind(this)}
              style={style}
              showSearch={showSearch}
              wrapSelected={wrapSelected} 
              value={valueKeysTreeInfo}/> : 
            <Input 
              wrapSelected={wrapSelected} 
              disabled={disabled}
              onSearch={this.onSearch.bind(this)}
              closePopover={this.closePopover.bind(this)}
              placeholder={placeholder}
              size={size}
              handleSelectWrapEvent={this.handleSelectWrapEvent.bind(this)}
              allowClear={allowClear}
              clearValue={this.clearValue.bind(this)}
              style={style}              
              value={valueKeysTreeInfo}
              ref={this.textInput}/> }
        </Popover>
      </div>
    )
  }
}
