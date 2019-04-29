## Checkbox 多选框

一组备选项中进行多选

### 基础用法

单独使用可以表示两种状态之间的切换。

:::demo 简单的 Checkbox，使用`checked`切换选中状态。

```js
constructor(props) {
  super(props)
  this.state = {}
}
render() {
  const {checked} = this.state

  return (
    <React.Fragment>
      <Checkbox>
        <Popover popupClassName placement="top-start" title="标题" width="200" trigger="hover" content="这是一段容,这是一段容,这是一段容,这是一段容。">
          <Button link>hover 激活</Button>
        </Popover>
      </Checkbox>
      <Checkbox checked={checked} onChange={() => this.setState({checked: !checked})} defaultChecked>备选项</Checkbox>
    </React.Fragment>
  )
}
```

:::

### 禁用状态

多选框不可用状态。

:::demo 设置`disabled`属性即可。

```js
render() {
  return (
    <div>
      <Checkbox disabled>备选项1</Checkbox>
      <Checkbox defaultChecked disabled>备选项2</Checkbox>
    </div>
  )
}
```

:::

### 多选框组

适用于多个勾选框绑定到同一个数组的情景，通过是否勾选来表示这一组选项中的项。

:::demo Checkbox.Group 元素能把多个 checkbox 管理为一组，只需要在 Group 中使用`value`绑定 Array 类型的变量即可，`label`属性除了改变 checkbox 按钮后的介绍外，同时也是该 checkbox 对应的值，`label`与数组中的元素值相对应，如果存在指定的值则为选中状态，否则为不选中。

```js
constructor(props) {
  super(props);

  this.state = {
    checkList: ['复选框 A', '选中且禁用']
  }
}

handleChange(checkList) {
  console.debug(checkList)
  this.setState({
    checkList
  })
}

render() {
  return (
    <Checkbox.Group onChange={this.handleChange.bind(this)} value={this.state.checkList}>
      <Checkbox value="复选框 A">复选框 A
        <Select readonly defaultValue="lucy" style={{ width: 120 }}>
          <Select.Option value="jack">Jack</Select.Option>
          <Select.Option value="lucy">Lucy</Select.Option>
          <Select.Option value="disabled" disabled>Disabled</Select.Option>
          <Select.Option value="Yiminghe">yiminghe</Select.Option>
        </Select>
      </Checkbox>
      <Checkbox value="复选框 B">复选框 B</Checkbox>
      <Checkbox value="复选框 C">复选框 C</Checkbox>
      <Checkbox value="禁用" disabled>禁用</Checkbox>
      <Checkbox value="选中且禁用" disabled>选中且禁用</Checkbox>
    </Checkbox.Group>
  )
}
```

:::

### indeterminate 状态

`indeterminate`属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果

:::demo 设置`indeterminate`属性该表 checkbox 不确定状态.

```js
constructor(props) {
  super(props);

  this.state = {
    checkAll: false,
    cities: ['上海', '北京', '广州', '深圳'],
    checkedCities: ['上海', '北京'],
    isIndeterminate: true,
  }
}

handleCheckAllChange(checked, props) {
  checked = !props.checked
  const checkedCities = checked ? ['上海', '北京', '广州', '深圳'] : [];
  this.setState({
    isIndeterminate: false,
    checkAll: checked,
    checkedCities: checkedCities,
  });
}

handleCheckedCitiesChange(value) {
  const checkedCount = value.length;
  const citiesLength = this.state.cities.length;

  this.setState({
    checkedCities: value,
    checkAll: checkedCount === citiesLength,
    isIndeterminate: checkedCount > 0 && checkedCount < citiesLength,
  });
}

render() {
  return (
    <div>
      <Checkbox
        checked={this.state.checkAll}
        indeterminate={this.state.isIndeterminate}
        onChange={this.handleCheckAllChange.bind(this)}>全选</Checkbox>
      <div style={{margin: '15px 0'}}></div>
      <Checkbox.Group
        value={this.state.checkedCities}
        onChange={this.handleCheckedCitiesChange.bind(this)}>
        {
          this.state.cities.map((city, index) =>
            <Checkbox key={index} value={city}>{city}</Checkbox>
          )
        }
      </Checkbox.Group>
    </div>
  )
}
```

:::

### 组件属性

Checkbox

