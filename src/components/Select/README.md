## Select 选择器

当选项过多时，使用下拉菜单展示并选择内容。

### 基础用法

适用广泛的基础单选

:::demo `value`的值为当前被选中的`Option`的 value 属性值

```js
constructor(props) {
  super(props);

  this.state = {
    options: [],
  };
}

componentDidMount() {
  setTimeout(() => {
    this.setState({
      value: '选项3',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]
    })
  }, 2000)
}

handleChange(value) {
  console.debug('selected value: ', value)
  this.setState({
    value,
    disabled: true
  })
}

handleClear() {
  // this.ref.handleClear()
  this.setState({
    value: ''
  })
}

setRandomValue() {
  const random = parseInt(Math.random() * 5, 10) + 1
  const value = `选项${random}`
  console.debug(value)
  this.setState({
    value
  })
}

render() {
  return (
    <div>
      <Button onClick={this.handleClear.bind(this)}>clear</Button>
      <Button onClick={this.setRandomValue.bind(this)}>随机赋值</Button>
      <Select
        placeholder='请选择。。。'
        style={{width: '200px'}}
        ref={node => this.ref = node}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        onClear={this.handleClear.bind(this)}
        disabled={this.state.disabled}
        clearable
        zIndex={3000}>
        {
          this.state.options.map(el => {
            return <Select.Option key={el.value} value={el.value}>{el.label}</Select.Option>
          })
        }
      </Select>
    </div>
  )
}
```

:::

### 有禁用选项

:::demo 在`Option`中，设定`disabled`值为 true，即可禁用该选项

```js
constructor(props) {
  super(props);

  this.state = {
    options: [{
      value: 0,
      label: '黄金糕'
    }, {
      value: 1,
      label: '双皮奶',
      disabled: true
    }, {
      value: '选项3',
      label: '蚵仔煎'
    }, {
      value: '选项4',
      label: '龙须面'
    }, {
      value: '选项5',
      label: '北京烤鸭'
    }],
    value: 1
  };
}

handleChange(value) {
  this.setState({
    value
  })
}

render() {
  return (
    <Select placeholder="请选择" value={this.state.value} onChange={this.handleChange.bind(this)}>
      {
        this.state.options.map(el => {
          return <Select.Option key={el.value} value={el.value} disabled={el.disabled}>
            {el.label}
          </Select.Option>
        })
      }
    </Select>
  )
}
```

:::

### 禁用状态

选择器不可用状态

:::demo 为`Select`设置`disabled`属性，则整个选择器不可用

```js
constructor(props) {
  super(props);

  this.state = {
    options: [{
      value: '选项1',
      label: '黄金糕'
    }, {
      value: '选项2',
      label: '双皮奶'
    }, {
      value: '选项3',
      label: '蚵仔煎'
    }, {
      value: '选项4',
      label: '龙须面'
    }, {
      value: '选项5',
      label: '北京烤鸭'
    }]
  };
}

render() {
  return (
    <Select disabled={true} placeholder="请选择">
      {
        this.state.options.map(el => {
          return <Select.Option key={el.value} value={el.value}>{el.label}</Select.Option>
        })
      }
    </Select>
  )
}
```

:::

### 可清空单选

包含清空按钮，可将选择器清空为初始状态

:::demo 为`Select`设置`clearable`属性，则可将选择器清空。需要注意的是，`clearable`属性仅适用于单选。

```js
constructor(props) {
  super(props);

  this.state = {
    options: [{
      value: '选项1',
      label: '黄金糕'
    }, {
      value: '选项2',
      label: '双皮奶'
    }, {
      value: '选项3',
      label: '蚵仔煎'
    }, {
      value: '选项4',
      label: '龙须面'
    }, {
      value: '选项5',
      label: '北京烤鸭'
    }]
  };
}

handleChange(value) {
  this.setState({
    value
  })
}

handleClear() {
  this.setState({
    value: ''
  })
}

render() {
  return (
    <Select
      value={this.state.value}
      onClear={this.handleClear.bind(this)}
      onChange={this.handleChange.bind(this)}
      placeholder="请选择"
      clearable={true}>
      {
        this.state.options.map(el => {
          return <Select.Option key={el.value} value={el.value} >{el.label}</Select.Option>
        })
      }
    </Select>
  )
}
```

