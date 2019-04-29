## Notification 通知提醒框

全局展示通知提醒信息。

### 消息提示

在系统四个角显示通知提醒信息。经常用于以下情况：

- 较为复杂的通知内容。

- 带有交互的通知，给出用户下一步的行动点。

- 系统主动推送。

### 基本用法

:::demo 调用`info`方法即可打开消息提示。值得一提的是，窗口被关闭后。`Notification` 分成两部分， 一个是 `Notice` 即每一个提示框，一个是包裹同一位置的所有 `Notice` 的 `Notification`。调用方法中 `Notification.config()` 是设置 `Notification` 的

```js
constructor(props) {
  super(props)
  this.step = 0 // 为了配合演示 background 可以修改
}
handleClose(key) {
  console.log('close', key)
}
handleInfo() {
  Notification.config({
    top: '150px',
    placement: this.step % 2 > 0 ? 'topRight' : 'bottomLeft'
  })
  Notification.info({
    content: {
      title: 'hentai!',
      description: 'description',
      footer: <span><Button size="small">clickkkkk</Button></span>,
    },
    duration: 0,
    onClose: this.handleClose.bind(this),
    onClick: (instance) => console.log(instance),
    style: {
      background: this.step++ % 2 > 0 ? '#eee' : '#fff',
    }
  })
}

handleDestroy() {
  Notification.destroy()
}

render() {
  return <div>
      <Button key="info" onClick={this.handleInfo.bind(this)}>info</Button>
      <Button key="destroy" onClick={this.handleDestroy.bind(this)}>destroy</Button>
  </div>
}

```

:::

### 多种提示类型

:::demo 通过 `info` `success` `warning` `error` `open` 不同方法的调用会显示不同的 icon

```js
handleNotify(type) {
  Notification[type]({
    content: {
      title: `${type} title`,
      description: `${type} description`,
      footer: (type === 'danger') ? <Button type={type} size="small">clickkkkk</Button> : null,
    },
    duration: 3,
  })
}

render() {

  const types = ['info', 'warning', 'error', 'success']

  return <React.Fragment>
    {types.map(type => <Button key={type} type="default" onClick={this.handleNotify.bind(this, type)}>{type}</Button>)}
    <Button type="default" onClick={this.handleNotify.bind(this, 'open')}>info</Button>
  </React.Fragment>
}

```

:::

### 方法

`Notification.info()`  
`Notification.success()`  
`Notification.warning()`  
`Notification.error()`  
`Notification.open()`  
`Notification.close(key:string)`  
`Notification.destroy()`

### 属性

| 参数      | 说明         | 类型                            | 可选值             | 默认值 |
| --------- | ------------ | ------------------------------- | ------------------ | ------ |
| content   | 展示内容     | string/object/node              | —                  | —      |
| duration  | 展示时间     | number（为 0 时代表不主动关闭） | —                  | —      |
| onClose   | 关闭回调     | function                        | (key:string) => {} | —      |
| onClick   | 点击回调     | function                        | () => {}           | —      |
| style     | 自定义样式   | object                          | -                  | —      |
| className | 自定义样式名 | string                          | -                  | —      |

### config 选项

Notification.config({bottom, duration, getContainer, placement, top})

| 参数         | 说明                      | 类型     | 可选值                                             | 默认值 |
| ------------ | ------------------------- | -------- | -------------------------------------------------- | ------ |
| bottom       | 居下的时候 距离底部的距离 | string   | —                                                  | —      |
| top          | 居上的时候 距离底部的距离 | string   | —                                                  | —      |
| duration     | 统一设置停留时长          | number   | —                                                  | —      |
| getContainer | Notice 插入的位置         | function | () => domElement                                   | —      |
| placement    | 展示的位置                | string   | 'topRight', 'topLeft', 'bottomLeft', 'bottomRight' | —      |
