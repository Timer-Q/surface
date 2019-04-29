## TimeLine 时间轴

用以展示连续操作

### 基础用法

:::demo

```js
render() {
    return (
      <div style={{ padding: "20px" }}>
        <TimeLine title="Day1">
          <TimeLine.Item
            title="行程主题"
            subTitle={<Button link>快点我</Button>}>
            <Input />
          </TimeLine.Item>
          <TimeLine.Item head={<Icon type='edit'/>} title="住宿说明">
            <Input />
          </TimeLine.Item>
          <TimeLine.Item
            title='husky'
            titleStyle={{
                color: '#d60016'
            }}
            subTitle={
                <Button
                className="button-delete"
                link>
                删除
                </Button>
            }
            />
        </TimeLine>
      </div>
    )
}
```

:::

### TimeLine Attributes

| 属性 / 方法    | 说明                       | 类型    | 默认值 / 可选值 |
| :------------- | :------------------------- | :------ | :-------------- |
| title          | timeline title             | string  | -               |
| isShowLastTail | 最后一个 item 是否显示竖线 | boolean | false           |

### TimeLineItem Attributes

| 属性 / 方法 | 说明                                   | 类型               | 默认值 / 可选值 |
| :---------- | :------------------------------------- | :----------------- | :-------------- |
| head        | timelineitem heander (常用以放置 icon) | ReactNode/striong  | -               |
| className   | 自定义样式名                           | string             | -               |
| title       | timelienitem title                     | string / ReactNode | -               |
| subTitle    | timelienitem subTitle                  | string / ReactNode | -               |
