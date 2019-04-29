## Alert 警告提示

警告提示，展现需要关注的信息。

### 基本用法

:::demo 当某个页面需要向用户显示警告的信息时。非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

```js

constructor(props) {
  super(props)
  this.state = {
    content: ['马蜂什么', '马什么窝', '什么蜂窝']
  }
}

handleClose() {
  console.log('close')
}

render() {
  return (
    <div>
      <p>autoPlay 可滚动 info</p>
      <Alert
        autoPlay={true}
        delay={3000}
        defaultActiveIndex={2}
        onClose={this.handleClose.bind(this)}
        content={this.state.content} />
      <p>closable 可关闭 success</p>
      <Alert closable type="success" content={this.state.content} />
      <p>danger</p>
      <Alert type="danger" title="马蜂窝是这儿吗" content={this.state.content} />
      <p>warning</p>
      <Alert type="warning" content={this.state.content} />
    </div>
  )
}
```

:::

### Alert

| 参数               | 说明           | 类型    | 可选值                     | 默认值 |
| ------------------ | -------------- | ------- | -------------------------- | ------ |
| type               | 类型           | string  | success/warning/error/info | info   |
| autoPlay           | 是否滚动       | boolean | true/false                 | false  |
| closable           | 是否可关闭     | boolean | true/false                 | false  |
| content            | 显示内容       | string  | -                          | -      |
| title              | title          | string  | -                          | -      |
| defaultActiveIndex | 默认显示第几个 | number  | -                          | -      |
| delay              | 滚动延时       | number  | -                          | 1000   |