:::

### size && bordered

包含清空按钮，可将选择器清空为初始状态

:::demo `size` 值 可为 `default(height: 40px, fontSize: 14px)` `large(height: 50px, fontSize: 16px)` `small(height: 30px, fontSize: 12px)`

```js
constructor(props) {
  super(props);

  this.state = {
    options: [{
        "label": "出境半自助游",
        "value": 1
      },
      {
        "label": "境内跟团游",
        "value": 2
      },
      {
        "label": "出境跟团游",
        "value": 3
      },
      {
        "label": "境内半自助游",
        "value": 4
      },
      {
        "label": "出境特价机票",
        "value": 5
      },
      {
        "label": "出境自由行",
        "value": 6
      },
      {
        "label": "出境特价机票套餐",
        "value": 7
      },
      {
        "label": "境内自由行",
        "value": 8
      },
      {
        "label": "境内特价机票",
        "value": 9
      },
      {
        "label": "境内特价机票套餐",
        "value": 10
      },
      {
        "label": "我猜你不想要套餐",
        "value": 11
      }],
    bordered: true
  };
}

handleChange(value) {
  this.setState({
    value
  })
}

handleClear() {
  this.setState({
    value: ''
  })
}

handleSizeChange(size) {
  this.setState({
    size
  })
}

handleToggleBordered() {
  this.setState({
    bordered: !this.state.bordered
  })
}

render() {
  return (
    <React.Fragment>
      <Radio.Group style={{display: 'inline-block'}} onChange={this.handleSizeChange.bind(this)}>
        <Radio.Button value="large" >Large</Radio.Button>
        <Radio.Button value="default" >Default</Radio.Button>
        <Radio.Button value="small" >Small</Radio.Button>
        <Radio.Button value="tiny" >tiny</Radio.Button>
      </Radio.Group>
      <Button ghost onClick={this.handleToggleBordered.bind(this)}>toggle bordered</Button>
      <br /> <br />
      <Select
        value={this.state.value}
        onClear={this.handleClear.bind(this)}
        onChange={this.handleChange.bind(this)}
        size={this.state.size || 'default'}
        bordered={this.state.bordered}
        clearable={true}
        placeholder="请选择">
        {
          this.state.options.map(el => {
            return <Select.Option key={el.value} value={el.value} >{el.label}</Select.Option>
          })
        }
      </Select>
    </React.Fragment>
  )
}
```

:::

### 基础多选

适用性较广的基础多选，用 Tag 展示已选项

:::demo 为`Select`设置`multiple`属性即可启用多选，此时`value`的值为当前选中值所组成的数组

```js
constructor(props) {
  super(props);

  this.state = {
    options: [{
      value: '选项1',
      label: '黄金糕'
    }, {
      value: '选项2',
      label: '双皮奶'
    }, {
      value: '选项3',
      label: '蚵仔煎'
    }, {
      value: '选项4',
      label: '龙须面'
    }, {
      value: '选项5',
      label: '北京烤鸭'
    }],
    value: ['选项3']
  };
}

handleChange(value) {
  console.debug(`multiple selected value: ${value}`)
  this.setState({
    value
  })
}

handleClear() {
  this.setState({
    value: []
  })
}

render() {
  return (
    <Select
      value={this.state.value}
      mode='multiple'
      filterOption={false}
      style={{width: '200px'}}
      onChange={this.handleChange.bind(this)}
      placeholder="multiple demo"
      placeholder="请选择"
      onClear={this.handleClear.bind(this)}
      clearable>
      {
        this.state.options.map(el => {
          return <Select.Option key={el.value} value={el.value}>{el.label}</Select.Option>
        })
      }
    </Select>
  )
}
```

:::

### 自定义模板

可以自定义备选项

:::demo 将自定义的 HTML 模板插入`Option`中即可, 这种情况下需要给 `Option` `label` 属性。

