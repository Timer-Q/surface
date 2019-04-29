## Tag 标签

用于标记和选择。

### 基础用法

:::demo 由`type`属性来选择 tag 的类型，也可以通过`color`属性来自定义背景色。

```js
render() {
  return (
    <div>
      <p>不带边框</p>
      <Tag closable={false}>标签一</Tag>
      <Tag type="gray">标签二</Tag>
      <Tag type="primary">标签三</Tag>
      <Tag type="success">标签四</Tag>
      <Tag type="warning">标签五</Tag>
      <Tag type="danger">标签六</Tag>
      <Tag type="#2db7f5">#2db7f5</Tag>
      <p>带边框</p>
      <Tag bordered={true} closable={false}>标签一</Tag>
      <Tag bordered={true} type="gray">标签二</Tag>
      <Tag bordered={true} type="primary">标签三</Tag>
      <Tag bordered={true} type="success">标签四</Tag>
      <Tag bordered={true} type="warning">标签五</Tag>
      <Tag bordered={true} type="danger">标签六</Tag>
      <Tag bordered={true} type="#2db7f5">#2db7f5</Tag>
    </div>
  )
}
```

:::

### 可移除标签

:::demo 设置`closable`属性来定义一个可移除的标签，接受一个`Boolean`，设置为`true`即可。默认的标签移除时会附带渐变动画，如果不想使用，可以设置`closeTransition`属性，它接受一个`Boolean`，true 为关闭。设置`close`事件可以处理关闭后的回调函数。

```js
constructor(props) {
  super(props);

  this.state = {
    tags: [
      { key: 1, name: '标签一', type: '' },
      { key: 2, name: '标签二', type: 'gray' },
      { key: 5, name: '标签三', type: 'primary' },
      { key: 3, name: '标签四', type: 'success' },
      { key: 4, name: '标签五', type: 'warning' },
      { key: 6, name: '标签六', type: 'danger' },
      { key: 7, name: '标签七', type: '#f50' }
    ]
  }
}

handleClose(tag) {
  const { tags } = this.state;

  tags.splice(tags.map(el => el.key).indexOf(tag.key), 1);

  this.setState({ tag });
}

render() {
  return (
    <div>
      {
        this.state.tags.map(tag => {
          return (
            <Tag
              key={tag.key}
              closable={true}
              type={tag.type}
              closeTransition={false}
              onClose={this.handleClose.bind(this, tag)}>{tag.name}</Tag>
          )
        })
      }
    </div>
  )
}
```

:::

### 选中状态

:::demo `checkable` 属性可设置 `Tag` 是否可选中，`checked` 设置 `Tag` 是否为选中状态，`onChange` 选中状态切换时候的回调

```js
constructor(props) {
  super(props);

  this.state = {
    tags: [
      { key: 1, name: '标签一', type: '' },
      { key: 2, name: '标签二', type: 'gray' },
      { key: 5, name: '标签三', type: 'primary' },
      { key: 3, name: '标签四', type: 'success' },
      { key: 4, name: '标签五', type: 'warning' },
      { key: 6, name: '标签六', type: 'danger' }
    ]
  }
}

handleClose(tag) {
  const { tags } = this.state;

  tags.splice(tags.map(el => el.key).indexOf(tag.key), 1);

  this.setState({ tag });
}

render() {
  return (
    <div>
      {
        this.state.tags.map(tag => {
          return (
            <Tag
              key={tag.key}
              closable={true}
              checkable
              onChange={(isChecked) => console.log(isChecked)}
              type={tag.type}
              closeTransition={false}
              onClose={this.handleClose.bind(this, tag)}>{tag.name}</Tag>
          )
        })
      }
    </div>
  )
}
```

:::

### Attributes

| 参数      | 说明         | 类型     | 可选值                                            | 默认值 |
| --------- | ------------ | -------- | ------------------------------------------------- | ------ |
| type      | 主题         | string   | 'primary', 'gray', 'success', 'warning', 'danger' | —      |
| closable  | 是否可关闭   | boolean  | —                                                 | false  |
| checkable | 是否可选中   | boolean  | —                                                 | false  |
| checked   | 选中的状态   | boolean  | —                                                 | false  |
| onChange  | 选中切换回调 | function | —                                                 | -      |
