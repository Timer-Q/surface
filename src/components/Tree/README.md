## Tree组件

用于树形选择。

###Tree 基础用法

:::demo 默认树形的选择是不展开的并且没有复选框，如有需要通过下面的defaultExpandAll来设置。treeNode的key值和title是必须的，否则会报错

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        key: '0-0',
        children: [{
            title: '0-0-0s',
            key: '0-0-0',
            children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
            ],
        }, {
            title: '0-0-1s',
            key: '0-0-1',
            children: [
            { title: '0-0-1-0s', key: '0-0-1-0' },
            { title: '0-0-1-1s', key: '0-0-1-1' },
            { title: '0-0-1-2s', key: '0-0-1-2' },
            ],
        }, {
            title: '0-0-2s',
            key: '0-0-2',
        }],
        }, {
        title: '0-1s',
        key: '0-1',
        children: [
            { title: '0-1-0-0s', key: '0-1-0-0' },
            { title: '0-1-0-1s', key: '0-1-0-1' },
            { title: '0-1-0-2s', key: '0-1-0-2' },
        ],
        }, {
        title: '0-2s',
        key: '0-2',
    }]
  }

}
renderTreeNodes(data){
    return data.map((item) => {
        if (item.children) {
        return (
            <Tree.TreeNode title={item.title} key={item.key}>
            {this.renderTreeNodes(item.children)}
            </Tree.TreeNode>
        );
        }
        return <Tree.TreeNode {...item} />;
    });
}
render() {

    return (
        <div>
            <Tree
            theme={true}>
                {this.renderTreeNodes(this.state.treeData)}
            </Tree>
        </div>
    )
}
```
:::

###Tree 设置defaultExpandAll，checkable、onCheck、onExpand、onSelect回调

:::demo 可以设置defaultExpandAll来设置默认展开的状态，checkable设置为true表示可以有复选框。另外onCheck、onExpand、onSelect分别为对应的回调

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        key: '0-0',
        children: [{
            title: '0-0-0s',
            key: '0-0-0',
            children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
            ],
        }, {
            title: '0-0-1s',
            key: '0-0-1',
            children: [
            { title: '0-0-1-0s', key: '0-0-1-0' },
            { title: '0-0-1-1s', key: '0-0-1-1' },
            { title: '0-0-1-2s', key: '0-0-1-2' },
            ],
        }, {
            title: '0-0-2s',
            key: '0-0-2',
        }],
        }, {
        title: '0-1s',
        key: '0-1',
        children: [
            { title: '0-1-0-0s', key: '0-1-0-0' },
            { title: '0-1-0-1s', key: '0-1-0-1' },
            { title: '0-1-0-2s', key: '0-1-0-2' },
        ],
        }, {
        title: '0-2s',
        key: '0-2',
    }],
    checkedKeys:['0-0'],
    defaultCheckedKeys:['0-1'],
    checkable:true,
    selectedKeys:['0-0-0-1']
  }

}
renderTreeNodes(data){
    return data.map((item) => {
        if (item.children) {
        return (
            <Tree.TreeNode title={item.title} key={item.key}>
            {this.renderTreeNodes(item.children)}
            </Tree.TreeNode>
        );
        }
        return <Tree.TreeNode {...item} />;
    });
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
render() {

    return (
        <div>
            <Tree
                defaultExpandAll
                checkable={this.state.checkable}
                checkedKeys={this.state.checkedKeys}
                onCheck={this.onCheck.bind(this)}
                onExpand={this.onExpand.bind(this)}
                onSelect={this.onSelect.bind(this)}
            >
                {this.renderTreeNodes(this.state.treeData)}
            </Tree>
        </div>
    )
}
```
:::


###Tree defaultExpandedKeys设置默认展开的项，并且根据defaultExpandParent决定是否需要自动展开父节点

