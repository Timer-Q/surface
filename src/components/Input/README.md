# Input 输入框

通过鼠标或键盘输入字符

### 基础款输入框

::: demo

```js
constructor(props) {
  super(props)
  this.state = {}
}
handleChange(value) {
  this.setState({
    value
  })
}
render() {
  const {value} = this.state
  return <div>
    <p>input number</p>
    <Input
      type="number"
      min={10}
      max={20}
      value={value}
      onChange={this.handleChange.bind(this)}
      placeholder="请输入内容" />
    <p>input normal</p>
    <Button onClick={() => this.inputRef.handleClear()} link>clear</Button>
    <Input
      isListenComposition
      onChange={val => console.log(val)}
      ref={ref => this.inputRef = ref}
      placeholder="请输入内容" />
  </div>
}
```

:::

### 禁用状态

::: demo 通过 `disabled` 属性指定是否禁用 input 组件

```js
render() {
  return <Input disabled placeholder="请输入内容" />
}
```

:::

### 带 icon 的输入框

带有图标标记输入类型

::: demo 可以添加 `suffix` 和 `prefix` 属性，增加 icon, 如果要展示 按钮 形态，增加 `affixType`, `affixType` 值为 `button` 的时候，`suffix` 和 `preffix` 中的按钮能得到更好的展示。

```js
render() {
  return (
    <div>
      <Input
        style={{width: '200px'}}
        suffix={<Icon type="clock-circle-o"/>}
        placeholder="请输入日期"
        size="small"
      />
      <br /> <br />
      <Input
      affixType="button"
      style={{width: '200px'}}
      suffix={<Button>123</Button>}
      placeholder="请输入日期"
    />
    </div>
  )
}
```

:::

### 文本域

可调整大小，用于输入多行文本信息

::: demo 调用 `Input.Textarea`

```js
render() {
  return (
    <Input.Textarea
      type="textarea"
      rows="4"
      placeholder="请输入内容"
    />
  )
}
```

:::

### TODO 可自适应文本高度的文本域

通过设置 `autosize` 属性可以使得文本域的高度能够根据文本内容自动进行调整，并且 `autosize` 还可以设定为一个对象，指定最小行数和最大行数。

::: demo

```js
render() {
  return (
    <div>
      <Input.Textarea
        type="textarea"
        autosize
        placeholder="请输入内容"
        counter={10}
      />
      <div style={{ margin: '20px 0' }}></div>
      <Input.Textarea
        type="textarea"
        autosize={{ minRows: 2, maxRows: 4}}
        placeholder="请输入内容"
      />
    </div>
  )
}
```

:::

### 复合型输入框

可前置或后置元素，一般为标签或按钮

::: demo 可通过 prepend 和 append 来指定在 input 中前置或者后置内容。

```js
render() {
  return (
    <div>
      <p>addonBefore button</p>
      <Input placeholder="请输入内容" addonBefore="Http://" />
      <p>addonAfter</p>
      <Input placeholder="请输入内容" addonAfter=".com" />
      <p>addonBefore && addonAfter && small</p>
      <Input size="small" placeholder="请输入内容" addonBefore={
        <Select size="small" bordered={false} placeholder="请选择">
          {
            ['餐厅名', '订单号', '用户电话'].map((item, index) => <Select.Option key={index} label={item} value={index}>{item}</Select.Option>)
          }
        </Select>
      } addonAfter={<Button size="small" link type="primary" icon="search">搜索</Button>} />
    </div>
  )
}
```

:::

### 尺寸

::: demo 可通过 `size` 属性指定输入框的尺寸，除了默认的大小外，还提供了 large、small 两种尺寸。

```js
constructor(props) {
  super(props)
  this.state = {
    value: ''
  }
}

handleChange(value) {
  this.setState({
    value
  })
}
// counter 属性后续会被废除 counter 可以用 suffix 代替
render() {
  return (
    <div className="inline-input">
      <p>large</p>
      <Input placeholder="请输入内容" size="large" />
      <p>default</p>
      <Input placeholder="请输入内容" value={this.state.value} onChange={this.handleChange.bind(this)} counter="10"/>
      <p>small</p>
      <Input placeholder="请输入内容" size="small" />
      <p>tiny</p>
      <Input placeholder="请输入内容" size="tiny" />
    </div>
  )
}
```

:::

### 组合

::: demo 可通过 `size` 属性指定输入框的尺寸，除了默认的大小外，还提供了 large、small 两种尺寸。

```js
render() {
  return (
    <React.Fragment>
      <p>input group small</p>
      <Input.Group size='small'>
        <Input placeholder="请输入内容" />
        <Input placeholder="请输入内容" />
        <Input placeholder="请输入内容" />
      </Input.Group>
      <p>input group with title</p>
      <Input.Group>
        <Input title='title1' placeholder="请输入内容" />
        <Input title='title2' placeholder="请输入内容" />
        <Select title="title3" size="small" bordered={false} placeholder="请选择">
          {
            ['餐厅名', '订单号', '用户电话'].map((item, index) => <Select.Option key={index} label={item} value={index}>{item}</Select.Option>)
          }
        </Select>
      </Input.Group>
      <p>input group with checkbox</p>
      <Input.Group>
        <Input title={<Checkbox>早餐</Checkbox>} placeholder="请输入内容" />
        <Input title={<Checkbox>午餐</Checkbox>} placeholder="请输入内容" />
        <Select title={<Checkbox>晚餐</Checkbox>} size="small" bordered={false} placeholder="请选择">
          {
            ['餐厅名', '订单号', '用户电话'].map((item, index) => <Select.Option key={index} label={item} value={index}>{item}</Select.Option>)
          }
        </Select>
      </Input.Group>
    </React.Fragment>
  )
}
```

