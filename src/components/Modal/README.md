## Message box 信息提示

模拟系统的消息提示框而实现的一套模态对话框组件，用于消息提示、成功提示、错误提示、询问信息。

### 消息提示

当用户进行操作时会被触发，该对话框中断用户操作，直到用户确认知晓后才可关闭。

:::demo 调用`info`方法即可打开消息提示。值得一提的是，窗口被关闭后，它默认会返回一个`Promise`对象便于进行后续操作的处理。

```js
render() {
  return <Button link onClick={this.onClick.bind(this)}>点击打开 Message Box</Button>
}

onClick() {
    Modal.info({
        title: '这系标题',
        content: '这系内容',
        okText: 'oooo',
        onOk: () => {
            console.log('ok')
            return Promise.resolve('ok');
        }
    });
}
```

:::

### 不同大小

当用户进行操作时会被触发，该对话框中断用户操作，直到用户确认知晓后才可关闭。

:::demo 通过 `size` `props`, 设置 `large` `default` `size` 改变大小, 也可以通过 `style` 控制大小。

```js
constructor(props) {
  super(props)
  this.state = {
    visibleLarge: false,
    visibleDefault: false,
    visibleSmall: false,
  }
}

onClick(key) {
  this.setState({
    [key]: true
  })
}

handleClose(key) {
  this.setState({
    [key]: false
  })
}

render() {
  return <div>
    <Button link onClick={this.onClick.bind(this, 'visibleLarge')}>点击打开 large modal</Button>
    <Button link onClick={this.onClick.bind(this, 'visibleDefault')}>点击打开 default modal</Button>
    <Button link onClick={this.onClick.bind(this, 'visibleSmall')}>点击打开 small modal</Button>
    <Modal
      size="large"
      title="title"
      visible={this.state.visibleLarge}
      closable
      onCancel={this.handleClose.bind(this, 'visibleLarge')}>
      modal large content
    </Modal>
    <Modal
      size="default"
      title="title"
      visible={this.state.visibleDefault}
      closable
      onCancel={this.handleClose.bind(this, 'visibleDefault')}>
      modal default content
    </Modal>
    <Modal
      size="small"
      title="title"
      visible={this.state.visibleSmall}
      closable
      onCancel={this.handleClose.bind(this, 'visibleSmall')}>
      modal small content
    </Modal>
  </div>
}
```

:::

### 确认消息

提示用户确认其已经触发的动作，并询问是否进行此操作时会用到此对话框。

:::demo 调用`confirm`方法即可打开消息提示，它模拟了系统的 `confirm`。

```js
render() {
  return <Button link onClick={this.onClick.bind(this)}>点击打开 Message Box</Button>
}

onClick() {
  Modal.confirm({
      title: 'confirm title',
      content: 'confirm content',
      iconType: 'info-circle-o',
      style: {width: '300px'},
      onOk: () => console.log('ok'),
      onCancel: () => console.log('cancle'),
      onClose: () => console.log('close'),
      maskClosable: true
  });
}
```

:::

### jsx 形式调用

:::demo 通过引入 Modal 组件，在 render 中自定义内容。

```js
constructor(props) {
  super(props)
  this.state = {
    modelVisible1: false,
    modelVisible2: false,
    dataSource: [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address1: '西湖区湖底公园1号',
        time: '8:00'
      },
      {
        key: '4',
        name: '胡彦祖',
        age: 38,
        address1: '西湖区湖底公园2号',
      },
      {
        key: '5',
        name: '胡彦歌',
        age: 44,
        address1: '西湖区湖底公园3号',
        time: '10:00'
      },
    ],

    columns: [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '120px',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: '150px',
      },
      {
        title: '住址',
        dataIndex: 'address1',
        key: 'address1',
        width: '150px',
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        width: '150px',
        render: (row, index) => <Form.Item
          model={{time: row.time}}
          rules={[
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ]}
          prop="time">
          <TimePicker
            // getPopupContainer={() => document.querySelector('#mix-modal')}
            zIndex={3100}
            value={row.time}
            onChange={this.handleTimeChange.bind(this, index)} />
        </Form.Item>
      },
      {
        title: '编辑',
        dataIndex: 'edit',
        key: 'edit',
        width: '100px',
        render: (data, index) => {
          return <Button link >{data.editable ? 'save' : 'edit'}</Button>
        }
      }
    ]
  }
}

handleTimeChange(index, moment, strValue) {
  const { dataSource } = this.state
  dataSource[index].time = strValue
  this.setState({
    dataSource
  })
}

showModel(name, e) {
  console.log(e)
  this.setState({
    [name]: true
  })
  console.log("click")
}

handleCancle(name, e) {
  console.log(name, e)
  this.setState(
    Object.assign({}, this.state, {[name]: false}),
    () => {
      console.log(this.state)
    }
  )
}

handleOk(name) {
  this.setState({
    modelVisible1: true
  })
}

handleChange(value) {
  this.setState({
    value
  })
}

render() {
  return (<div>
    <Button onClick={e => this.showModel("modelVisible1", e)}>
      click 2 show model1
    </Button>
    <Button onClick={e => this.showModel("modelVisible2", e)}>
      click 2 show model2
    </Button>

    <Modal
      visible={this.state.modelVisible1}
      title="title"
      closable
      mask={false}
      onClose={e => this.handleCancle("modelVisible1", e)}
      title={<React.Fragment>11<span className="title-center">234</span></React.Fragment>}
      id="mix-modal"
      footer={false}
      onCancel={e => this.handleCancle("modelVisible1", e)}
      onOk={this.handleCancle.bind(this, "modelVisible1")}>
      <Select filterOption={false} value={this.state.value} zIndex={3500} onChange={this.handleChange.bind(this)} getPopupContainer>
        <Select.Option>123</Select.Option>
        <Select.Option>123</Select.Option>
        <Select.Option>123</Select.Option>
        <Select.Option>123</Select.Option>
        <Select.Option>123</Select.Option>
        <Select.Option>123</Select.Option>
        <Select.Option>123</Select.Option>
        <Select.Option>123</Select.Option>
        <Select.Option>123</Select.Option>
      </Select>
      <DatePicker
        getPopupContainer
        placeholder="选择日期"
        clearable
      />
      <Table
        dataSource={this.state.dataSource}
        columns={this.state.columns} />
    </Modal>

    <Modal
      visible={this.state.modelVisible2}
      title="title"
      closable
      onCancel={e => this.handleCancle("modelVisible2", e)}
      onOk={this.handleOk.bind(this, "modelVisible2")}
      style={{ width: "300px" }}>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
      <p>model content2</p>
    </Modal>
  </div>)
}
```

