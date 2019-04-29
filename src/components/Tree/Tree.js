import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ClassName from 'classnames'
import TreeNode from './TreeNode'
import './style/tree.scss'
import Events from '../Events'
import { isArray } from 'util'

export default class Tree extends Component {
  static TreeNode = TreeNode
  static propTypes = {
    children: PropTypes.node,
    defaultExpandAll: PropTypes.bool,
    defaultExpandedKeys: PropTypes.array,
    defaultExpandParent: PropTypes.bool,
    defaultCheckedKeys: PropTypes.array,
    checkedKeys: PropTypes.array,
    disabled: PropTypes.bool,
    onLoad: PropTypes.func,
    onCheck: PropTypes.func,
    onExpand: PropTypes.func,
    checkable: PropTypes.bool,
    onSelect: PropTypes.func,
    multiple: PropTypes.bool,
    selectedKeys: PropTypes.array,
    defaultSelectedKeys: PropTypes.array,
    className: PropTypes.string,
    theme:PropTypes.bool,
    expandedKeys:PropTypes.array,
    realSearchKeys:PropTypes.array,
  }
  constructor(props){
    super(props)
    this.state = {
      defaultSelectedKeys:this.props.defaultSelectedKeys || [],
      treeDefaultSelectedKeys:this.props.defaultSelectedKeys || [],
      defaultExpandParent:this.props.defaultExpandParent === false ? this.props.defaultExpandParent : true,
      defaultExpandAll:this.props.defaultExpandAll || false,
      defaultExpandedKeys:this.props.defaultExpandedKeys || [],
      defaultCheckedKeys:this.props.defaultCheckedKeys || [],
      checkable:this.props.checkable  || false,
      disabled:this.props.disabled || false,
      treeCheckedKeys:[],
      treeExpendedKeys:[],
      //checkedKeys:this.props.checkedKeys || [],//由于checkedkeys是受控的参数，所以这个地方应该是多余的，这行代码
      multiple:this.props.multiple || false,
      theme:this.props.theme,
    }
    this.severEvent = new Events(),
    this.treeConnect = {},
    this.treeExpendedKeys = []
  }
  componentDidMount() {
    this.analyseCheckedOrigin()
    this.severEvent.on('treeCheckChange', this.treeCheckChange.bind(this))
    this.severEvent.on('onExpand', this.onExpand.bind(this))
    this.severEvent.on('onSelect', this.onSelect.bind(this))
  }
  //节点选中的时候触发此函数
  onSelect(currentKey, selectStatus, node) {
    if (this.props.selectedKeys) {
      this.dealSelecedKeys(currentKey, selectStatus, node)
    } else {
      let _treeDefaultSelectedKeys = this.state.treeDefaultSelectedKeys.slice(0)
      if (!this.props.onSelect) {
        return
      }
      if (!this.props.multiple) {
        //单选
        if (selectStatus) {
          //如果是选中的状态
          _treeDefaultSelectedKeys = [currentKey]
        } else {
          _treeDefaultSelectedKeys = []
        }
      } else {
        if (selectStatus) {
          _treeDefaultSelectedKeys.push(currentKey)
        } else {
          if (_treeDefaultSelectedKeys.indexOf(currentKey) >= 0) {
            _treeDefaultSelectedKeys.splice(
              _treeDefaultSelectedKeys.indexOf(currentKey),
              1
            )
          }
        }
      }
      this.setState({ treeDefaultSelectedKeys: _treeDefaultSelectedKeys })
      this.props.onSelect(_treeDefaultSelectedKeys, {
        selected: selectStatus,
        node: node,
      })
    }
  }
  dealSelecedKeys(currentKey,selectStatus,node){
    if(!this.props.onSelect){
      return
    }
    let _selectedKeys = this.props.selectedKeys.slice(0)
    if(!this.props.multiple){
      if(selectStatus){
        _selectedKeys = [currentKey]
      } else {
        _selectedKeys = []
      }
    } else {
      if (selectStatus) {
        _selectedKeys.push(currentKey)
      } else {
        if (_selectedKeys.indexOf(currentKey) >= 0) {
          _selectedKeys.splice(_selectedKeys.indexOf(currentKey), 1)
        }
      }
    }
    this.props.onSelect(_selectedKeys, { selected: selectStatus, node: node })
  }
  //节点展开的时候触发
  onExpand(currentKey, expandStatus, node) {
    let _treeExpendedKeys = [],expandedKeys = isArray(this.props.expandedKeys) ? this.props.expandedKeys.slice(0) : undefined
    if (!this.props.onExpand) {
      return
    }
    if(expandedKeys && expandedKeys.length > 0){
      _treeExpendedKeys = expandedKeys
    }else{//defaultExpandedKeys
      _treeExpendedKeys = this.state.treeExpendedKeys.slice(0)
    }
    if (expandStatus) {
      _treeExpendedKeys.push(currentKey)
    } else {
      if (_treeExpendedKeys.indexOf(currentKey) >= 0) {
        _treeExpendedKeys.splice(_treeExpendedKeys.indexOf(currentKey), 1)
      }
    }
    _treeExpendedKeys =  Array.from(new Set(_treeExpendedKeys))
    this.props.onExpand(_treeExpendedKeys, {
      expandStatus: expandStatus,
      node: node,
    })
  }
  //节点check状态改变时触发
  onCheck(checkedKeys, status, node) {
    if (!this.props.onCheck) {
      return
    }
    this.props.onCheck(checkedKeys, { checked: status, node: node })
  }
  treeCheckChange(parentKey, childKeys, status, currentKey, node) {
    let _parentKey = parentKey.split(','),
      _parentKeyReverse = parentKey.split(',').reverse(),
      _treeCheckedKeys= this.props.checkedKeys && isArray(this.props.checkedKeys) ? this.getRealCheckedKeysFromCheckedKeys(this.props.checkedKeys) : this.state.treeCheckedKeys,
      _treeConnect = this.treeConnect
    if (status) {
      if (childKeys.length === 0) {
        //叶子节点
        _treeCheckedKeys.push(currentKey)
      }
      childKeys.forEach(item => {
        if (_treeCheckedKeys.indexOf(item) < 0) {
          _treeCheckedKeys.push(item)
        }
      })
      _parentKeyReverse.forEach(item => {
        if (
          this.conatinALLEles(
            _treeCheckedKeys,
            _treeConnect[item].allLeafChildKeys
          )
        ) {
          _treeCheckedKeys.push(item)
        }
      })
    } else {
      if (_treeCheckedKeys.indexOf(currentKey) >= 0) {
        _treeCheckedKeys.splice(_treeCheckedKeys.indexOf(currentKey), 1)
      }
      _parentKey.forEach(item => {
        if (_treeCheckedKeys.indexOf(item) >= 0) {
          _treeCheckedKeys.splice(_treeCheckedKeys.indexOf(item), 1)
        }
      })
      childKeys.forEach(item => {
        if (_treeCheckedKeys.indexOf(item) >= 0) {
          _treeCheckedKeys.splice(_treeCheckedKeys.indexOf(item), 1)
        }
      })
    }
    if (this.props.onCheck) {
      this.onCheck(_treeCheckedKeys, status, node)
    }
    if(!this.props.checkedKeys || !isArray(this.props.checkedKeys)){
      this.setState({treeCheckedKeys:_treeCheckedKeys})
    }
  }
  //从props的checkedkeys获取真正选中的节点，比如父节点被默认选中了那么他的子节点也应该被选中。
  getRealCheckedKeysFromCheckedKeys(checkedKeys){
    let _checkedkeys = checkedKeys,_treeConnect = this.treeConnect,_treeCheckedKeys = []
    _checkedkeys.forEach((item)=>{
      if(_treeConnect[item]){
        if(_treeConnect[item].allLeafChildKeys && _treeConnect[item].allLeafChildKeys.length != 0){
          _treeCheckedKeys = _treeCheckedKeys.concat(_treeConnect[item].allLeafChildKeys)
        }else{
          _treeCheckedKeys.push(item)
        }
      }
    })
    _treeCheckedKeys = this.analyseIfParentShouldAdd(_treeCheckedKeys)
    _treeCheckedKeys =  Array.from(new Set(_treeCheckedKeys))
    return _treeCheckedKeys
  }
  analyseCheckedOrigin() {
    let _checkedkeys = isArray(this.props.checkedKeys) ? this.props.checkedKeys.slice(0) : undefined
    if(_checkedkeys && isArray(_checkedkeys)){
      if(this.props.onLoad){
        this.props.onLoad()
      }
    }else{
      this.getCheckedKeysByDefault()
    }
  }
  getCheckedKeysByDefault() {
    let _defaultCheckedKeys = this.props.defaultCheckedKeys
    if (
      !_defaultCheckedKeys ||
      !isArray(_defaultCheckedKeys) ||
      _defaultCheckedKeys.length === 0
    ) {
      return
    }
    let _treeCheckedKeys = [],_treeConnect = this.treeConnect
    _defaultCheckedKeys.forEach((item)=>{
      if(_treeConnect[item]){
        if(_treeConnect[item].allLeafChildKeys && _treeConnect[item].allLeafChildKeys.length != 0){
          _treeCheckedKeys = _treeCheckedKeys.concat(_treeConnect[item].allLeafChildKeys)
        }else{
          _treeCheckedKeys.push(item)
        }
      }
    })
    _treeCheckedKeys = this.analyseIfParentShouldAdd(_treeCheckedKeys)
    _treeCheckedKeys = Array.from(new Set(_treeCheckedKeys))
    this.setState({ treeCheckedKeys: _treeCheckedKeys }, () => {
      if (this.props.onLoad) {
        this.props.onLoad()
      }
    })
  }
  analyseIfParentShouldAdd(treeCheckedKeys) {
    let _treeConnect = this.treeConnect
    Object.keys(_treeConnect).forEach(item => {
      if (
        this.conatinALLEles(
          treeCheckedKeys,
          _treeConnect[item].allLeafChildKeys
        )
      ) {
        treeCheckedKeys.push(item)
      }
    })
    return treeCheckedKeys
  }
  conatinALLEles(parentArr, sonArr) {
    if (sonArr.length === 0) {
      return false
    }
    for (let i = 0; i < sonArr.length; i++) {
      if (parentArr.indexOf(sonArr[i]) < 0) {
        return false
      }
    }
    return true
  }
  ifArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }
  cloneNewReactComponent() {
    this.props.children.map(child => {
      return child
    })
  }
  render() {
    const { className } = this.props
    return (
      <ul className={ClassName('tree-ul',className)}>
        {this.props.children.map((child)=>{
          if(React.isValidElement(child)){
            return React.cloneElement(child,
              {
                currentKey:child.key,
                parentKey:child.key,
                severEvent:this.severEvent,
                treeConnect:this.treeConnect,
                defaultExpandParent:this.state.defaultExpandParent,
                defaultExpandAll:this.state.defaultExpandAll,
                defaultExpandedKeys:this.state.defaultExpandedKeys,
                defaultCheckedKeys:this.state.defaultCheckedKeys,
                theme:this.state.theme,
                defaultSelectedKeys:this.state.defaultSelectedKeys,
                checkedKeys:this.props.checkedKeys,
                selectedKeys:this.props.selectedKeys,
                disabled:this.state.disabled,
                treeExpendedKeys:this.treeExpendedKeys,
                expandedKeys:this.props.expandedKeys,
                checkable:this.state.checkable,
                realSearchKeys:this.props.realSearchKeys,
                multiple:this.state.multiple,
              }
            )
          }
        })}
      </ul>
    )
  }
}
