## TreeSelect组件

树形选择组件

### TreeSelect 单选基本

:::demo 用户通过传入数组来构建树形节点，推荐做法。其中里面的title、value、key必传。

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        value:'0-0',
        key: '0-0a',
        children: [{
            title: '0-0-0s',
            value:'0-0-0',
            key: '0-0-0a',
            children: [
            { title: '0-0-0-0',value:'0-0-0-0', key: '0-0-0-0a' },
            { title: '0-0-0-1',value: '0-0-0-1', key: '0-0-0-1a' },
            { title: '0-0-0-2',value: '0-0-0-2', key: '0-0-0-2a' },
            ],
        }, {
            title: '0-0-1s',
            value:'0-0-1',
            key: '0-0-1a',
            children: [
            { title: '0-0-1-0s',value: '0-0-1-0', key: '0-0-1-0a' },
            { title: '0-0-1-1s',value: '0-0-1-1', key: '0-0-1-1a' },
            { title: '0-0-1-2s',value: '0-0-1-2', key: '0-0-1-2a' },
            ],
        }, {
            title: '0-0-2s',
            value: '0-0-2',
            key: '0-0-2a',
        }],
        }, {
            title:'0-3s',
            value:'0-3',
            key:'0-3a',
            children:[{
                title: '0-1s',
                value: '0-1',
                key: '0-1a',
                children: [{
                    title:'0-1-1s',
                    value:'0-1-1',
                    key:'0-1-1a',
                    children:[
                        { title: '0-1-0-0s',value: '0-1-0-0', key: '0-1-0-0a' },
                        { title: '0-1-0-1s',value: '0-1-0-1', key: '0-1-0-1a' },
                        { title: '0-1-0-2s',value: '0-1-0-2', key: '0-1-0-2a' }
                    ]
                }]
            }]
        }, {
        title: '0-2s',
        value: '0-2',
        key: '0-2a',
    }],
    value:"0-1"
  }

}
onSelect(selectedKeys,obj){
    this.setState({selectedKeys:selectedKeys})
}
onChange(keys){
    console.log(keys)
   this.setState({value:keys})
}
testClick(){
    console.log('test')
}

render() {
    
    return (
        <div>
            <TreeSelect 
            allowClear={true}
            treeData = {this.state.treeData}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
            allowClear={true}
            disabled={false}
            stretchWidth={true}
            placeholder="请选择测试"
            style={{width: 300}}
            multiple={false}>
            </TreeSelect>
        </div>
    )
}
```
:::

### TreeSelect 单选模式、用户自定义树形节点

:::demo 用户自己来构建下面的树形节点，可以写样式来修饰里面的内容，绑定额外事件等。其次title、key、value必须存在

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        value:'0-0',
        key: '0-0a',
        children: [{
            title: '0-0-0s',
            value:'0-0-0',
            key: '0-0-0a',
            children: [
            { title: '0-0-0-0',value:'0-0-0-0', key: '0-0-0-0a' },
            { title: '0-0-0-1',value: '0-0-0-1', key: '0-0-0-1a' },
            { title: '0-0-0-2',value: '0-0-0-2', key: '0-0-0-2a' },
            ],
        }, {
            title: '0-0-1s',
            value:'0-0-1',
            key: '0-0-1a',
            children: [
            { title: '0-0-1-0s',value: '0-0-1-0', key: '0-0-1-0a' },
            { title: '0-0-1-1s',value: '0-0-1-1', key: '0-0-1-1a' },
            { title: '0-0-1-2s',value: '0-0-1-2', key: '0-0-1-2a' },
            ],
        }, {
            title: '0-0-2s',
            value: '0-0-2',
            key: '0-0-2a',
        }],
        }, {
            title:'0-3s',
            value:'0-3',
            key:'0-3a',
            children:[{
                title: '0-1s',
                value: '0-1',
                key: '0-1a',
                children: [{
                    title:'0-1-1s',
                    value:'0-1-1',
                    key:'0-1-1a',
                    children:[
                        { title: '0-1-0-0s',value: '0-1-0-0', key: '0-1-0-0a' },
                        { title: '0-1-0-1s',value: '0-1-0-1', key: '0-1-0-1a' },
                        { title: '0-1-0-2s',value: '0-1-0-2', key: '0-1-0-2a' }
                    ]
                }]
            }]
        }, {
        title: '0-2s',
        value: '0-2',
        key: '0-2a',
    }],
    value:"0-2"
  }

}
onSelect(selectedKeys,obj){
    this.setState({selectedKeys:selectedKeys})
}
onChange(keys){
   this.setState({value:keys})
}
testClick(){
    console.log('test')
}
renderTreeNodes(data){
    return data.map((item,index) => {
        let title = item.title
        if (item.children) {
            return (
                <TreeSelect.TreeNode
                title={<div style={{color:'red'}} onClick={this.testClick.bind(this,item)}><span>{title}</span></div>} key={item.key} value={item.value}>
                {this.renderTreeNodes(item.children)}
                </TreeSelect.TreeNode>
            );
        }
        return <TreeSelect.TreeNode value={item.value} title={title} key={item.key}/>;
    });
}
render() {
    
    return (
        <div>
            <TreeSelect 
            allowClear={true}
            //treeData = {this.state.treeData}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
            allowClear={true}
            disabled={false}
            stretchWidth={true}
            placeholder="请选择测试"
            style={{width: 300}}
            multiple={false}>
                {this.renderTreeNodes(this.state.treeData)}
            </TreeSelect>
        </div>
    )
}
```
:::

