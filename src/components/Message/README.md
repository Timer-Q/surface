## Message 消息提示

常用于主动操作后的反馈提示。

### 基础用法

从顶部出现，3 秒后自动消失。

:::demo Message 在配置上与 Notification 非常类似，所以部分 options 在此不做详尽解释，文末有 options 列表，可以结合 Notification 的文档理解它们。

```js
open() {
  Message.info('这是一条消息提示');
}

render() {
  return <Button ghost onClick={this.open.bind(this)}>打开消息提示</Button>
}
```

:::

### 不同状态

用来显示「成功、警告、消息、错误」类的操作反馈。

:::demo Message 现支持 success、warning、info、error 四种状态

```js
open() {
  Message.success('成功, 且有关闭回调', function() {console.log('close')} );
}

open2() {
  Message.warning('警告, 10s 后关闭', 10);
}

open3() {
  Message.info('5s 后关闭， 并带有回调', 5, () => console.log('info close'));
}

open4() {
  Message.error('错了哦，这是一条错误消息');
}

render() {
  return (
    <div>
      <Button ghost onClick={this.open.bind(this)}>成功</Button>
      <Button ghost onClick={this.open2.bind(this)}>警告</Button>
      <Button ghost onClick={this.open3.bind(this)}>消息</Button>
      <Button ghost onClick={this.open4.bind(this)}>错误</Button>
    </div>
  )
}
```

:::

### TODO: 可关闭

可以添加关闭按钮。

:::demo 默认的 Message 是不可以被人工关闭的，如果需要可手动关闭的 Message，可以使用`showClose`字段。此外，和 Notification 一样，Message 拥有可控的`duration`，设置`0`为不会被自动关闭，默认为 3000 毫秒。

```js
open5() {
  Message({
    showClose: true,
    message: '恭喜你，这是一条成功消息',
    type: 'success'
  });
}

open6() {
  Message({
    showClose: true,
    message: '警告哦，这是一条警告消息',
    type: 'warning'
  });
}

open7() {
  Message({
    showClose: true,
    message: '这是一条消息提示',
    type: 'info'
  });
}

open8() {
  Message({
    showClose: true,
    message: '错了哦，这是一条错误消息',
    type: 'error'
  });
}

render() {
  return (
    <div>
      <Button ghost onClick={this.open5.bind(this)}>成功</Button>
      <Button ghost onClick={this.open6.bind(this)}>警告</Button>
      <Button ghost onClick={this.open7.bind(this)}>消息</Button>
      <Button ghost onClick={this.open8.bind(this)}>错误</Button>
    </div>
  )
}
```

:::

### Options

| 参数     | 说明           | 类型                | 可选值 | 默认值 |
| -------- | -------------- | ------------------- | ------ | ------ |
| content  | 消息文字       | string/ReactElement | —      | —      |
| duration | 显示时间       | string/number       | -      | 3      |
| onClose  | 关闭时候的回调 | function            | —      | —      |