```js
constructor(props) {
  super(props);

  this.state = {
    cities: [{
      value: 'Beijing',
      label: '北京'
    }, {
      value: 'Shanghai',
      label: '上海'
    }, {
      value: 'Nanjing',
      label: '南京'
    }, {
      value: 'Chengdu',
      label: '成都'
    }, {
      value: 'Shenzhen',
      label: '深圳'
    }, {
      value: 'Guangzhou',
      label: '广州'
    }]
  };
}

render() {
  return (
    <Select placeholder="请选择">
      {
        this.state.cities.map(el => {
          return (
            <Select.Option key={el.value} label={el.label} value={el.value}>
              <span style={{float: 'left'}}>{el.label}</span>
              <span style={{float: 'right', color: '#8492a6', fontSize: 13}}>{el.value}</span>
            </Select.Option>
          )
        })
      }
    </Select>
  )
}
```

:::

### 分组

备选项进行分组展示

:::demo 使用`OptionGroup`对备选项进行分组，它的`label`属性为分组名, 这种情况下需要给 `Option` `label` 属性。

```js
constructor(props) {
  super(props);

  this.state = {
    options: [{
      label: '热门城市',
      options: [{
        value: 'Shanghai',
        label: '上海'
      }, {
        value: 'Beijing',
        label: '北京'
      }]
    }, {
      label: '城市名',
      options: [{
        value: 'Chengdu',
        label: '成都'
      }, {
        value: 'Shenzhen',
        label: '深圳'
      }, {
        value: 'Guangzhou',
        label: '广州'
      }, {
        value: 'Dalian',
        label: '大连'
      }]
    }]
  };
}

render() {
  return (
    <Select placeholder="请选择">
      {
        this.state.options.map(group => {
          return (
            <Select.OptionGroup key={group.label} label={group.label}>
              {
                group.options.map(el => {
                  return (
                    <Select.Option key={el.value} label={el.label} value={el.value}>
                      <span key={el.label} style={{float: 'left'}}>{el.label}</span>
                      <span key={el.value} style={{float: 'right', color: '#8492a6', fontSize: 13}}>
                        {el.value}
                      </span>
                    </Select.Option>
                  )
                })
              }
            </Select.OptionGroup>
          )
        })
      }
    </Select>
  )
}
```

:::

### 可搜索

可以利用搜索功能快速查找选项

:::demo 为`Select`添加`filterable`属性即可启用搜索功能。默认情况下，Select 会找出所有`label`属性包含输入值的选项。如果希望使用其他的搜索逻辑，可以通过传入一个`filterMethod`来实现。`filterMethod`为一个`Function`，它会在输入值发生变化时调用，参数为当前输入值。

```js
constructor(props) {
  super(props);

  this.state = {
    options: [{
      value: '选项1',
      label: '黄金糕'
    }, {
      value: '选项2',
      label: '双皮奶'
    }, {
      value: '选项3',
      label: '蚵仔煎'
    }, {
      value: '选项4',
      label: '龙须面'
    }, {
      value: '选项5',
      label: '北京烤鸭'
    }],
    value: []
  };
}

render() {
  return (
    <Select placeholder="input" filterOption={false} filterable={true} placeholder="请选择">
      {
        this.state.options.map(el => {
          return <Select.Option key={el.value} value={el.value}>{el.label}</Select.Option>
        })
      }
    </Select>
  )
}
```

:::

### 远程搜索

从服务器搜索数据，输入关键字进行查找

:::demo 为了启用远程搜索，需要将`filterable`和`remote`设置为`true`，同时传入一个`remoteMethod`。`remoteMethod`为一个`Function`，它会在输入值发生变化时调用，参数为当前输入值。

```js
constructor(props) {
  super(props);

  this.state = {
    options: [],
    states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",   "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
    "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
  }
}

onSearch(query) {
  if (query !== '') {
    this.setState({
      loading: true
    });

    setTimeout(() => {
      this.setState({
        loading: false,
        options: this.state.states.map(item => {
          return { value: item, label: item };
        }).filter(item => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        })
      });
    }, 200);
  } else {
    this.setState({
      options: []
    });
  }
}

handleChange(value) {
  this.setState({
    value
  })
}

render() {
  return (
    <Select
      value={this.state.value}
      multiple={true}
      filterOption={false}
      getPopupContainer
      onChange={this.handleChange.bind(this)}
      onSearch={this.onSearch.bind(this)}
      placeholder="请选择">
      {
        this.state.options.map(el => {
          return <Select.Option key={el.value} value={el.value}>{el.label}</Select.Option>
        })
      }
    </Select>
  )
}
```

