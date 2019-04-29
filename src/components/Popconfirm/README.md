## Popconfirm 气泡确认框

点击元素，弹出气泡式的确认框。

### 基础用法

:::demo 目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。

和 `modal` 弹出的全屏居中模态对话框相比，交互形式更轻量。

```js

handleOk() {
  console.log('ok')
}

handleCancel() {
  console.log('cancle')
}

render() {
  return (
    <React.Fragment>
      <Popconfirm
        title="Mikasa Ackerman"
        content="Eren Jaeger，Ymir，Historia，Annie"
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        okProps="Armin Arlert"
        cancelProps="Rival Ackerman">
        <Button ghost size="small">click</Button>
      </Popconfirm>
      <br />
      <br />
      <Popconfirm
        title="Mikasa Ackerman"
        content="Eren Jaeger，Ymir，Historia，Annie"
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        okProps={{ text: 'Armin Arlert', ghost: false }}
        cancelProps="Rival Ackerman"
        type="error">
        <Button size="small">戳~</Button>
      </Popconfirm>
    </React.Fragment>
  )
}
```

:::

### Attributes

| 参数            | 说明                            | 类型          | 可选值                           | 默认值  |
| --------------- | ------------------------------- | ------------- | -------------------------------- | ------- |
| title           | popconfirm 标题                 | React.node    | —                                | -       |
| content         | popconfirm 内容                 | React.node    | —                                | -       |
| style           | popconfirm 样式                 | object        | —                                | -       |
| className       | popconfirm 样式名               | string        | —                                | -       |
| onOk            | popconfirm 确认回调             | function      | —                                | -       |
| onCancel        | popconfirm 取消回调             | function      | —                                | -       |
| footer          | popconfirm 自定义 footer        | React.node    | —                                | -       |
| visible         | popconfirm 是否显示             | boolean       | —                                | -       |
| onVisibleChange | popconfirm visible 改变时的回调 | function      | —                                | -       |
| onClickOutSide  | 点击 popconfirm 外部回调        | function      | —                                | -       |
| okProps         | footer 确认按钮 props           | object/string | —                                | -       |
| cancelProps     | footer 取消按钮 props           | object/string | —                                | -       |
| type            | 类型                            | string        | [warning, danger, info, success] | warning |
