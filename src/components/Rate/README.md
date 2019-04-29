## Rate 评分

评分组件

### 基本用法

::: demo 评分被分为三个等级，可以利用颜色对分数及情感倾向进行分级（默认情况下不区分颜色）。三个等级所对应的颜色用过`colors`属性设置，而它们对应的两个阈值则通过 `lowThreshold` 和 `highThreshold` 设定， change 可监听分值改变。

```js
render() {
  return (
    <div className="intro-block">
      <div className="block">
        <span className="demonstration">默认不区分颜色</span>
        <span className="wrapper">
          <Rate onChange={(val) => Message.info(val)} />
        </span>
      </div>
    </div>
  )
}
```

:::

### 允许半选

可支持鼠标选择半星

::: demo 为组件设置 `allowHalf` 属性点击图标左侧可选择半星。

```js
render() {
  return <Rate allowHalf={true} onChange={(val) => console.log(val)} />
}
```

:::

### 辅助文字

用辅助文字直接地表达对应分数

::: demo

```js
constructor(props) {
  super(props)
  this.state = {
    value: 3
  }
}

handleChange(value) {
  this.setState({ value });
}

render() {
  const { value } = this.state;
  return (
    <span>
      <Rate onChange={this.handleChange.bind(this)} value={value} />
      {value && <span style={{fontSize: "14px", paddingLeft: "8px", verticalAlign: "middle"}}>{value} stars</span>}
    </span>
  );
}
```

:::

### 只读

只读的评分用来展示分数，允许出现半星

::: demo 为组件设置 `disabled` 属性表示组件为只读，支持小数分值。

```js
render() {
  return <Rate disabled value={3} />
}
```

:::

### 其他字符

只读的评分用来展示分数，允许出现半星

::: demo 可使用任意字符表示

```js
render() {
  return <Rate allowHalf character={<span>&hearts;</span>} value={3} />
}
```

:::

### Attributes

| 参数          | 说明                           | 类型       | 可选值 | 默认值 |
| ------------- | ------------------------------ | ---------- | ------ | ------ |
| character     | 自定义字符                     | React.node | —      | -      |
| count         | 显示几颗星星                   | number     | —      | 5      |
| disabled      | 是否为只读                     | boolean    | —      | false  |
| allowHalf     | 是否允许半选                   | boolean    | —      | false  |
| allowClear    | 选中后再次点击是否可以取消选中 | boolean    | —      | true   |
| onChange      | 选择后的回调                   | function   | —      | -      |
| onHoverChange | 鼠标 hover change 回调         | function   | —      | -      |
