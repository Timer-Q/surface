## badge 徽标

图标右上角的圆形徽标数字。

### 基本用法

:::demo 一般出现在通知图标或头像的右上角，用于显示需要处理的消息条数，通过醒目视觉形式吸引用户处理。

```js
render() {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Badge count={1} processing></Badge>
      <Badge count={11} status="warning" text="text"></Badge>
      <Badge count={111} status="default"></Badge>
      <Badge count={1} status="warning">
        <div
          style={{width: "50px", height: "50px", background: "#ddd", fontSize: '12px', wordBreak: 'break-all'}}>
            normal
        </div>
      </Badge>
      <Badge count={111}>
        <div
          style={{width: "50px", height: "50px", background: "#ddd", fontSize: '12px', wordBreak: 'break-all'}}>
            overflowCount
        </div>
      </Badge>
      <Badge count={1} dot status="success" processing>
        <div
          style={{width: "50px", height: "50px", background: "#ddd", fontSize: '12px', wordBreak: 'break-all'}}>
            dot + processing
        </div>
      </Badge>
      <Badge count={1} style={{background: '#ddd', color: '#333'}}>
        <div
          style={{width: "50px", height: "50px", background: "#ddd", fontSize: '12px', wordBreak: 'break-all'}}>
            自定义样式
        </div>
      </Badge>
    </div>
  )
}
```

:::

### Badge

| 参数          | 说明            | 类型          | 可选值                        | 默认值 |
| ------------- | --------------- | ------------- | ----------------------------- | ------ |
| status        | 状态            | string        | success/warning/error/default | error  |
| processing    | 显示进度动画    | boolean       | true/false                    | false  |
| count         | 显示的数字      | string/number | -                             | -      |
| overflowCount | 显示+的最大数值 | number        | -                             | 99     |
| dot           | 不显示数字      | boolean       | true/false                    | false  |
| text          | 自定义文本      | string        | -                             | -      |