:::

### Input Attributes

| 属性 / 方法         | 说明                            | 类型               | 默认值 / 可选值                         |
| :------------------ | :------------------------------ | :----------------- | :-------------------------------------- |
| value               | input value                     | any                | -                                       |
| defaultValue        | input 默认 value                | any                | -                                       |
| disabled            | input 是否禁用                  | any                | false / [true, false]                   |
| onChange            | input onChange 方法             | function           | -                                       |
| id                  | input id                        | string             | -                                       |
| type                | htmlDom input 类型              | string             | text / [number...]                      |
| size                | input 大小                      | string             | default / [tiny, small, default, large] |
| prefix              | 带图标前缀的 input              | string / ReactNode | -                                       |
| suffix              | 带图标后缀的 input              | string / ReactNode | -                                       |
| addonBefore         | 带前置标签的 input              | string / ReactNode | -                                       |
| addonAfter          | 带后置标签的 input              | string / ReactNode | -                                       |
| counter             | input 后面的计数器              | string / number    | -                                       |
| readonly            | input 是否只读                  | bool               | false                                   |
| bordered            | 是否渲染 border                 | bool               | true                                    |
| className           | 自定义 class                    | string             | -                                       |
| title               | input 上方的 title              | string             | -                                       |
| style               | 自定义 style                    | object             | -                                       |
| onBlur              | input onblur 事件               | function           | -                                       |
| onFocus             | input onfocus 事件              | function           | -                                       |
| onKeyDown           | input onkeydown 事件            | function           | -                                       |
| onKeyUp             | input onkeyup 事件              | function           | -                                       |
| onPressEnter        | input 回车键 事件               | function           | -                                       |
| onClear             | 清空 input 事件                 | function           | -                                       |
| isListenComposition | 是否在拼音输入完后出发 onChange | bool               | false                                   |

### 组件分析

input 组件有三种形态，根据这个形态，可以用 三个方法 来渲染

- 普通 input
  `renderInput`
- 前 | 后 带 icon
  `renderInputWithIcon`
- 前 | 后 带 addon
  `renderInputWithAddon`

---

### 组件实现

> 先解释两个概念： 受控组件 & 非受控组件 (参考[React 表单-受控组件与非受控组件](https://itbilu.com/javascript/react/4ki9qFFqg.html))

- 受控组件：受控组件也被称做“受限组件”或“受约束组件”。受控组件与其它 React 组件行为一样，其所有状态属性的更改都由 React 来控制，也就是说它根据组件的 props 和 state 来改变组件的 UI 表现形式。

- 非受控组件：非受控组件相对于普通 React 组件或受控组件来说是一种反模式。非受控组件不受 React 的状态控制（state 或 props）。

- `React 对 input 中的 value 进行了管理。所以，会有 input 上的 value 改不掉的时候。`

*renderInput*实现

```jsx
// fix warning: A component is changing an uncontrolled input of type text to be controlled. ...
fixControlledValue(value) {
  if (typeof value === "undefined" || value === null) {
    return ""
  }
  return value
}

handleChange(e) {
  e.preventDefault()
  const { onChange } = this.props
  if (onChange) {
    onChange(e.target.value)
  }
}

renderInupt() {
  const {
    type,
    addonBefore, // eslint-disable-line
    addonAfter, // eslint-disable-line
    prefixClass, // eslint-disable-line
    autoComplete,
    ...otherProps
  } = this.props

  if ("value" in this.props) {
    otherProps.value = this.fixControlledValue(otherProps.value)
    delete otherProps.defaultValue
  }
  return this.renderInputWithIcon(
    <input
      {...otherProps}
      type={type}
      onChange={this.handleChange.bind(this)}
      className={this.getInputClassName()}
      autoComplete={autoComplete}
    />
  )
}
```

### note:

- 关于 defaultValue： 如果想使  组件变成 非受控组件 可以使用 defaultValue 属性。
- 关于‘双向绑定’： React 中没有指令，没法像 v-model 一样方便；这里用的笨方法，通过暴露 `onChang (相当于 vue 中的 @input)` 处理数据。ant-design 中在 From & FormItem 层面  自动实现了'双向绑定'.
- 关于 setState: setState 不是同步操作。
- 关于 width: 100%; : 不同场景下需要不同长度的 input，Input 是基础组件，使用时需要在 Input 外层限定宽度。

5.  遇到问题

- uncontrolled <=> controlled
- el[display: inline] 内部 el 的 box-shadow 会被遮住。

// TODO:

1.  addon text-overflow
2.  textarea autosize
