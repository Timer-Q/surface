## Button 按钮

常用的操作按钮。

### 基础用法

基础的按钮用法。

:::demo Button 组件默认提供 7 种主题，由`type`属性来定义，默认为`primary`。

```js
render() {
  return (
    <div>
      <Button>主要按钮</Button>
      <Button href="www.mafengwo.cn">surface</Button>
      <Button type="default">默认按钮</Button>
      <Button link>文字按钮</Button>
    </div>
  )
}
```

:::

### 禁用状态

按钮不可用状态。

:::demo 你可以使用`disabled`属性来定义按钮是否可用，它接受一个`Boolean`值。

```js
render() {
  return (
    <div>
      <Button ghost disabled={true}>ghost 默认按钮</Button>
      <Button type="primary" disabled={true}>主要按钮</Button>
      <Button link disabled={true}>文字按钮</Button>
    </div>
  )
}
```

:::

### 有颜色倾向

不同的颜色倾向代表不同的提示

:::demo 朴素按钮同样设置了不同的`type`属性对应的样式（可选值同上），默认为`primary`。设置`plain`属性，它接受一个`Boolean`。

```js
render() {
  return (
    <div className="intro-block">
      <div className="block">
        <span className="demonstration">默认显示颜色</span>
        <p className="wrapper">
          <Button type="success">成功按钮</Button>
          <Button type="warning">警告按钮</Button>
          <Button type="danger">危险按钮</Button>
          <Button type="primary">主要按钮</Button>
          <Button type="default">默认按钮</Button>
        </p>
        <p className="wrapper">
          <Button ghost type="success">成功按钮</Button>
          <Button ghost type="warning">警告按钮</Button>
          <Button ghost type="danger">危险按钮</Button>
          <Button ghost type="primary">主要按钮</Button>
          <Button ghost type="default">默认按钮</Button>
        </p>
        <p className="wrapper">
          <Button link type="success">成功按钮</Button>
          <Button link type="warning">警告按钮</Button>
          <Button link type="danger">危险按钮</Button>
          <Button link type="primary">主要按钮</Button>
          <Button link type="default">默认按钮</Button>
        </p>
      </div>
    </div>
  )
}
```

:::

### 图标按钮

带图标的按钮可增强辨识度(有文字)或节省空间(无文字)。

:::demo 设置`icon`属性即可，icon 的列表可以参考 Element 的 icon 组件，也可以设置在文字右边的 icon ，只要使用`i`标签即可，可以使用自定义图标。

```js
render() {
  return (
    <div>
      <Button type="primary" icon="edit"></Button>
      <Button type="primary" icon="delete"></Button>
      <Button type="primary" icon="search">搜索</Button>
      <Button type="primary">编辑 <Icon type="edit" /></Button>
    </div>
  )
}
```

:::

### 按钮组

以按钮组的方式出现，常用于多项类似操作。

:::demo 使用`Button.Group`标签来嵌套你的按钮。

```js
render() {
  return (
    <div>
      <p>default</p>
      <Button.Group>
          <Button type="default" icon="left">上一页</Button>
          <Button type="default">下一页<Icon type="right" /></Button>
      </Button.Group>
      <p>has background</p>
      <Button.Group>
          <Button type="primary" icon="plus-circle-o"></Button>
          <Button type="primary" icon="minus-circle-o"></Button>
          <Button type="primary" icon="delete"></Button>
      </Button.Group>
      <Button.Group>
          <Button type="success" icon="plus-circle-o"></Button>
          <Button type="success" icon="minus-circle-o"></Button>
          <Button type="success" icon="delete"></Button>
      </Button.Group>
      <Button.Group>
          <Button type="danger" icon="plus-circle-o"></Button>
          <Button type="danger" icon="minus-circle-o"></Button>
          <Button type="danger" icon="delete"></Button>
      </Button.Group>
      <Button.Group>
          <Button type="warning" icon="plus-circle-o"></Button>
          <Button type="warning" icon="minus-circle-o"></Button>
          <Button type="warning" icon="delete"></Button>
      </Button.Group>
      <p>ghost</p>
      <Button.Group>
          <Button ghost type="primary" icon="plus-circle-o"></Button>
          <Button ghost type="primary" icon="minus-circle-o"></Button>
          <Button ghost type="primary" icon="delete"></Button>
      </Button.Group>
      <Button.Group>
          <Button ghost type="success" icon="plus-circle-o"></Button>
          <Button ghost type="success" icon="minus-circle-o"></Button>
          <Button ghost type="success" icon="delete"></Button>
      </Button.Group>
      <Button.Group>
          <Button ghost type="danger" icon="plus-circle-o"></Button>
          <Button ghost type="danger" icon="minus-circle-o"></Button>
          <Button ghost type="danger" icon="delete"></Button>
      </Button.Group>
      <Button.Group>
          <Button ghost type="warning" icon="plus-circle-o"></Button>
          <Button ghost type="warning" icon="minus-circle-o"></Button>
          <Button ghost type="warning" icon="delete"></Button>
      </Button.Group>
      <p>link</p>
      <Button.Group>
          <Button link type="warning" icon="plus-circle-o"></Button>
          <Button link type="warning" icon="minus-circle-o"></Button>
          <Button link type="warning" icon="delete"></Button>
      </Button.Group>
    </div>
  )
}
```

:::

### 加载中

点击按钮后进行数据加载操作，在按钮上显示加载状态。

:::demo 要设置为 loading 状态，只要设置`loading`属性为`true`即可。loading 状态不可点击。

```js
render() {
  return <Button type="primary" loading={true}>加载中</Button>
}
```

:::

### 不同尺寸

Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`large`、`small`、`tiny`，通过设置`size`属性来配置它们。

```js
render() {
  return (
    <div>
      <Button type="primary" size="large">大型按钮</Button>
      <Button type="primary">正常按钮</Button>
      <Button type="primary" size="small">小型按钮</Button>
      <Button type="primary" size="tiny">超小型按钮</Button>
    </div>
  )
}
```

:::

### Attributes

| 参数     | 说明                         | 类型    | 可选值                         | 默认值 |
| -------- | ---------------------------- | ------- | ------------------------------ | ------ |
| size     | 尺寸                         | string  | large,default,small,tiny       | —      |
| type     | 类型                         | string  | primary,success,warning,danger | —      |
| ghost    | 是否朴素按钮                 | Boolean | true,false                     | false  |
| loading  | 是否加载中状态               | Boolean | —                              | false  |
| disabled | 禁用                         | boolean | true, false                    | false  |
| icon     | 图标，已有的图标库中的图标名 | string  | —                              | —      |
| htmlType | 原生 type 属性               | string  | button,submit,reset            | button |
| link     | 展示为 link 形式             | boolean | -                              | false  |