### TreeSelect 单选搜索、用户自定义树形节点

:::demo 用户自己来构建下面的树形节点，可以写样式来修饰里面的内容，绑定额外事件等。其次title、key、value必须存在。此外在设置了showSearch为true后可以搜索树形节点里面的内容

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        value:'0-0',
        key: '0-0a',
        children: [{
            title: '0-0-0s',
            value:'0-0-0',
            key: '0-0-0a',
            children: [
            { title: '0-0-0-0',value:'0-0-0-0', key: '0-0-0-0a' },
            { title: '0-0-0-1',value: '0-0-0-1', key: '0-0-0-1a' },
            { title: '0-0-0-2',value: '0-0-0-2', key: '0-0-0-2a' },
            ],
        }, {
            title: '0-0-1s',
            value:'0-0-1',
            key: '0-0-1a',
            children: [
            { title: '0-0-1-0s',value: '0-0-1-0', key: '0-0-1-0a' },
            { title: '0-0-1-1s',value: '0-0-1-1', key: '0-0-1-1a' },
            { title: '0-0-1-2s',value: '0-0-1-2', key: '0-0-1-2a' },
            ],
        }, {
            title: '0-0-2s',
            value: '0-0-2',
            key: '0-0-2a',
        }],
        }, {
            title:'0-3s',
            value:'0-3',
            key:'0-3a',
            children:[{
                title: '0-1s',
                value: '0-1',
                key: '0-1a',
                children: [{
                    title:'0-1-1s',
                    value:'0-1-1',
                    key:'0-1-1a',
                    children:[
                        { title: '0-1-0-0s',value: '0-1-0-0', key: '0-1-0-0a' },
                        { title: '0-1-0-1s',value: '0-1-0-1', key: '0-1-0-1a' },
                        { title: '0-1-0-2s',value: '0-1-0-2', key: '0-1-0-2a' }
                    ]
                }]
            }]
        }, {
        title: '0-2s',
        value: '0-2',
        key: '0-2a',
    }],
    value:"0-2"
  }

}
onSelect(selectedKeys,obj){
    this.setState({selectedKeys:selectedKeys})
}
onChange(keys){
   this.setState({value:keys})
}
testClick(){
    console.log('test')
}
renderTreeNodes(data){
    return data.map((item,index) => {
        let title = item.title
        if (item.children) {
            return (
                <TreeSelect.TreeNode
                title={<div style={{color:'red'}} onClick={this.testClick.bind(this,item)}><span>{title}</span></div>} key={item.key} value={item.value}>
                {this.renderTreeNodes(item.children)}
                </TreeSelect.TreeNode>
            );
        }
        return <TreeSelect.TreeNode value={item.value} title={title} key={item.key}/>;
    });
}
render() {
    
    return (
        <div>
            <TreeSelect 
            allowClear={true}
            //treeData = {this.state.treeData}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
            allowClear={true}
            disabled={false}
            showSearch={true}
            stretchWidth={true}
            placeholder="请选择测试"
            style={{width: 300}}
            multiple={false}>
                {this.renderTreeNodes(this.state.treeData)}
            </TreeSelect>
        </div>
    )
}
```
:::

### TreeSelect 多选基本用法

:::demo multiple为true的时候表示多选的模式，在不显示checkable的情况下。是由点击title这个动作来触发的，此时下面的树形节点和子节点直接是没有关联的，也即选择了哪个节点就同步的在上面的input和tree里面显示那个节点

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        value:'0-0',
        key: '0-0a',
        children: [{
            title: '0-0-0s',
            value:'0-0-0',
            key: '0-0-0a',
            children: [
            { title: '0-0-0-0',value:'0-0-0-0', key: '0-0-0-0a' },
            { title: '0-0-0-1',value: '0-0-0-1', key: '0-0-0-1a' },
            { title: '0-0-0-2',value: '0-0-0-2', key: '0-0-0-2a' },
            ],
        }, {
            title: '0-0-1s',
            value:'0-0-1',
            key: '0-0-1a',
            children: [
            { title: '0-0-1-0s',value: '0-0-1-0', key: '0-0-1-0a' },
            { title: '0-0-1-1s',value: '0-0-1-1', key: '0-0-1-1a' },
            { title: '0-0-1-2s',value: '0-0-1-2', key: '0-0-1-2a' },
            ],
        }, {
            title: '0-0-2s',
            value: '0-0-2',
            key: '0-0-2a',
        }],
        }, {
            title:'0-3s',
            value:'0-3',
            key:'0-3a',
            children:[{
                title: '0-1s',
                value: '0-1',
                key: '0-1a',
                children: [{
                    title:'0-1-1s',
                    value:'0-1-1',
                    key:'0-1-1a',
                    children:[
                        { title: '0-1-0-0s',value: '0-1-0-0', key: '0-1-0-0a' },
                        { title: '0-1-0-1s',value: '0-1-0-1', key: '0-1-0-1a' },
                        { title: '0-1-0-2s',value: '0-1-0-2', key: '0-1-0-2a' }
                    ]
                }]
            }]
        }, {
        title: '0-2s',
        value: '0-2',
        key: '0-2a',
    }],
    checkedKeys:['0-0-2','0-0-0','0-0-1'],
    defaultExpandedKeys:['0-0-2','0-0-0'],
    defaultSelectedKeys:['0-0-2','0-0-0','0-0-0-1'],
    defaultCheckedKeys:['0-1'],
    checkable:false,
    disabled:true,
    selectedKeys:['0-0-0-1'],
    value:["0-2","0-0-2","0-0-1"]
  }

}
onLoad(){
    console.log(true)
}
onCheck(keys,obj){
    this.setState({checkedKeys:keys})
    console.log(keys)
    console.log(obj)
}
onExpand(keys,obj){
    console.log(arguments)
    console.log(keys)
    console.log(obj)
}
onSelect(selectedKeys,obj){
    console.log(selectedKeys,obj)
    this.setState({selectedKeys:selectedKeys})
}
onChange(keys){
    console.log(keys)
    this.setState({value:keys})
}
componentDidMount(){
    
}
render() {

    return (
        <div>
            <TreeSelect 
            allowClear={true}
            treeData = {this.state.treeData}
            defaultValue={this.state.value}
            onChange={this.onChange.bind(this)}
            treeDefaultExpandedKeys={["0-2a","0-0-2a","0-0-1a"]}
            stretchWidth={true}
            size="small"
            placeholder="请选择测试"
            style={{width: 300}}
            multiple={true}>
            </TreeSelect>
        </div>
    )
}
```
:::

