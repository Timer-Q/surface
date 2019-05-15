## List 列表

通用列表。最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。

### 默认样式

:::demo 用于列表数据,default上下间距是12px，左右是24px。

```js


constructor(props) {
  super(props)
  this.state = {}
  this.dataSource = [
    {
      title: <span>标题1</span>
    },
    {
      title: '标题2'
    }
  ]
  this.header = '我是Header Demo1'
  this.footer = '我是footer Demo1'
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <List
          dataSource={this.dataSource}
          header={this.header}
          footer={this.footer}
        >
        </List>
      </div>
    </div>
  )
}
```

:::

### small样式
:::demo 用于列表数据。small上下间距是8px，左右是24px。

```js


constructor(props) {
  super(props)
  this.state = {}
  this.dataSource = [
    {
      title: '标题1'
    },
    {
      title: '标题2'
    }
  ]
  this.header = '我是Header Demo2'
  this.footer = '我是footer Demo2'
  this.size = 'small'
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <List
          dataSource={this.dataSource}
          header={this.header}
          footer={this.footer}
          size={this.size}
        >
          <div className="item" style={{color: '#20a0ff'}}>不使用默认的List.item,使用自定义组件或HTMLElement</div>
        </List>
      </div>
    </div>
  )
}
```

:::

### large样式
:::demo 用于列表数据。default上下间距是16px，左右是24px。

```js


constructor(props) {
  super(props)
  this.state = {}
  this.dataSource = [
    {
      title: '标题1'
    },
    {
      title: '标题2'
    }
  ]
  this.header = '我是Header Demo3'
  this.footer = '我是footer Demo3'
  this.size = 'large'
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <List
          dataSource={this.dataSource}
          header={this.header}
          footer={this.footer}
          size={this.size}
        >
        </List>
      </div>
    </div>
  )
}
```

:::

### 无边框包裹样式
:::demo 没有最外层的边框

```js


constructor(props) {
  super(props)
  this.state = {}
  this.dataSource = [
    {
      title: '标题1'
    },
    {
      title: '标题2'
    }
  ]
  this.header = '我是Header Demo4'
  this.footer = '我是footer Demo4'
  this.bordered = false
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <List
          dataSource={this.dataSource}
          header={this.header}
          footer={this.footer}
          bordered={this.bordered}
        >
        </List>
      </div>
    </div>
  )
}
```

:::


### 缺省数据样式
:::demo 可自定义显示文案。

```js


constructor(props) {
  super(props)
  this.state = {}
  this.dataSource = []
  this.header = '我是Header Demo5'
  this.footer = '我是footer Demo5'
  this.bordered = false
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <List
          dataSource={this.dataSource}
          header={this.header}
          footer={this.footer}
          bordered={this.bordered}
        >
        </List>
      </div>
    </div>
  )
}
```

:::


### 自定义Render数据
:::demo 可自定义显示文案。

```js


constructor(props) {
  super(props)
  this.state = {}
  this.dataSource = [
    {
      render: (data, index) => {
        return (
          <div>测试render方法</div>
        )
      },
    },
    {
      title: '标题',
    }
  ]
  this.header = '我是Header Demo5'
  this.footer = '我是footer Demo5'
  this.bordered = false
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <List
          dataSource={this.dataSource}
          header={this.header}
          footer={this.footer}
          bordered={this.bordered}
        >
        </List>
      </div>
    </div>
  )
}
```

:::

### 图文样式
:::demo 用于列表数据。可以传递图片和跳转链接/锚点链接