:::demo defaultExpandedKeys设置默认展开的项，并且根据defaultExpandParent决定是否需要自动展开父节点。如果你有需要通过外部setState来改变defaultExpandedKeys的需求建议使用key值替换一个新的组件，或者提需求。

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        key: '0-0',
        children: [{
            title: '0-0-0s',
            key: '0-0-0',
            children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
            ],
        }, {
            title: '0-0-1s',
            key: '0-0-1',
            children: [
            { title: '0-0-1-0s', key: '0-0-1-0' },
            { title: '0-0-1-1s', key: '0-0-1-1' },
            { title: '0-0-1-2s', key: '0-0-1-2' },
            ],
        }, {
            title: '0-0-2s',
            key: '0-0-2',
        }],
        }, {
        title: '0-1s',
        key: '0-1',
        children: [
            { title: '0-1-0-0s', key: '0-1-0-0' },
            { title: '0-1-0-1s', key: '0-1-0-1' },
            { title: '0-1-0-2s', key: '0-1-0-2' },
        ],
        }, {
        title: '0-2s',
        key: '0-2',
    }],
    checkedKeys:['0-0-2','0-0-0','0-0-1'],
    defaultExpandedKeys:['0-0-2','0-0-0'],
    defaultCheckedKeys:['0-1'],
    checkable:true,
    selectedKeys:['0-0-0-1']
  }

}
renderTreeNodes(data){
    return data.map((item) => {
        if (item.children) {
        return (
            <Tree.TreeNode title={item.title} key={item.key}>
            {this.renderTreeNodes(item.children)}
            </Tree.TreeNode>
        );
        }
        return <Tree.TreeNode {...item} />;
    });
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
render() {

    return (
        <div>
            <Tree
                checkable={this.state.checkable}
                defaultExpandedKeys={this.state.defaultExpandedKeys}
                onCheck={this.onCheck.bind(this)}
                onExpand={this.onExpand.bind(this)}
                onSelect={this.onSelect.bind(this)}
            >
                {this.renderTreeNodes(this.state.treeData)}
            </Tree>
        </div>
    )
}
```
:::

###Tree defaultSelectedKeys设置默认选中的项目，并且根据multiple的值决定是否是多选

:::demo defaultSelectedKeys设置默认选中的项目，并且根据multiple的值决定是否是多选。并且提供selectedKeys这个受控的选项，意味着你可以直接在外部通过setState来改变selectedKeys但是在defaultSelectKeys和selectedKeys同时存在的时候defaultSelectedKeys会被忽略

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0ssss',
        key: '0-0',
        children: [{
            title: '0-0-0s',
            key: '0-0-0',
            children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
            ],
        }, {
            title: '0-0-1s',
            key: '0-0-1',
            children: [
            { title: '0-0-1-0s', key: '0-0-1-0' },
            { title: '0-0-1-1s', key: '0-0-1-1' },
            { title: '0-0-1-2s', key: '0-0-1-2' },
            ],
        }, {
            title: '0-0-2s',
            key: '0-0-2',
        }],
        }, {
        title: '0-1s',
        key: '0-1',
        children: [
            { title: '0-1-0-0s', key: '0-1-0-0' },
            { title: '0-1-0-1s', key: '0-1-0-1' },
            { title: '0-1-0-2s', key: '0-1-0-2' },
        ],
        }, {
        title: '0-2s',
        key: '0-2',
    }],
    checkedKeys:['0-0-2','0-0-0'],
    defaultExpandedKeys:['0-0-2','0-0-0'],
    defaultSelectedKeys:['0-0-2','0-0-0','0-0-0-1'],
    defaultCheckedKeys:['0-1'],
    checkable:true,
    selectedKeys:['0-0-0-1','0-0-0-2']
  }

}
renderTreeNodes(data){
    return data.map((item) => {
        if (item.children) {
        return (
            <Tree.TreeNode title={item.title} key={item.key}>
            {this.renderTreeNodes(item.children)}
            </Tree.TreeNode>
        );
        }
        return <Tree.TreeNode {...item} />;
    });
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
render() {

    return (
        <div>
            <Tree
                multiple={true}
                defaultExpandAll
                checkable={this.state.checkable}
                selectedKeys={this.state.selectedKeys}
                onCheck={this.onCheck.bind(this)}
                onExpand={this.onExpand.bind(this)}
                onSelect={this.onSelect.bind(this)}
            >
                {this.renderTreeNodes(this.state.treeData)}
            </Tree>
        </div>
    )
}
```
:::

###Tree checkedKeys设置复选框默认选中的样式

:::demo checkedKeys设置复选框默认选中的样式，这是一个受控的值，使用的时候首先需要把checkable设置为true，另外在onCheck的回调函数里面需要重新setState更新掉checkedKeys。selectedKeys同理

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        key: '0-0',
        children: [{
            title: '0-0-0s',
            key: '0-0-0',
            children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
            ],
        }, {
            title: '0-0-1s',
            key: '0-0-1',
            children: [
            { title: '0-0-1-0s', key: '0-0-1-0' },
            { title: '0-0-1-1s', key: '0-0-1-1' },
            { title: '0-0-1-2s', key: '0-0-1-2' },
            ],
        }, {
            title: '0-0-2s',
            key: '0-0-2',
        }],
        }, {
        title: '0-1s',
        key: '0-1',
        children: [
            { title: '0-1-0-0s', key: '0-1-0-0' },
            { title: '0-1-0-1s', key: '0-1-0-1' },
            { title: '0-1-0-2s', key: '0-1-0-2' },
        ],
        }, {
        title: '0-2s',
        key: '0-2',
    }],
    checkedKeys:['0-0-2','0-0-0','0-0-1'],
    defaultExpandedKeys:['0-0-2','0-0-0'],
    defaultSelectedKeys:['0-0-2','0-0-0','0-0-0-1'],
    defaultCheckedKeys:['0-1'],
    checkable:true,
    expandedKeys:['0-1'],
    selectedKeys:['0-0-0-1']
  }

}
renderTreeNodes(data){
    return data.map((item) => {
        if (item.children) {
        return (
            <Tree.TreeNode title={item.title} key={item.key}>
            {this.renderTreeNodes(item.children)}
            </Tree.TreeNode>
        );
        }
        return <Tree.TreeNode {...item}/>;
    });
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
    console.log(keys)
    console.log(obj)
    this.setState({expandedKeys:keys})
}
testClick(){
    this.setState({checkedKeys:['0-1']})
}
onSelect(selectedKeys,obj){
    console.log(selectedKeys,obj)
    this.setState({selectedKeys:selectedKeys})
}
render() {

    return (
        <div>
            <Tree
                checkable={this.state.checkable}
                checkedKeys={this.state.checkedKeys}
                onCheck={this.onCheck.bind(this)}
                onExpand={this.onExpand.bind(this)}
                onSelect={this.onSelect.bind(this)}
                expandedKeys={this.state.expandedKeys}
            >
                {this.renderTreeNodes(this.state.treeData)}
            </Tree>
        </div>
    )
}
```
:::


###Tree extraHtml用户自定义树形组件里面的显示内容

:::demo checkedKeys设置复选框默认选中的样式，这是一个受控的值，使用的时候首先需要把checkable设置为true，另外在onCheck的回调函数里面需要重新setState更新掉checkedKeys。selectedKeys同理

```js
constructor(props) {
  super(props);
  this.state = {
    treeData:[{
        title: '0-0s',
        key: '0-0',
        children: [{
            title: '0-0-0s',
            key: '0-0-0',
            children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
            ],
        }, {
            title: '0-0-1s',
            key: '0-0-1',
            children: [
            { title: '0-0-1-0s', key: '0-0-1-0' },
            { title: '0-0-1-1s', key: '0-0-1-1' },
            { title: '0-0-1-2s', key: '0-0-1-2' },
            ],
        }, {
            title: '0-0-2s',
            key: '0-0-2',
        }],
        }, {
        title: '0-1s',
        key: '0-1',
        children: [
            { title: '0-1-0-0s', key: '0-1-0-0' },
            { title: '0-1-0-1s', key: '0-1-0-1' },
            { title: '0-1-0-2s', key: '0-1-0-2' },
        ],
        }, {
        title: '0-2s',
        key: '0-2',
    }],
    checkedKeys:['0-0-2','0-0-0','0-0-1'],
    defaultExpandedKeys:['0-0-2','0-0-0'],
    defaultSelectedKeys:['0-0-2','0-0-0','0-0-0-1'],
    defaultCheckedKeys:['0-1'],
    checkable:true,
    selectedKeys:['0-0-0-1']
  }

}
renderTreeNodes(data){
    return data.map((item) => {
        let title = item.title
        if (item.children) {
            return (
                <Tree.TreeNode
                title={<div className="tree-extra-test" onClick={this.testdiv.bind(this,item)}>{title}</div>} key={item.key}>
                {this.renderTreeNodes(item.children)}
                </Tree.TreeNode>
            );
        }
        return <Tree.TreeNode title={<div className="tree-extra-test" onClick={this.testdiv.bind(this,item)}>{title}</div>} key={item.key}/>;
    });
}
testdiv(obj){//在这里可以看到item里面的数据
    console.log('test')
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
render() {

    return (
        <div>
            <Tree 
            defaultExpandAll
            >
                {this.renderTreeNodes(this.state.treeData)}
            </Tree>
        </div>
    )
}
```
:::



###组件属性

Tree

| 属性 / 方法    | 说明                                    | 类型     | 默认值                |
| :------------- | :-------------------------------------- | :------- | :---------------------------- |
| checkable   | 节点前添加Checkbox复选框(受控)                            | boolean   | false |
| defaultExpandAll   | 是否自动展开所有树节点                            | boolean   | false |
| defaultExpandedKeys   | 默认展开指定的树节点                            | string[]   | [] |
| defaultExpandParent   | 默认展开父节点(和defaultExpandedKeys搭配起来使用，不影响其他属性)                            | boolean   | true |
| defaultCheckedKeys   | 默认选中复选框的树节点	                            | string []   | [] |
| defaultSelectedKeys   | 默认选中的树节点	                            | string []   | [] |
| multiple   | 是否允许多选	                            | boolean   | false |
| disabled   | 将整个树禁用掉	                            | boolean   | false |
| onLoad   | 整个树加载完毕时触发	                            | function()   | - |
| onExpand   | 展开收起时触发                            | function(expandedKeys,{expanded:bool,node})   | - |
| onCheck   | 点击复选框的时候触发                            | function(checkedKeys,{checked:bool,node})   | - |
| onSelect   | 点击树节点的时候触发                           | function(selectedKeys,{selected:bool,node})   | - |
| selectedKeys   | (受控）设置选中的树节点                      | string[]   | - |
| checkedKeys   | (受控）选中复选框的树节点（注意：父子节点有关联，如果传入父节点key，则子节点自动选中；相应当子节点key都传入，父节点也自动选中。另外如果启用此选项那么在onCheck的回调函数里需要重新setState checkedKeys得知                      | string[]   | [] |
| expandedKeys   | (受控）设置展开的树节点                      | string[]   | - |
| className   | (受控）树形组件最外层的样式                    | string[]   | - |
| theme   | ui想要的样式                    | boolean   | false |






TreeNode

| 属性 / 方法    | 说明                                    | 类型     | 默认值                |
| :------------- | :-------------------------------------- | :------- | :---------------------------- |
| title   | 标题(可为字符串或者用户自定义html标签节点)                           | string   | '---' |
| key   |  被树的 (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys 属性所用。注意：整个树范围内的所有节点的 key 值不能重复！ | string   | 无(暂时内部不做计算，必传) |
| className   | (受控）树形组件里面节点的样式                    | string[]   | - |
| extraHtml   | 待舍弃                | string   | - |









