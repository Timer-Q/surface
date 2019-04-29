## InputNumber 数字输入框

数字输入框。

### 基础用法

:::demo 最基本的用法

```js
render() {
  return (
      <div>
        <InputNumber size="small"  placeholder="input number small"></InputNumber>
        <p></p>
        <InputNumber placeholder="input number"></InputNumber>
        <p></p>
        <InputNumber size="large"  placeholder="input number large"></InputNumber>
    </div>
  )
}
```

:::

### 禁用状态

:::demo  设置`disabled`属性来定义一个，接受一个`Boolean`，设置为`true`即可。

```js
render() {
  return (
    <div>
      <InputNumber disabled></InputNumber>
    </div>
  )
}
```

:::

### 带最大值最小值步长的状态

:::demo 设置`min`属性来定义最小值，接受一个`number`，设置`max`属性来定义最大值，接受一个`number`，设置`step`属性来定义步长，接受一个`number`。

```js

render() {
  return (
    <div>
      <InputNumber min={-1} max={40} step={3} defaultValue={2} onChange={(e)=>{
        console.log(e)
      }} decimalSeparator={","} precision={3}></InputNumber>

    </div>
  )
}
```

:::

### Attributes

| 参数            | 说明                     | 类型     | 可选值                                            | 默认值 |
| --------------- | ------------------------ | -------- | ------------------------------------------------- | ------ |
| size            | 尺寸                     | string   | 'small', 'default', 'large' |  'default'      |
| value        | 数值(受控属性)               | number | string  | —                                                 |  -  |
| disabled        | 是否禁用               | boolean  | —                                                 | false  |
| max        |      最大值     | number	  | —                                            | Infinity  |
| min        |      最小值     | number	  | —                                            | -Infinity  |
| step        |   每次改变步数，可以为小数     | number	  | —                                            |  1  |
| formatter        | 指定输入框展示值的格式	          | func  | —                                            | -  |
| parser        | 	指定从 formatter 里转换回数字的方式，和 formatter 搭配使用| func  | —                           | -  |
| precision         | 数值精度，小数点的位数                 | 正number	 | —                                 | -      |
| decimalSeparator         | 小数点                 | any | —                                 | -      |
| className        | 附加的class名          | string  | —                                            | -  |
| onChange         |  状态改变时候的回调                 | func | —                                 | -      |