## DatePicker 日期选择器

用于选择或输入日期

### 选择日

以「日」为基本单位，基础的日期选择控件

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    value2: '',
    value3: '2019-01-01',
  }
}

handleClear(key) {
  this.setState({
    [key]: []
  })
}

render() {
  const { value1, value2, value3 } = this.state

  return (
    <div className="source">
      <div className="block">
        <p>默认 值为空</p>
        <DatePicker
          defaultValue=""
          placeholder="选择日期"
          clearable
          onClear={this.handleClear.bind(this, 'value2')}
          onChange={(date, strDate)=>{
            console.debug('DatePicker2 changed: ', date, strDate)
            this.setState({value2: date})
          }}
        />
        <p>禁用</p>
        <DatePicker
          defaultValue={value3}
          disabled
          placeholder="选择日期"
          onChange={(date, strDate)=>{
            console.debug('DatePicker2 changed: ', date, strDate)
            this.setState({value3: date})
          }}
        />
        <p>disable</p>
        <DatePicker
          placeholder="选择日期"
          onChange={(date, strDate)=>{
            console.debug('DatePicker2 changed: ', date, strDate)
            this.setState({value2: date})
          }}
          disabledDate={date => {
            return date.valueOf() < Date.now() - 8.64e7
          }}
        />
      </div>
    </div>
  )
}
```

:::

### date-time-picker

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    value: '2018-12-07 14:55:01'
  }
  setTimeout(() => {
    this.setState({
      value: '2018-12-07 00:00:00'
    }, () => console.log(this.state.value))
    
  }, 2000)
}

handleClear(key) {
  this.setState({
    [key]: ""
  })
}

render() {
  const { value } = this.state

  return (
    <div className="source">
      <div className="block">
        <p>选择时间</p>
        <DatePicker
          value={value}
          placeholder="选择日期"
          showTime={{defaultValue: '00:00:00'}}
          format="YYYY-MM-DD HH:mm:ss"
          onClear={this.handleClear.bind(this, 'value')}
          getPopupContainer
          onChange={(date, strDate)=>{
            console.debug('DatePicker multiple changed: ', date, strDate)
            this.setState({value: date})
          }}
          />
      </div>
    </div>
  )
}
```

:::

### date-time-picker

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    value: '2018-12-07 14:55:01'
  }
}

handleClear(key) {
  this.setState({
    [key]: ""
  })
}

render() {
  const { value } = this.state

  return (
    <div className="source" style={{height: '200px', overflow: 'auto'}}>
      <div id="picker-content" className="block" style={{height: '500px', position: 'relative'}}>
        <p>选择时间</p>
        <DatePicker
          defaultValue={value}
          placeholder="选择日期"
          showTime={true}
          format="YYYY-MM-DD HH:mm:ss"
          onClear={this.handleClear.bind(this, 'value')}
          getPopupContainer={() => document.querySelector('#picker-content')}
          onChange={(date, strDate)=>{
            console.debug('DatePicker multiple changed: ', date, strDate)
            this.setState({value: date})
          }}
          />
      </div>
    </div>
  )
}
```

:::

### 多选

以「日」为基本单位，基础的日期选择控件

:::demo

```js
constructor(props) {
  super(props)
  this.state = {
    value: ['2018-12-07', '2018-12-03']
  }
}

handleClear(key) {
  this.setState({
    [key]: []
  })
}

render() {
  const { value } = this.state

  return (
    <div className="source">
      <div className="block">
        <p>多选</p>
        <DatePicker
          value={value}
          placeholder="选择日期"
          mode="multiple"
          onClear={this.handleClear.bind(this, 'value')}
          onChange={(date, strDate)=>{
            console.debug('DatePicker multiple changed: ', date, strDate)
            this.setState({value: date})
          }}
          />
      </div>
    </div>
  )
}
```

:::

### 平铺

以「日」为基本单位，基础的日期选择控件

:::demo 基本单位由`type`属性指定

```js
constructor(props) {
  super(props)
  this.state = {
    value: ['2018-10-01'],
  }
}

render() {
  const { value } = this.state

  return (
    <div className="source">
      <div className="block">
        <p>默认</p>
        <DatePicker.FullDatePicker
          defaultValue={value}
          mode="multiple"
          dateRender={(date) => {
            if (date.day() === 6) {
              return <a href="javascript:;">{<span>{date.date()} 药药切克闹</span>}</a>
            }
            return date.date()
          }}
          onChange={(date, strDate)=>{
            console.debug('DatePicker1 changed: ', date)
            this.setState({value: date})
          }}
          disabledDate={date => {
            return date.valueOf() < Date.now() - 8.64e7
          }}
          />
      </div>
    </div>
  )
}
```

:::

### TODO: 其他日期单位

通过扩展基础的日期选择，可以选择周、月、年

:::demo

```js
constructor(props) {
  super(props)
  this.state = {}
}

render() {
  const {value1, value2, value3} = this.state

  return (
    <div className="source">
      <div className="block">
        <p>月</p>
        <DatePicker
          value={value2}
          placeholder="选择月"
          onChange={date=>{
            console.debug('month DatePicker changed: ', date)
            this.setState({value2: date})
          }}
          selectionMode="month"
          />
      </div>
      <div className="block">
        <p>年</p>
        <DatePicker
          value={value3}
          placeholder="选择年"
          onChange={date=>{
            console.debug('year DatePicker changed: ', date)
            this.setState({value3: date})
          }}
          selectionMode="year"
          align="right"
          />
      </div>
    </div>
  )
}
```

:::

### 公共参数

| 参数           | 说明                 | 类型           | 可选值                                                   | 默认值     |
| -------------- | -------------------- | -------------- | -------------------------------------------------------- | ---------- |
| placeholder    | 占位内容             | string         | —                                                        | —          |
| format         | 时间日期格式化       | string         | 年 `YYYY`，月 `MM`，日 `dd`，小时 `HH`，分 `mm`，秒 `ss` | YYYY-MM-dd |
| disabled       | 是否是禁用           | boolean        | -                                                        | false      |
| onChange       | 选择日期后的回调     | function       | -                                                        | -          |
| className      | input 的样式名       | string         | -                                                        | -          |
| style          | input 的样式         | object         | -                                                        | -          |
| popupClassName | popup 的样式名       | string         | -                                                        | -          |
| popupStyle     | popup 的样式         | object         | -                                                        | -          |
| clearable      | 清除按钮             | boolean        | -                                                        | false      |
| onClear        | 清除回调             | function       | -                                                        | -          |
| dateRender     | 自定义 date 渲染内容 | function       | -                                                        | -          |
| showTime       | 是否显示时间         | boolean/object | -                                                        | false      |
| size           | 输入框大小           | string         | [small/default/large]                                    | default    |

## 日期格式化思路

> moment.js 里面有个方法 toObject() 这就很舒服了（造个 moment 的轮子？）

> DatePicker: defaultValue -> format -> setState(dateValue) -> onChange -> dateObject -> format

> DatePickerBase: defaultSelected -> toObject -> setState(selectedDay)
