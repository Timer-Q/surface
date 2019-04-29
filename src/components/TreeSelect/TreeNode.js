import React, { Component } from 'react'
import Tree from '../Tree'

const TreeNode = Tree.TreeNode
export default class TreeSelectNode extends Component {
  constructor(props){
    super(props)
  }
  
  render() {
    const props = this.props
    return (
      <TreeNode {...props}></TreeNode>
    )
  }
}
