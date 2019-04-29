## Popover 弹出框

### 基础用法

:::demo `trigger`属性用于设置何时触发 Popover ，提供三种触发方式：`hover`, `click` 和 `focus`。

```js
render() {
  return (
    <div>
      <Popover
        popupClassName
        placement="top-start"
        title="标题"
        width="200"
        trigger="hover"
        popupStyle={{width: "100px"}}
        content="这是一段容,这是一段容,这是一段容,这是一段容。">
        <Button>hover 激活</Button>
      </Popover>
      &nbsp;&nbsp;
      <Popover
        popupClassName
        placement="bottom"
        title="标题"
        width="200"
        trigger="click"
        content={
            <span
              onClick={() => console.log('content click')}>
                "这是一段容,这是一段容,这是一段容,这是一段容。"
              </span>}
        >
        <Button>click 激活</Button>
      </Popover>
      &nbsp;&nbsp;
      <Popover
        popupClassName
        placement="right"
        title="标题"
        width="200"
        trigger="focus"
        // onVisibleChange={visible => console.log(visible)}
        content="这是一段容,这是一段容,这是一段容,这是一段容。">
        <Button>focus 激活</Button>
      </Popover>
    </div>
  )
}
```

:::

### 定位

:::demo placement

```js
render() {
  return (
    <div>
      <div id="popover-position" style={{width: "600px", margin: "0 auto"}}>
          <div style={{display: 'flex'}}>
            <Popover
              popupClassName
              placement="top-start"
              title="标题"
              width="200"
              trigger="click"
              onVisibleChange={visible => console.log(visible)}
              content="top-start">
              <Button style={{width: "200px"}}>click 激活 top-start</Button>
            </Popover>

            <Popover
              popupClassName
              placement="top"
              title="标题"
              width="200"
              trigger="click"
              onVisibleChange={visible => console.log(visible)}
              content="top">
              <Button style={{width: "200px"}}>click 激活 top</Button>
            </Popover>

            <Popover
              popupClassName
              placement="top-end"
              title="标题"
              width="200"
              trigger="click"
              onVisibleChange={visible => console.log(visible)}
              content="top-end">
              <Button style={{width: "200px"}}>click 激活 top-end</Button>
            </Popover>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Popover
              popupClassName
              placement="left-start"
              title="标题"
              width="200"
              trigger="click"
              onVisibleChange={visible => console.log(visible)}
              content="left-start">
              <Button style={{width: "200px"}}>click 激活 left-start</Button>
            </Popover>

            <Popover
              popupClassName
              placement="right-start"
              title="标题"
              width="200"
              trigger="click"
              onVisibleChange={visible => console.log(visible)}
              content="right-start">
              <Button style={{width: "200px"}}>click 激活 right-start</Button>
            </Popover>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Popover
              popupClassName
              placement="left"
              title="标题"
              width="200"
              trigger="click"
              onVisibleChange={visible => console.log(visible)}
              content="left">
              <Button style={{width: "200px"}}>click 激活 left</Button>
            </Popover>
            <Popover
              popupClassName
              placement="right"
              title="标题"
              width="200"
              trigger="click"
              onVisibleChange={visible => console.log(visible)}
              content="right">
              <Button style={{width: "200px"}}>click 激活 right</Button>
            </Popover>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Popover
              popupClassName
              placement="left-end"
              title="标题"
              width="200"
              trigger="click"
              onVisibleChange={visible => console.log(visible)}
              content="left-end">
              <Button style={{width: "200px"}}>click 激活 left-end</Button>
            </Popover>
            <Popover
              popupClassName
              placement="right-end"
              title="标题"
              width="200"
              trigger="click"
              onVisibleChange={visible => console.log(visible)}
              content="right-end">
              <Button style={{width: "200px"}}>click 激活 right-end</Button>
            </Popover>
          </div>

          <div style={{display: 'flex'}}>
          <Popover
            popupClassName
            placement="bottom-start"
            title="标题"
            width="200"
            trigger="click"
            onVisibleChange={visible => console.log(visible)}
            content="bottom-start">
            <Button style={{width: "200px"}}>click 激活 bottom-start</Button>
          </Popover>

          <Popover
            popupClassName
            placement="bottom"
            title="标题"
            width="200"
            trigger="click"
            onVisibleChange={visible => console.log(visible)}
            content="bottom">
             <Button style={{width: "200px"}}>click 激活 bottom</Button>
          </Popover>

          <Popover
            popupClassName
            placement="bottom-end"
            title="标题"
            width="200"
            trigger="click"
            onVisibleChange={visible => console.log(visible)}
            content="bottom-end">
            <Button style={{width: "200px"}}>click 激活 bottom-end</Button>
          </Popover>
          </div>
      </div>
    </div>
  )
}
```