:::

### Select Attributes

| 属性 / 方法          | 说明                                            | 类型                                  | 默认值 / 可选值 |
| :------------------- | :---------------------------------------------- | :------------------------------------ | :-------------- |
| onBlur               | input blur 回调                                 | func                                  | -               |
| onFocus              | input focus 回调                                | func                                  | -               |
| onChange             | option 切换 回调                                | func                                  | -               |
| onSearch             | input 值改变 回调                               | func                                  | -               |
| onEnter              | 回车回调                                        | func                                  | -               |
| value                | select 的值                                     | any                                   | -               |
| defaultValue         | select 默认值                                   | any                                   | -               |
| clearable            | 是否有清除按钮                                  | bool                                  | -               |
| disabled             | 是否禁用                                        | bool                                  | -               |
| placeholder          | input 默认提示信息                              | string                                | -               |
| filterOption         | 自定义过滤方法                                  | [bool/func(inputValue, option) => {}] | true            |
| filterDisabledOption | 是否过滤掉禁用项                                | bool                                  | -               |
| addonBefore          | input 的 addonBefore                            | any                                   | -               |
| addonAfter           | input 的 addonAfter                             | any                                   | -               |
| title                | input 显示的 title                              | any                                   | -               |
| size                 | select 大小                                     | string                                | -               |
| isListenKeyboard     | 是否监听键盘事件                                | bool                                  | -               |
| onClear              | 用户点击清空按钮时回调                          | func                                  | -               |
| getPopupContainer    | 当碰到下拉选项无法滚动跟随的时候 需要用到改方法 | func                                  | -               |
| readonly             | 是否只读                                        | bool                                  | false           |

## Select 组件实现

### 实现思路

组件分析

- select 关键点是 inputValue 和 option 进行对应，通过输入 过滤出对应的 option，选中 option 的时候 inputValue 随之更新

  - getOptionsInfo(props) => getLabelFromValue(props, optionsInfo) => inputValue

  - input => change => inputValue => renderFilterOptionsFromChildren(chidren) => filteredOption

  - optionClick(option, index, event) => setState({value, inputValue, visible})

组件实现

- 页面初始化/更新，通过下面两个方法获取 将 value 与 inputValue 进行绑定

```jsx
// 将 options 转换成 type-value：{option, value, label} 的形式
static getOptionsInfo(props) {
  const options = Select.getOptionsFromChildren(props.children)
  const optionsInfo = {}
  options.forEach(option => {
    optionsInfo[getMapKey(option.props.value)] = {
      option: option,
      value: option.props.value, // option 的 value
      label: option.props.label || option.props.children // option 显示的名字
    }
  })
  this.optionsInfo = optionsInfo
  return optionsInfo
}

/**
 * 通过 Select 的 value 和 optionsInfo 获取选中的值需要显示的label
 * @param {*} props
 * @param {*} optionsInfo 包含所有 option 信息的对象
 */
static getLabelFromValue(props, optionsInfo) {
  // if (!optionsInfo) return
  const { value } = props
  let label = value
  if (value === undefined || value === null) {
    label = ""
  } else if (
    optionsInfo[getMapKey(value)] !== undefined &&
    optionsInfo[getMapKey(value)] !== null
  ) {
    label = optionsInfo[getMapKey(value)].label
  }
  return label
}
```

fiterable 过程

> onChange[Input]  
> -> inputValue[Select state] 过程变量（输入的时候）
> -> Options  
> -> onClick[Option]  
> -> optionClick[Select]
> -> selectedValue = option.props.value  
> -> onChange(selectedValue)[Select]
> -> getDerivedStateFromProps 更新 selectedValue

TODO:

1.  `multiple`