### TreeSelect 使用勾选框实现多选功能

:::demo 默认由用户自己传入treeData这样组件会自己渲染出一颗树形选择树，treeData里面的字段如下所示，其中title表示最后要显示在输入框和树形组件里面要显示的东西，value作为筛选条件来使用，key作为树形节点的唯一值来使用建议和value保持一致。推荐使用treeData来渲染树形选择。

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        value:'0-0',
        key: '0-0a',
        children: [{
            title: '0-0-0s',
            value:'0-0-0',
            key: '0-0-0a',
            children: [
            { title: '0-0-0-0',value:'0-0-0-0', key: '0-0-0-0a' },
            { title: '0-0-0-1',value: '0-0-0-1', key: '0-0-0-1a' },
            { title: '0-0-0-2',value: '0-0-0-2', key: '0-0-0-2a' },
            ],
        }, {
            title: '0-0-1s',
            value:'0-0-12',
            key: '0-0-1a',
            children: [
            { title: '0-0-1-0s',value: '0-0-1-0', key: '0-0-1-0a' },
            { title: '0-0-1-1s',value: '0-0-1-1', key: '0-0-1-1a' },
            { title: '0-0-1-2s',value: '0-0-1-2', key: '0-0-1-2a' },
            ],
        }, {
            title: '0-0-2s',
            value: '0-0-2',
            key: '0-0-2a',
        }],
        }, {
            title:'0-3s',
            value:'0-3',
            key:'0-3a',
            children:[{
                title: '0-1s',
                value: '0-1',
                key: '0-1a',
                children: [{
                    title:'0-1-1s',
                    value:'0-1-1',
                    key:'0-1-1a',
                    children:[
                        { title: '0-1-0-0s',value: '0-1-0-0', key: '0-1-0-0a' },
                        { title: '0-1-0-1s',value: '0-1-0-1', key: '0-1-0-1a' },
                        { title: '0-1-0-2s',value: '0-1-0-2', key: '0-1-0-2a' }
                    ]
                }]
            }]
        }, {
        title: '0-2s',
        value: '0-2',
        key: '0-2a',
    }],
    checkedKeys:['0-0-2','0-0-0','0-0-1'],
    defaultExpandedKeys:['0-0-2','0-0-0'],
    defaultSelectedKeys:['0-0-2','0-0-0','0-0-0-1'],
    defaultCheckedKeys:['0-1'],
    checkable:true,
    disabled:true,
    treeExpandedKeys:['0-0-0a'],
    selectedKeys:['0-0-0-1'],
    value:["0-2","0-0-2","0-0-12", "0-0-0-0"]
  }

}