| 属性 / 方法    | 说明                                    | 类型     | 默认值 / 可选值               |
| :------------- | :-------------------------------------- | :------- | :---------------------------- |
| type           | type 属性                               | string   | checkbox / [checkbox / radio] |
| disabled       | disabled 状态                           | boolean  | false / [true / false]        |
| readOnly       | readOnly 状态                           | boolean  | false / [true / false]        |
| onClick        | click 回调                              | function | -                             |
| onChange       | checked 状态变化是的回调                | function | -                             |
| onFocus        | focus 回调                              | function | -                             |
| onBlur         | blur 回调                               | function | -                             |
| checked        | 是否被选中                              | boolean  | [true / false]                |
| defaultChecked | 初始是否被选中                          | boolean  | [true / false]                |
| extra          | label 末尾要显示的内容                  | boolean  | [true / false]                |
| indeterminate  | 设置 indeterminate 状态，只负责样式控制 | boolean  | [true / false]                |

---

Checkbox Group

| 属性 / 方法 | 说明               | 类型  | 默认值 / 可选值 |
| :---------- | :----------------- | :---- | :-------------- |
| disabled    | 整组失效           | bool  | false           |
| options     | 可选项             | array | -               |
| value       | 可选项的值         | array | -               |
| onChange    | value 变化是的回调 | func  | -               |

### Checkbox 组件分析

Checkbox 通过 checked 属性 判断是否被选中，通过 onChange 改变 checked 的值。另：Radio 的表现基本与 CheckBox 一致，故在 Radio 中复用了 CheckBox 组件。

---

### Checkbox 组件实现

```jsx
<input
  {...otherProps}
  className={checkboxClasses}
  type={type}
  disabled={disabled}
  readOnly={readOnly}
  onClick={onClick}
  onChange={this.handleChange.bind(this)}
  onFocus={onFocus}
  onBlur={onBlur}
  value={value}
  checked={!!checked}
/>
```

- checked state 初始化

```jsx
constructor(props) {
  super(props)
  const checked = "checked" in props ? props.checked : props.defaultChecked

  this.state = {
    checked
  }
}
```

- 对 onChange 进行处理

```jsx
handleChange(e) {
  const { onChange, disabled } = this.props

  if (disabled) return

  // 如果 props 中没有传入 checked, 直接修改 state 完成渲染；
  // 如果 checked 是 props 传入的，需要在父组件处理
  if (!("checked" in this.props)) {
    this.setState({
      checked: e.target.checked
    })
  }

  if (onChange) {
    onChange(e.target.checked, this.props)
  }
}
```

- 组件更新后，重新获取 checked 状态

```jsx
componentWillUpdate(nextProps) {
  if ("checked" in nextProps) {
    this.setState({
      checked: nextProps.checked
    })
  }
}
```

---

5.  遇到问题

- react 中 value 无法存储 number 类型
- label 在不同浏览器表现不同, 在 label 包含 input/select 等表单元素的时候：  
  safari：只触发 label 点击  
  ie：先触发 input/select 点击，然后触发 label 点击  
  chrome：只触发 input/select 点击

---

### Checkbox Group 组件分析

CheckboxGroup 可以通过 options 批量渲染 Checkbox。

---

### Checkbox Group 组件实现

- 获取 `value(默认选中的项)`

```jsx
constructor(props) {
  super(props)
  this.state = {
    value: props.value || props.defaultValue || []
  }
}
```

- 获取 `options(需要渲染的项)`, 如果 option 是字符串，格式化成组件需要的格式 `{label: str, value: str}`

```jsx
getOptions() {
  const { options } = this.props
  return options.map(option => {
    if (typeof option === "string") {
      return {
        value: option,
        label: option
      }
    }
    return option
  })
}
```

- onChange 处理

```jsx
/**
 * 判断 现在 state.value 中有没有 opstion.value，没有就 push 进去，有就 splice 掉
 * 最后将 value 传给 onChange 的回调中
 * */
toggleOption(optionData) {
  const optionIndex = this.state.value.indexOf(optionData.value)
  const value = [...this.state.value]
  if (optionIndex === -1) {
    value.push(optionData.value)
  } else {
    value.splice(optionIndex, 1)
  }
  // 如果 state 中的 value 是由 props 中的 value 初始化而来 则不允许直接修改 value
  // 而是通过 onChange 方法将现在的 value 抛出去 由父组件修改
  if (!("value" in this.props)) {
    this.setState({ value })
  }

  const { onChange } = this.props
  if (onChange) {
    onChange(value)
  }
}
```

- 组件重新渲染后 更新 state.value

```jsx
componentWillUpdate(nextProps) {
  if ("value" in nextProps) {
    this.setState({
      value: nextProps.value || []
    })
  }
}
```

---

### 遇到问题

- 暂无
