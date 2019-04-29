# Radio 单选框

在一组备选项中进行单选

### 基础用法

由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。

:::demo 要使用 Radio 组件，需要设置`value`绑定变量，可以通过`checked`来指定 Radio 的选中状态。

```js
constructor(props) {
  super(props);

  this.state = {
    value: '1'
  }
}

onChange(value) {
  this.setState({ value });
}

render() {
  return (
    <div>
      <Radio value="1" checked={this.state.value === '1'} onChange={this.onChange.bind(this)}>备选项</Radio>
      <Radio value="2" checked={this.state.value === '2'} onChange={this.onChange.bind(this)}>备选项</Radio>
    </div>
  )
}
```

:::

### 禁用状态

单选框不可用的状态。

:::demo 注意：请牢记，选中的条件是绑定的变量值等于`value`中的值。只要在`Radio`元素中设置`disabled`属性即可，它接受一个`Boolean`，`true`为禁用。

```js
render() {
  return (
    <div>
      <Radio value="1" disabled>备选项</Radio>
      <Radio value="2" checked disabled>备选项</Radio>
    </div>
  )
}
```

:::

### 单选框组

适用于在多个互斥的选项中选择的场景

:::demo 结合`Radio.Group`元素和子元素`Radio`可以实现单选组，在`Radio.Group`中绑定`value`，在`Radio`中设置好`value`即可，无需再给每一个`Radio`绑定变量，另外，还提供了`onChange`事件来响应变化，它会传入一个参数`value`。

```js
constructor(props) {
  super(props);

  this.state = {
    value: '3'
  }
  this.options = [
    {
      label: '备选项',
      value: '1'
    },
    {
      label: '备选项',
      value: '5'
    },
    {
      label: '备选项',
      value: '7'
    }
  ]
}

onChange(value) {
  console.log(value)
  this.setState({ value });
}

render() {
  return (
    <React.Fragment>
      <p>正常 写法</p>
      <Radio.Group value={this.state.value} onChange={this.onChange.bind(this)}>
        <Radio value="3">备选项</Radio>
        <Radio value="6">备选项</Radio>
        <Radio value="9">备选项</Radio>
      </Radio.Group>

      <p>options 写法</p>
      <Radio.Group options={this.options} value={this.state.value} onChange={this.onChange.bind(this)} />
    </React.Fragment>
  )
}
```

:::

### 按钮样式

按钮样式的单选组合。TODO: 实体按钮样式

:::demo 只需要把`Radio`元素换成`Radio.Button`元素即可，此外，Element 还提供了`size`属性给按钮组，支持`large`和`small`两种（如果不设定为默认）。

```js
constructor(props) {
  super(props);

  this.state = {
    radio3: '上海',
    radio4: '上海',
    radio5: '上海'
  }
}

onChange(key, value) {
  this.setState({
    [key]: value
  });
}

render() {
  return (
    <div>
      <p>radio group button normal</p>
      <Radio.Group size="large" value={this.state.radio3} onChange={this.onChange.bind(this, 'radio3')}>
        <Radio.Button value="上海" >上海</Radio.Button>
        <Radio.Button value="北京" >北京</Radio.Button>
        <Radio.Button value="广州" >广州</Radio.Button>
        <Radio.Button value="深圳" >深圳</Radio.Button>
      </Radio.Group>
      <p>radio group button single disable</p>
      <Radio.Group value={this.state.radio4} onChange={this.onChange.bind(this, 'radio4')}>
        <Radio.Button value="上海" >上海</Radio.Button>
        <Radio.Button value="北京" >北京</Radio.Button>
        <Radio.Button value="广州" disabled={true}>广州</Radio.Button>
        <Radio.Button value="深圳" >
        <Popover
          popupClassName
          placement="top-start"
          title="标题"
          width="200"
          trigger="hover"
          stretchWidth
          bound={{left: -10}}
          content={<span onClick={() => console.log('深圳')}>深圳</span>}>
            <span>深圳</span>
        </Popover>
        </Radio.Button>
      </Radio.Group>
      <p>radio group button all disable</p>
      <Radio.Group size="small" value={this.state.radio5} disabled={true}>
        <Radio.Button value="上海" >上海</Radio.Button>
        <Radio.Button value="北京" >北京</Radio.Button>
        <Radio.Button value="广州" >广州</Radio.Button>
        <Radio.Button value="深圳" >深圳</Radio.Button>
      </Radio.Group>
      <p>radio group button normal</p>
      <Radio.Group size="tiny" value={this.state.radio3} onChange={this.onChange.bind(this, 'radio3')}>
        <Radio.Button value="上海" >上海</Radio.Button>
        <Radio.Button value="北京" >北京</Radio.Button>
        <Radio.Button value="广州" >广州</Radio.Button>
        <Radio.Button value="深圳" >深圳</Radio.Button>
      </Radio.Group>
    </div>
  )
}
```

:::

---

# RadioGroup 实现

## 实现思路

radio 选中后不可取消，且一组 radios 只能有一个被选中。

组件属性

| 属性 / 方法  | 说明          | 类型     | 默认值 / 可选值 |
| :----------- | :------------ | :------- | :-------------- |
| options      | CheckBox 对象 | array    | -               |
| defaultValue | 默认选中项    | string   | -               |
| value        | 指定选中项    | string   | -               |
| onChange     | onChange 回调 | function | -               |

---

组件实现

- 获取初始 value 放到 state 中

```jsx
// getCheckedValue 的作用是获取 children 中 checked 是 true 的 value
constructor(props) {
  super(props)
  this.state = {
    value:
      props.value ||
      props.defaultValue ||
      this.getCheckedValue(props.children)
  }
}
```

- 通过 options 渲染 一组 Radio

```jsx
renderRadios() {
  const { disabled, options, name } = this.props
  const { value } = this.state
  if (options && options.length > 0) {
    return options.map((option, index) => {
      if (typeof option === "string") {
        return (
          <Radio
            key={index}
            disabled={disabled}
            value={option}
            onChange={this.handleChange.bind(this, option)}
            checked={value === option}
            name={name}
          >
            {option}
          </Radio>
        )
      } else {
        return (
          <Radio
            key={index}
            disabled={option.disabled || disabled}
            value={option.value}
            onChange={this.handleChange.bind(this, option)}
            checked={value === option.value}
            name={name}
          >
            {option.label}
          </Radio>
        )
      }
    })
  }
}
```

注：对比 CheckBoxGroup 通过 options 渲染 Checkbox 的方法，这种少了一次循环，但是写起来麻烦。

- onChange 处理

相较于 CheckboxGroup 的 onChange，RadioGroup 的 onChange 处理简单一下。整体思路是一样的。

```jsx
handleChange(option) {
  const preValue = this.state.value
  const curValue = option.value || option
  if (!("value" in this.props)) {
    this.setState({
      value: curValue
    })
  }
  const { onChange } = this.props
  if (onChange && preValue !== curValue) {
    // NOTE: 这里传入 curValue 还是 e 需再商定
    onChange(curValue)
  }
}
```

- 组件重新渲染 更新 state.value

```jsx
componentWillUpdate(nextProps) {
  if ("value" in nextProps) {
    this.setState({
      value: nextProps.value
    })
  } else {
    this.setState({
      value: this.getCheckedValue(nextProps.children)
    })
  }
}
```

遇到问题

- 暂无