testdiv(obj){//在这里可以看到item里面的数据
    console.log(obj)
}
onLoad(){
    console.log(true)
}
onCheck(keys,obj){
    this.setState({checkedKeys:keys})
    console.log(keys)
}
onExpand(keys,obj){
    console.log(keys)
}
testClick(){
    this.setState({checkedKeys:['0-1']})
}
onSelect(selectedKeys,obj){
    console.log(selectedKeys,obj)
    this.setState({selectedKeys:selectedKeys})
}
onChange(keys){
    console.log(keys)
    this.setState({value:keys})
}

render() {
    return (
        <div>
            <TreeSelect 
            allowClear={true}
            treeData = {this.state.treeData}
            defaultValue={this.state.value}
            onExpand={this.onExpand.bind(this)}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            onChange={this.onChange.bind(this)}
            allowClear={true}
            showSearch={true}
            // treeDefaultExpandedKeys={this.state.value}
            stretchWidth={true}
            size="small"
            checkable={this.state.checkable}
            placeholder="请选择测试"
            style={{width: 300}}
            multiple={true}>
            </TreeSelect>
        </div>
    )
}
```
:::


### TreeSelect 用户自己构建treeNode

:::demo 如果业务方有特殊需求，比如树形节点的title标红或者自己传入一个dom节点那么可以自己构建树形节点如下

```js


constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        value:'0-0',
        key: '0-0a',
        children: [{
            title: '0-0-0s',
            value:'0-0-0',
            key: '0-0-0a',
            children: [
            { title: '0-0-0-0',value:'0-0-0-0', key: '0-0-0-0a' },
            { title: '0-0-0-1',value: '0-0-0-1', key: '0-0-0-1a' },
            { title: '0-0-0-2',value: '0-0-0-2', key: '0-0-0-2a' },
            ],
        }, {
            title: '0-0-1s',
            value:'0-0-1',
            key: '0-0-1a',
            children: [
            { title: '0-0-1-0s',value: '0-0-1-0', key: '0-0-1-0a' },
            { title: '0-0-1-1s',value: '0-0-1-1', key: '0-0-1-1a' },
            { title: '0-0-1-2s',value: '0-0-1-2', key: '0-0-1-2a' },
            ],
        }, {
            title: '0-0-2s',
            value: '0-0-2',
            key: '0-0-2a',
        }],
        }, {
            title:'0-3s',
            value:'0-3',
            key:'0-3a',
            children:[{
                title: '0-1s',
                value: '0-1',
                key: '0-1a',
                children: [{
                    title:'0-1-1s',
                    value:'0-1-1',
                    key:'0-1-1a',
                    children:[
                        { title: '0-1-0-0s',value: '0-1-0-0', key: '0-1-0-0a' },
                        { title: '0-1-0-1s',value: '0-1-0-1', key: '0-1-0-1a' },
                        { title: '0-1-0-2s',value: '0-1-0-2', key: '0-1-0-2a' }
                    ]
                }]
            }]
        }, {
        title: '0-2s',
        value: '0-2',
        key: '0-2a',
    }],
    checkedKeys:['0-0-2','0-0-0','0-0-1'],
    defaultExpandedKeys:['0-0-2','0-0-0'],
    defaultSelectedKeys:['0-0-2','0-0-0','0-0-0-1'],
    defaultCheckedKeys:['0-1'],
    checkable:true,
    disabled:true,
    selectedKeys:['0-0-0-1'],
    value:["0-2","0-0-2","0-0-1", "0-0-0-0", "0-0-0-1", "0-0-0-2", "0-0-1-0","0-0-1-1", "0-0-1-2", "0-1-0-0", "0-1-0-1", "0-1-0-2","0-0"]
  }

}

testdiv(obj){//在这里可以看到item里面的数据
    console.log(obj)
}
onLoad(){
    console.log(true)
}
onCheck(keys,obj){
    this.setState({checkedKeys:keys})
    console.log(keys)
    console.log(obj)
}
onExpand(keys,obj){
    console.log(arguments)
    console.log(keys)
    console.log(obj)
}
testClick(){
    this.setState({checkedKeys:['0-1']})
}
onSelect(selectedKeys,obj){
    console.log(selectedKeys,obj)
    this.setState({selectedKeys:selectedKeys})
}
onChange(keys){
    console.log(keys)
    this.setState({value:keys})
}
componentDidMount(){
    
}
testdiv(obj){
    console.log(obj)
}
renderTreeNodes(data){
    return data.map((item,index) => {
        let title = item.title
        if (item.children) {
            return (
                <TreeSelect.TreeNode
                title={<div style={{color:'red'}} onClick={this.testdiv.bind(this,item)}><span>{title}</span></div>} key={item.key} value={item.value}>
                {this.renderTreeNodes(item.children)}
                </TreeSelect.TreeNode>
            );
        }
        return <TreeSelect.TreeNode value={item.value} title={title} key={item.key}/>;
    });
}

