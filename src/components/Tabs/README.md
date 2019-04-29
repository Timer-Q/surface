## Tabs 标签页

分隔内容上有关联但属于不同类别的数据集合。

### 基础用法

基础的、简洁的标签页。

:::demo Tabs 组件提供了选项卡功能，默认选中第一个标签页，你也可以通过 `activeKey` 属性来指定当前选中的标签页。通过 `closable` 控制是否可以关闭；`onEdit` 监听增加 / 删除 tab；`onTitleEdit`监听标题修改; `editable` 控制是否可以编辑

```js
constructor(props) {
  super(props)
  this.state = {
    activeKey: "3",
    panes: [
      { title: "tab 1", content: "blablabla1", key: "1" },
      { title: "tab 2", content: "blablabla2", key: "2" },
      { title: "tab 3tab 3tab 3tab 3tab 3tab 3tab 3tab 3", content: "blablabla3", key: "3", editable: true },
      { title: "tab 4", content: <input />, key: "4", closable: true },
    ]
  }
  this.nextPaneIndex = 0
}

handleChange(key) {
  this.setState({
    activeKey: key
  })
}

handleEdit(type, key) {
  const { panes } = this.state
  if (type === "remove" && key) {
    let filteredPanes
    filteredPanes = panes.filter(pane => pane.key !== key)
    this.setState({
      panes: [...filteredPanes],
      activeKey: filteredPanes[0].key
    })
  }
  if (type === "add") {
    panes.push({
      title: `new tab ${this.nextPaneIndex}`,
      content: `new tab ${this.nextPaneIndex} content`,
      key: `newTab${this.nextPaneIndex}`
    })
    this.setState({
      panes,
      activeKey: `newTab${this.nextPaneIndex}`
    })
    this.nextPaneIndex++
  }
}

handleTitleEdit(key, title) {
  const { panes } = this.state
  const newPanes = panes.map(pane => {
    if (pane.key === key) {
      pane.title = title
    }
    return pane
  })
  this.setState({
    panes: newPanes
  })
}

// destroyInactiveTabPane 加上这个属性 tab在切换的时候 隐藏的tab不渲染
render() {
  const { panes, activeKey } = this.state
  return (
    <Tabs
      onChange={this.handleChange.bind(this)}
      activeKey={activeKey}
      onEdit={this.handleEdit.bind(this)}
      onTitleEdit={this.handleTitleEdit.bind(this)}
      isAddTab={panes.length <= 20}
      editable={true}
      addButton={<Button link>这是自定义</Button>}>
      {panes.map(pane => (
        <Tabs.TabPane
          key={pane.key}
          tab={pane.title}
          editable={true}
          closable={true}>
          {pane.content}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
```

:::

### button 样式

基础的、简洁的标签页。

:::demo Tabs 组件提供了选项卡功能，默认选中第一个标签页，你也可以通过 `activeKey` 属性来指定当前选中的标签页。通过 `closable` 控制是否可以关闭；`onEdit` 监听增加 / 删除 tab；`onTitleEdit`监听标题修改; `editable` 控制是否可以编辑

```js
constructor(props) {
  super(props)
  this.state = {
    activeKey: "3",
    panes: [
      { title: "tab 1", content: "blablabla1", key: "1" },
      { title: "tab 2", content: "blablabla2", key: "2" },
      { title: "tab 3", content: "blablabla3", key: "3" },
      { title: "tab 4", content: <input />, key: "4", closable: false }
    ]
  }
  this.nextPaneIndex = 0
}

handleChange(key) {
  this.setState({
    activeKey: key
  })
}

handleEdit(type, key) {
  const { panes } = this.state
  // eslint-disable-next-line
  if (type === "remove" && key) {
    let filteredPanes
    filteredPanes = panes.filter(pane => pane.key !== key)
    this.setState({
      panes: [...filteredPanes]
    })
  }
  if (type === "add") {
    panes.push({
      title: `new tab ${this.nextPaneIndex}`,
      content: `new tab ${this.nextPaneIndex} content`,
      key: `newTab${this.nextPaneIndex}`
    })
    this.setState({
      panes,
      activeKey: `newTab${this.nextPaneIndex}`
    })
    this.nextPaneIndex++
  }
}

handleTitleEdit(key, title) {
  const { panes } = this.state
  const newPanes = panes.map(pane => {
    if (pane.key === key) {
      pane.title = title
    }
    return pane
  })
  this.setState({
    panes: newPanes
  })
}

// destroyInactiveTabPane 加上这个属性 tab在切换的时候 隐藏的tab不渲染
render() {
  const { panes, activeKey } = this.state
  return (
    <Tabs
      onChange={this.handleChange.bind(this)}
      closable
      affix
      activeKey={activeKey}
      onEdit={this.handleEdit.bind(this)}
      onTitleEdit={this.handleTitleEdit.bind(this)}
      isAddTab={panes.length <= 20}
      type="button">
      {panes.map(pane => (
        <Tabs.TabPane
          key={pane.key}
          tab={pane.title}
          closable={pane.closable}>
          {pane.content}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
```

:::

### Tabs Attributes

| 参数                   | 说明                                                | 类型            | 可选值 | 默认值 |
| ---------------------- | --------------------------------------------------- | --------------- | ------ | ------ |
| activeKey              | 激活的 tab 的 key                                   | string          | -      | —      |
| onEdit                 | 增加/删除 tab 回调                                  | function        | -      | -      |
| onTitleEdit            | 修改 title 回调                                     | function        | -      | -      |
| destroyInactiveTabPane | 未激活的组件是否销毁                                | boolean         | -      | false  |
| closable               | tab 是否可以关闭（可整体设置，也可以单个 tab 设置） | boolean         | —      | false  |
| isAddTab               | 是否显示增加按钮                                    | boolean         | —      | true   |
| addText                | 增加按钮的文本                                      | string          | —      | -      |
| editable               | tab 是否可以修改 title                              | boolean         | —      | true   |
| addButton              | 自定义增加按钮                                      | ReactNode       | —      | -      |
| className              | 自定义样式名                                        | string          | —      | -      |
| style                  | 自定义样式                                          | object          | —      | -      |
| contentClass           | 自定义内容区域样式名                                | string          | —      | -      |
| contentStyle           | 自定义样内容区域式                                  | object          | —      | -      |
| affix                  | 是否要吸顶                                          | boolean         | —      | -      |
| offsetTop              | 吸顶偏移量                                          | string / number | —      | -      |
| bounds                 | 吸顶偏差范围                                        | string / number | —      | -      |

### TabPane Attributed

| 参数     | 说明                  | 类型    | 可选值 | 默认值 |
| -------- | --------------------- | ------- | ------ | ------ |
| closable | 当前 tab 是否可以关闭 | boolean | -      | false  |
| editable | 当前 tab 是否可以编辑 | boolean | -      | tru    |
