## Time Picker 时间选择器

用于选择日期

### TODO: 固定时间点

提供几个固定的时间点供用户选择

:::demo 使用 `TimePicker` 标签，分别通过`star`、`end`和`step`指定可选的起始时间、结束时间和步长

```js
constructor(props) {
  super(props)

  this.state = {
    value: '8:00',
  }
}

handleUpdate(value, strValue) {
  console.debug('time-select update: ', value, strValue)
  this.setState({
    value
  })
}

render() {
  return (
    <React.Fragment>
      <TimePicker
        zIndex={4000}
        style={{width: "300px"}}
        onChange={this.handleUpdate.bind(this)}
        value={this.state.value}
        clearable
        placeholder="选择时间"
        />
      <TimePicker
        onChange={this.handleUpdate.bind(this)}
        value={this.state.value}
        placeholder="选择时间"
        />
    </React.Fragment>
  )
}
```

:::

### 任意时间点

可以选择任意时间
:::demo 使用 `TimePicker` 标签

```js
constructor(props) {
  super(props)
  this.state = {
    value: new Date(2016, 9, 10, 18, 40)
  }
}

handleUpdate(value, strValue) {
  console.debug('time-picker update: ', value, strValue)
  this.setState({
    value: value
  })
}

render() {
  return (
    <TimePicker
      onChange={this.handleUpdate.bind(this)}
      placeholder="选择时间"
      value={this.state.value}
      />
  )
}
```

:::

### 不同大小

可以选择任意时间
:::demo 传入 `size` 属性，`size` 的值可以为 `small` `default` `large` 之一

```js
constructor(props) {
  super(props)
  this.state = {
    value: new Date(2016, 9, 10, 18, 40)
  }
}

handleUpdate(value) {
  console.debug('time-picker update: ', value)
}

handleUpdate(value, strValue) {
  console.debug('time-picker update: ', value, strValue)
  this.setState({
    value: value
  })
}

render() {
  return (
    <div>
      <TimePicker
        size="small"
        onChange={this.handleUpdate.bind(this)}
        placeholder="选择时间"
        value={this.state.value}
        />
      &nbsp;&nbsp;
      <TimePicker
        onChange={this.handleUpdate.bind(this)}
        placeholder="选择时间"
        value={this.state.value}
        />
      &nbsp;&nbsp;
      <TimePicker
        size="large"
        onChange={this.handleUpdate.bind(this)}
        placeholder="选择时间"
        value={this.state.value}
        />
    </div>
  )
}
```

:::

### TODO: 固定时间范围

若先选择开始时间，则结束时间内备选项的状态会随之改变

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    startDate: new Date(2016, 9, 10, 14, 30),
    endDate: new Date(2016, 9, 10, 15, 30)
  }
}

handleStartUpdate(startDate) {
  console.debug('time-select startDate update: ', startDate)
  this.setState({startDate})
}

handleEndUpdate(endDate){
  console.debug('time-select endDate update: ', endDate)
  this.setState({endDate})
}

render() {
  return (
    <div>
      <TimePicker
        start="08:30"
        step="00:15"
        end="18:30"
        onChange={this.handleStartUpdate.bind(this)}
        value={this.state.startDate}
        placeholder="选择时间"
        />

      <TimePicker
        start="08:30"
        step="00:15"
        end="18:30"
        onChange={this.handleEndUpdate.bind(this)}
        value={this.state.endDate}
        placeholder="选择时间"
        />
    </div>

  )
}
```

:::

### 任意时间范围

可选择任意的时间范围

### TimePicker

| 参数       | 说明               | 类型            | 可选值                | 默认值     |
| ---------- | ------------------ | --------------- | --------------------- | ---------- |
| onChange   | value 发生改变回调 | function        | —                     | -          |
| value      | 值                 | string / moment | —                     | -          |
| format     | 格式化方式         | string          | —                     | 'HH:mm:ss' |
| className  | 样式               | string          | —                     | 18:00      |
| showHour   | 是否显示小时       | boolean         | —                     | true       |
| showMinute | 是否显示分钟       | boolean         | —                     | true       |
| showSecond | 是否显示秒         | boolean         | —                     | true       |
| size       | 大小               | string          | small、default、large | default    |

## TODO:

0. format
1. clearText
1. defaultOpenValue
1. defaultValue
1. disabled
1. disabledHours
1. disabledMinutes
1. disabledSeconds
1. hideDisabledOptions
1. hourStep minuteStep secondStep
1. inputReadOnly
1. open
1. placeholder
1. popupClassName
1. onOpenChange

// NOTE: 暂不做 12 小时制