:::

### 自动关闭

:::demo 自动关闭已经打开的 modal

```js
showConfirm(type) {
  const dialog = Modal[type]
  const model = dialog({
    title: type,
    content: `bibibi-${type}`,
    maskClosable: true,
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve() : reject(), 1000)
      }).catch(() => console.log("Oops errors!"))
    },
    onCancel() {
      console.log("cancel")
    }
  })
  // 自动关闭
  setTimeout(() => model.destroy(), 2000)
}

render() {
  return (
    <React.Fragment>
      <Button onClick={e => this.showConfirm("confirm", e)}>
        show confirm
      </Button>

      <Button onClick={e => this.showConfirm("warning", e)}>
        show warning
      </Button>

      <Button onClick={e => this.showConfirm("info", e)}>
        show info
      </Button>

      <Button onClick={e => this.showConfirm("success", e)}>
        show success
      </Button>

      <Button onClick={e => this.showConfirm("error", e)}>
        show error
      </Button>
    </React.Fragment>
  )
}
```

:::

### TODO: 提交内容

当用户进行操作时会被触发，中断用户操作，提示用户进行输入的对话框。

:::demo 调用`prompt`方法即可打开消息提示，它模拟了系统的 `prompt`。可以用`inputPattern`字段自己规定匹配模式，或者用`inputValidator`规定校验函数，可以返回`Boolean`或`String`，`Boolean`为`false`或字符串时均表示校验未通过，`String`相当于定义了`inputErrorMessage`字段。此外，可以用`inputPlaceholder`字段来定义输入框的占位符。

```js
render() {
  return <Button link onClick={this.onClick.bind(this)}>点击打开 Message Box</Button>
}

onClick() {
  Modal.error({
      title: 'error title',
      content: 'error content'
  })
}
```

:::

### TODO: 自定义

可自定义配置不同内容。

:::

对应于上述四个全局方法的调用方法依次为：Modal, Modal.info, Modal.confirm 和 Modal.prompt。

### Options

| 参数           | 说明                       | 类型                | 可选值              | 默认值  |
| -------------- | -------------------------- | ------------------- | ------------------- | ------- |
| title          | Modal 标题                 | string              | —                   | —       |
| mask           | Modal 是否显示 mask        | string/ReactElement | —                   | —       |
| cancelText     | 取消按钮文本               | string              | —                   | 取消    |
| okText         | 确认按钮文本               | string              | —                   | 确定    |
| confirmLoading | 是否需要确认按钮 loading   | boolean             | boolean             | —       | true |
| visible        | 是否隐藏                   | boolean             | —                   | —       |
| okType         | 确认按钮 type              | string              | —                   | —       |
| onCancel       | 取消回调（可返回 Promise） | function            | —                   | -       |
| onOk           | 确认回调（可返回 Promise） | function            | —                   | —       |
| maskClosable   | 点击 mask 是否隐藏         | boolean             | —                   | true    |
| showCancel     | 是否显示取消按钮           | boolean             | —                   | true    |
| footer         | 自定义 footer              | React.node          | —                   | -       |
| size           | 弹框大小                   | string              | large/default/small | default |

### TODO:

1. lockScroll 禁止滚动
2. 按钮样式动态传入