:::

### 父元素滚动

:::demo 元素滚动的情况下，可以通过设置 `getPopupContainer`，将元素渲染到滚动元素内，通过给父元素设置 `postion: 'relative'`，让 `Popover` 相对于滚动元素定位。这样就可以实现滚动跟随

```js
render() {
  return (
    <div style={{height: "100px", overflow: 'auto'}}>
      <div id="popover-base" style={{height: '200px', position: 'relative'}}>
        <Popover popupClassName getPopupContainer={() => document.querySelector('#popover-base')} placement="bottom" title="标题" width="200" trigger="click" content="这是一段容,这是一段容,这是一段容,这是一段容。">
          <Button>click 激活</Button>
        </Popover>
      </div>
    </div>
  )
}
```

:::

### 嵌套信息

可以在 Popover 中嵌套多种类型信息，以下为嵌套表格的例子。

:::demo 利用分发取代`content`属性

```js
constructor(props){
  super(props);

  this.table = {
    columns: [
      {
        title: "日期",
        dataIndex: "date",
        width: 150
      },
      {
        title: "姓名",
        dataIndex: "name",
        width: 100
      },
      {
        title: "地址",
        dataIndex: "address",
        width: 300
      }
    ],
    data: [{
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }, {
      date: '2016-05-04',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1517 弄'
    }, {
      date: '2016-05-01',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1519 弄'
    }, {
      date: '2016-05-03',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1516 弄'
    }]
  }
}

render() {
  return (
    <Popover popupClassName placement="right" title="标题" width="400" trigger="click" content={(
      <Table dataSource={this.table.data} columns={this.table.columns} />
    )}>
      <Button>click 激活</Button>
    </Popover>
  )
}
```

:::

### 嵌套操作

当然，你还可以嵌套操作，这相比 Dialog 更为轻量：

:::demo

```js
constructor(props){
  super(props);

  this.state = {};
}

onDismiss() {
  this.setState({
    visible: false
  });
}

render() {
  return (
    <Popover
      popupClassName
      placement="top"
      trigger="click"
      visible={this.state.visible}
      content={(
        <div style={{width: "150px"}}>
          <Checkbox value="1" onChange={value => console.log(value)}>label1</Checkbox>
          <Checkbox value="2 " onChange={value => console.log(value)}>label2</Checkbox>
        </div>
      )}>
      <Button onClick={() => this.setState({visible: !this.state.visible})}>删除</Button>
    </Popover>
  )
}
```

:::

### Attributes

| 参数              | 说明                                   | 类型           | 可选值                                                                                                    | 默认值         |
| ----------------- | -------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------- | -------------- |
| trigger           | 触发方式                               | String         | click/focus/hover                                                                                         | click          |
| title             | 标题                                   | String         | —                                                                                                         | —              |
| content           | 显示的内容，也可以通过 `slot` 传入 DOM | String         | —                                                                                                         | —              |
| width             | 宽度                                   | String, Number | —                                                                                                         | 最小宽度 150px |
| placement(预留)   | 出现位置                               | String         | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom         |
| visible           | 状态是否可见                           | Boolean        | —                                                                                                         | false          |
| transition        | 定义渐变动画                           | String         | —                                                                                                         | fade-in-linear |
| visibleArrow      | 是否显示 Tooltip 箭头                  | Boolean        | —                                                                                                         | true           |
| popupClassName    | 弹出内容样式                           | Boolean/String | true/false/自定义样式名称                                                                                 | false          |
| stretchWidth      | 弹出内容的最小宽度是否与内容宽度一致   | Boolean/String | -                                                                                                         | false          |
| getPopupContainer | popup 渲染的位置                       | functioon      | -                                                                                                         | -              |
| onVisibleChange   | popup 显示/隐藏回调                    | functioon      | -                                                                                                         | -              |
