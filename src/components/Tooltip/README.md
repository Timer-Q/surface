## Tag 标签

用于标记和选择。

### 基础用法

:::demo 由`type`属性来选择 tag 的类型，也可以通过`color`属性来自定义背景色。

```js
render() {
  return (
    <div>
      <Tooltip trigger="click" placement="top-start" title="提示文字">
        <Button link>click to show tooltip</Button>
      </Tooltip>
      &nbsp;&nbsp;
      <Tooltip placement="top" theme="dark" title="提示文字">
        <Button link>hover to show tooltip</Button>
      </Tooltip>
    </div>
  )
}
```

:::

### Attributes

| 参数  | 说明     | 类型   | 可选值     | 默认值 |
| ----- | -------- | ------ | ---------- | ------ |
| theme | 主题色   | string | light\dark | light  |
| title | 提示文字 | string | -          | -      |

. 其他属性 同 `popover`