render() {

    return (
        <div>
            <TreeSelect 
            allowClear={true}
            //treeData = {this.state.treeData}
            value={this.state.value}
            checkable={this.state.checkable}
            onExpand={this.onExpand.bind(this)}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            onChange={this.onChange.bind(this)}
            allowClear={true}
            treeDefaultExpandedKeys={this.state.value}
            stretchWidth={true}
            treeCheckStrictly={true}
            size="small"
            placeholder="请选择"
            style={{width: 300}}
            multiple={true}>
                {this.renderTreeNodes(this.state.treeData)}
            </TreeSelect>
        </div>
    )
}
```
:::




###组件属性

Tree props

| 属性 / 方法    | 说明                                    | 类型     | 默认值                |
| :------------- | :-------------------------------------- | :------- | :---------------------------- |
| checkable   | 节点前添加Checkbox复选框(受控)                            | boolean   | false |
| multiple   | 支持多选（当设置 checkable 时自动变为true）             | boolean   | false |
| value   | 指定当前选中的条目(受控)                            | string/string[]   | - |
| defaultValue   | 指定默认选中的条目                          | string/string[]   | - |
| showCheckedStrategy  | 定义选中项回填的方式。TreeSelect.SHOW_ALL: 显示所有选中节点(包括父节点). TreeSelect.SHOW_PARENT: 只显示父节点(当父节点下所有子节点都选中时). 默认只显示子节点.                          | enum{TreeSelect.SHOW_ALL, TreeSelect.SHOW_PARENT, TreeSelect.SHOW_CHILD }   | TreeSelect.SHOW_CHILD |
| disabled   | 是否禁用                          | boolean   | false |
| allowClear   | 在有值时是否显示清除按钮                          | boolean   | false |
| dropdownClassName   | 下拉菜单的 className 属性                          | string   | - |
| stretchWidth   | 下拉菜单和选择器同宽。默认将设置 min-width。    | boolean   | true |
| filterTreeNode   | (保留)是否根据输入项进行筛选，默认用 treeNodeFilterProp 的值作为要筛选的 TreeNode 的属性值。    | boolean|Function(inputValue: string, treeNode: TreeNode) (函数需要返回bool值)   | Function |
| getPopupContainer   | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位    | Function(triggerNode)	   | () => document.body |
| maxTagCount   | 最多显示多少个 tag	| number	   | - |
| maxTagPlaceholder	   | 隐藏 tag 时显示的内容	| string	   | - |
| size	   | 选择框大小，可选 large small	| string	   | 'default' |
| treeData	   | treeNodes 数据，如果设置则不需要手动构造 TreeNode 节点（value 在整个树范围内唯一）	| array	   | [] |
| treeDefaultExpandAll	   | 默认展开所有树节点		| boolean	   | false |
| treeDefaultExpandedKeys	   | 默认展开的树节点(根据key值来做筛选)		| string[]	   | - |
| treeExpandedKeys		   | 设置展开的树节点(根据key值来做筛选,受控属性)		| string[]	   | - |
| treeNodeFilterProp		   | 输入项过滤对应的 treeNode 属性		  | string	 | 'value' |
| treeNodeLabelProp		   | 作为显示的 prop 设置		  | string	 | 'title' |
| treeCheckStrictly（预留）			   | checkable 状态下节点选择完全受控（父子节点选中状态不再关联）| string	 | false |
| showSearch     | 设置是否可以搜索 | boolean	 | false |
| onSearch		   | 文本框值变化时回调	      | function(value: string)   | - |
| onChange	   | 选中或删除值的时候调用此函数      | function(value, label, extra)   | - |
| onCheck	   | 点击复选框的时候触发      | function(checkedKeys,{checked:bool,node})   | - |
| onSelect	   | 选择树节点的时候触发      | function(selectedKeys,{selected:bool,node})   | - |
| onExpand   | 展开收起时触发                            | function(expandedKeys,{expanded:bool,node})   | - |

TreeNode props

| 属性 / 方法    | 说明                                    | 类型     | 默认值                |
| :------------- | :-------------------------------------- | :------- | :---------------------------- |
| title   | 标题(可以是文档也可以是自己构建的html标签)                            | string   | '---' |
| key   |  被树的treeDefaultExpandedKeys / treeExpandedKeys属性所用。注意：整个树范围内的所有节点的 key 值不能重复！ | string   | 无(暂时内部不做计算，必传) |
| value   | 整个·树形节点里面唯一存在，此值作为筛选搜索的键值存在（必传） | string   | -- |