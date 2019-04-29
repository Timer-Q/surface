## Card 卡片

将信息聚合在卡片容器中展示。

### 基础用法

包含标题，内容和操作。

:::demo

```js
render() {
  return (
        <React.Fragment>
            <p>基本 card</p>
            <Card title="card title" extra={<Popover
                popupClassName
                placement="top-start"
                title="标题"
                width="200"
                trigger="hover"
                onVisibleChange={visible => console.log(visible)}
                popupStyle={{width: "100px"}}
                content="这是一段容,这是一段容,这是一段容,这是一段容。">
                <Button link>hover 激活</Button>
            </Popover>}>
                <div>Card content</div>
                <div>Card content</div>
                <div>Card content</div>
            </Card>
            <p>只有content card</p>
            <Card>
                <div>Card content</div>
                <div>Card content</div>
                <div>Card content</div>
            </Card>
            <div style={{background: '#ddd', padding: '20px'}}>
                <p>没有 border card</p>
                <Card bordered={false} title="card title" extra={<a href="javascript:;">extra</a>}>
                    <div>Card content</div>
                    <div>Card content</div>
                    <div>Card content</div>
                </Card>
            </div>
        </React.Fragment>
  )
}
```

:::

### 卡片嵌套

:::demo

```js
render() {
  return (
        <React.Fragment>
            <Card title="card title" extra={<a href="javascript:;">extra</a>}>
                <Card title="card title" extra={<a href="javascript:;">extra</a>}>
                    撒旦法
                </Card>
            </Card>
        </React.Fragment>
  )
}
```

:::

### 卡片 tabs

:::demo

```js
constructor(props) {
    super(props)
    this.state = {
        activeKey: "tab2"
    }
}
handleTabChange(key, tab) {
    console.log(key, tab)
    this.setState({
        activeKey: key
    })
}

render() {
    const tabList = [{
        key: 'tab1',
        title: 'tab1',
        content: <p style={{padding: "10px 16px"}}>content1</p>
    }, {
        key: 'tab2',
        title: 'tab2',
        content: <p style={{padding: "10px 16px"}}>content2</p>
    }]
    const { activeKey } = this.state
    return (
        <React.Fragment>
            <Card
                bordered={false}
                tabList={tabList}
                title="card title"
                extra={<a href="javascript:;">extra</a>}
                onTabChange={this.handleTabChange.bind(this)}
                activeTabKey={activeKey}>
            </Card>
        </React.Fragment>
    )
}
```

:::

### 带图片

可配置定义更丰富的内容展示。

:::demo `contentStyle` 可以修改内容区域样式

```js
render() {
  return (
        <React.Fragment>
            <p>cover card</p>
            <Card
            title="酒店一"
            contentStyle={{height: '120px'}}
            extra={<a href="javascript:;">delete</a>}
            headType="transparent"
            cover={
                <img
                alt="example"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
            }>
                <div style={{ fontSize: '16px' }}>LAX/洛德尔贝蒙特套房酒店</div>
                <div>Baymont Inn and Suit</div>
                <div>洛杉矶国际机场</div>
            </Card>
            <Card
                title="酒店2"
                contentStyle={{height: '120px'}}
                extra={<a href="javascript:;">delete</a>}
                headType="transparent"
                cover={
                    <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                    />
                }>
                <div style={{ fontSize: '16px' }}>LAX/洛德尔贝蒙特套房酒店</div>
                <div>Baymont Inn and Suit</div>
                <div>洛杉矶国际机场</div>
            </Card>
        </React.Fragment>
  )
}
```

:::

### 自定义内容

可配置定义更丰富的内容展示。

:::demo

```js
constructor(props) {
    super(props)
    this.state = {
        formData: {
        largeInput: 'large',
        defaultInput: undefined,
        smallInput: 'small',
        checkboxValue: false,
        radioValue: false,
        checkboxOptions: [
            '马蜂什么',
            '马什么窝',
            { value: 'value', label: '什么蜂窝', disabled: true }
        ],
        checkedList: ['马蜂什么', 'value'],
        radioGroup: 'value',
        selectValue: '2',
        selectFilterableValue: ''
        },
        fileList: [
        {
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        },
        {
            uid: -2,
            name: 'yyy.png',
            status: 'done',
            url:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
        ]
    }
}

 asyncSetState(state) {
    return new Promise(resolve => {
      this.setState(state, resolve)
    })
  }

  async handleChange(name, value) {
    await this.asyncSetState({
      formData: Object.assign({}, this.state.formData, { [name]: value })
    })
  }

  handleFileChange(fileData) {
    const { fileList } = fileData
    this.asyncSetState({ fileList })
  }

render() {
  return (
        <React.Fragment>
            <p>自定义内容 card</p>
            <Card bodyStyle={{ height: 'auto' }}>
                <Input.Group size="small" mode="list">
                    <Input
                    value={this.state.formData.smallInput}
                    placeholder="请输入酒店中文名称"
                    onChange={this.handleChange.bind(this, 'smallInput')}
                    title="酒店名称（中文）:"
                    />
                    <Input
                    value={this.state.formData.smallInput}
                    placeholder="请输入酒店地址"
                    onChange={this.handleChange.bind(this, 'smallInput')}
                    title="酒店名称（中文）:"
                    />
                </Input.Group>
                <Input.Group size="small" mode="list">
                    <Input
                    value={this.state.formData.smallInput}
                    placeholder="请输入酒店中文名称"
                    onChange={this.handleChange.bind(this, 'smallInput')}
                    title="酒店名称（中文）:"
                    />
                    <Select
                    value={this.state.formData.selectFilterableValue}
                    filterable
                    onChange={this.handleChange.bind(this, 'selectFilterableValue')}
                    placeholder="请选择"
                    onSearch={value => console.log(value)}
                    title="发福蝶">
                    <Select.Option value="1111" label="LAX/洛德尔贝蒙特套房酒店">
                        <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                        <div>
                            <div>LAX/洛德尔贝蒙特套房酒店</div>
                            <div>Baymont Inn and Suites LAX/Lawndale</div>
                            <div>地址：14814 Hawthorne Boulevard</div>
                        </div>
                        <button>添加</button>
                        </div>
                    </Select.Option>
                    <Select.Option value="2222">two</Select.Option>
                    <Select.Option value="3333" disabled>
                        three
                    </Select.Option>
                    <Select.Option value="6666">six</Select.Option>
                    </Select>
                </Input.Group>
                <p>酒店图片</p>
                <Upload
                    action="//jsonplaceholder.typicode.com/posts/"
                    // onProgress={(e, file) => console.log(e, file, "onProgress")}
                    fileList={this.state.fileList}
                    onChange={this.handleFileChange}
                    maxFiles={3}
                    size="small"
                />
            </Card>
        </React.Fragment>
  )
}
```

:::

### Attributes

| 参数         | 说明                  | 类型   | 可选值 | 默认值 |
| ------------ | --------------------- | ------ | ------ | ------ |
| title        | card title            | string | —      | —      |
| extra        | card 头部额外内容     | any    | —      | -      |
| cover        | 左侧内容              | any    | —      | -      |
| style        | card 样式             | object | —      | -      |
| bodyStyle    | body 样式             | object | —      | -      |
| coverStyle   | cover 样式            | object | —      | -      |
| contentStyle | 内容区域 样式         | object | —      | -      |
| tabs         | tabs 配置 参考 `Tabs` | object | —      | -      |