```js


constructor(props) {
  super(props)
  this.state = {}
  this.dataSource = [
    {
      avatar: 'https://b1-q.mafengwo.net/s11/M00/95/72/wKgBEFqwbqGAeZIvAAAKZWVpk0U31.jpeg?imageMogr2%2Fthumbnail%2F%21120x120r%2Fgravity%2FCenter%2Fcrop%2F%21120x120%2Fquality%2F90',
      title: '有点击链接',
      description: 'breezy(react components) 进度/计划',
      link: 'http://www.mafengwo.cn/'
    },
    {
      avatar: 'https://b1-q.mafengwo.net/s11/M00/95/72/wKgBEFqwbqGAeZIvAAAKZWVpk0U31.jpeg?imageMogr2%2Fthumbnail%2F%21120x120r%2Fgravity%2FCenter%2Fcrop%2F%21120x120%2Fquality%2F90',
      title: '无点击链接',
      description: 'breezy(react components) 进度/计划'
    },
    {
      title: '无图片展示样式',
      description: '文案描述',
      link: 'http://www.mafengwo.cn/'
    }
  ]
  this.header = '我是Header Demo6'
  this.footer = '我是footer Demo6'
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <List
          dataSource={this.dataSource}
          header={this.header}
          footer={this.footer}
        >
        </List>
      </div>
    </div>
  )
}
```
:::

### 表格样式
:::demo 用于列表数据。样式类似于表格

```js

constructor(props) {
  super(props)
  this.state = {}
  this.dataSource = [
    {
      title: '需求单号',
      description: 'breezy(react components) 进度/计划'
    },
    {
      title: '旅游类型',
      description: '点击跳转的链接',
      link: 'http://www.mafengwo.cn'
    },
    {
      title: '出发地',
      description: '加粗文案',
      isBold: true
    },
    {
      title: '往返日期',
      description: 'breezy(react components) 进度/计划 surface商家后台组件库,供后端研发使用。只有部分自营供应商的商品才显示该“发票信息”模块，模块标题右侧显示“i”信息说明默认不勾选(即不需要保险)，显示默认提示文案：仅支持电子发票若勾选了需要发票则展示：发票明细、发票类型、发票抬头、纳税人识别号、邮箱'
    },
    [
      {
        title: '取货地址',
        description: 'breezy(react components) 进度/计划'
      },
      {
        title: '家庭住址',
        description: 'breezy(react components) 进度/计划'
      },
    ]
  ]
  this.isTableStyle = true
}

render() {
  return (
    <div className="intro-block">
      <div className="block">
        <List
          dataSource={this.dataSource}
          header={this.header}
          footer={this.footer}
          isTableStyle={this.isTableStyle}>
        </List>
      </div>
    </div>
  )
}
```
:::

### List

| 参数       | 说明               | 类型            | 可选值 | 默认值     |
| ---------- | ------------------ | --------------- | ------ | ---------- |
| dataSource | 列表数据            | array          | 必选     | []         |
| header     | 列表头部            | string          | 可选     | -         |
| footer     | 列表底部            | string          | 可选     | -         |
| locale     | 无数据时的文案       | string          | 可选     | 暂无数据(有children的时候不展现默认文案)   |
| size      | list的尺寸           | string | default large small | default |
| bordered  | 是否展示边框          | boolean         | 可选      |   true   |

### List.Item

| 参数       | 说明               | 类型            | 可选值 | 默认值     |
| ---------- | ------------------ | --------------- | ------ | ---------- |
| title       | 标题               | string          | 必选     | -         |
| avatar      | 头像/图片           | string         | 可选     | -         |
| description | 描述               | string          | 可选     | -         |
| link        | 跳转链接            | string          | 可选     | -         |
| isBold      | 字体是否加粗         | boolean         | 可选     | false    |
| isTableStyle| 是否采用表格样式      | boolean          | 可选     | false   |
| isTableArray| 表格数组            | array          | 可选     | []        |

### List.Cell

| 参数       | 说明               | 类型            | 可选值 | 默认值     |
| ---------- | ------------------ | --------------- | ------ | ---------- |
| title       | 标题               | string          | 必选     | -         |
| description | 描述               | string          | 可选     | -         |
| link        | 跳转链接            | string          | 可选     | -         |
| isBold      | 字体是否加粗         | boolean         | 可选     | false    |