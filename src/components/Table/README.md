## Table 表格

用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。

TODO:

1. columns 扩充（align、className、sorter）
2. rowSelection 扩充
3. ~~size~~
4. footer
5. ~~pagination~~
6. ~~expanded~~
7. ~~column fix~~
8. ~~edit~~
9. ~~colspan~~
10. sort
11. loading

### 基础用法

基础的表格展示用法。

:::demo 当 Table 元素中注入`data`和`columns` 对象数组后，在`column`中用`prop`属性来对应对象中的键名即可填入数据，用`label`属性来定义表格的列名。可以使用`width`属性来定义列宽。

```js
constructor(props) {
  super(props)
  this.state = {
    selectedKeys: [],
    columns: [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => (a.id - b.id),
        sortOrder: 'ascend',
        onHeaderCell: () => ({style: {maxWidth: "50px"}}),
        onCell: () => ({style: {maxWidth: "50px"}}),
        headerRender: (thData, index) => {
          return <span>{thData}哎吆，不错奥</span>
        }
      },
      {
        title: 'title',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => (a.title.length - b.title.length),
        width: "120px",
        defaultSortOrder: 'ascend',
      },
      {
        title: 'ota_name',
        dataIndex: 'ota_name',
        sorter: true,
        key: 'ota_name',
      },
      {
        title: 'sales_type_name',
        dataIndex: 'sales_type_name',
        key: 'sales_type_name'
      },
      {
        title: 'way_type_name',
        dataIndex: 'way_type_name',
        key: 'way_type_name'
      },
    ]
  }
  this.dataSource = [{
      "id":77458,
      "title":"游船票出行模版",
      "scope":"sales",
      "sales_type":95,
      "way_type":1,
      "ota_id":959,
      "is_single_fill":1,
      "del":0,
      "mtime":"2018-09-05 16:04:31",
      "ctime":"2018-09-05 16:04:31",
      "is_allow_delay":0,
      "ota_name":"蚂蜂窝test（平台供应商）",
      "sales_type_name":"游船票",
      "way_type_name":"出行人信息",
      "scope_name":"平台"
  },
  {
      "id":77455,
      "title":"通票/年票出行模版",
      "scope":"sales",
      "sales_type":94,
      "way_type":1,
      "ota_id":959,
      "is_single_fill":1,
      "del":0,
      "mtime":"2018-09-05 16:03:32",
      "ctime":"2018-09-05 16:03:32",
      "is_allow_delay":0,
      "ota_name":"蚂蜂窝test（平台供应商）",
      "sales_type_name":"通票/年票",
      "way_type_name":"出行人信息",
      "scope_name":"平台"
  },
  {
      "id":77452,
      "title":"滑雪票出行模版",
      "scope":"sales",
      "sales_type":93,
      "way_type":1,
      "ota_id":959,
      "is_single_fill":1,
      "del":0,
      "mtime":"2018-09-05 16:02:38",
      "ctime":"2018-09-05 16:02:38",
      "is_allow_delay":0,
      "ota_name":"蚂蜂窝test（平台供应商）",
      "sales_type_name":"滑雪票",
      "way_type_name":"出行人信息",
      "scope_name":"平台"
  },
  {
      "id":77449,
      "title":"游乐园出行模版",
      "scope":"sales",
      "sales_type":91,
      "way_type":1,
      "ota_id":959,
      "is_single_fill":1,
      "del":0,
      "mtime":"2018-09-05 16:01:37",
      "ctime":"2018-09-05 16:01:37",
      "is_allow_delay":0,
      "ota_name":"蚂蜂窝test（平台供应商）",
      "sales_type_name":"游乐园",
      "way_type_name":"出行人信息",
      "scope_name":"平台"
  },
  {
      "id":77446,
      "title":"温泉票模版",
      "scope":"sales",
      "sales_type":92,
      "way_type":1,
      "ota_id":959,
      "is_single_fill":1,
      "del":0,
      "mtime":"2018-09-05 14:36:37",
      "ctime":"2018-09-05 14:36:37",
      "is_allow_delay":0,
      "ota_name":"蚂蜂窝test（平台供应商）",
      "sales_type_name":"温泉票",
      "way_type_name":"出行人信息",
      "scope_name":"平台"
  },
  {
      "id":77440,
      "title":"new境内半自助游",
      "scope":"sales",
      "sales_type":36,
      "way_type":1,
      "ota_id":959,
      "is_single_fill":1,
      "del":0,
      "mtime":"2018-09-04 14:20:08",
      "ctime":"2018-09-04 14:20:08",
      "is_allow_delay":1,
      "ota_name":"蚂蜂窝test（平台供应商）",
      "sales_type_name":"境内半自助游",
      "way_type_name":"出行人信息",
      "scope_name":"平台"
  },
  {
      "id":77437,
      "title":"出境自由行",
      "scope":"sales",
      "sales_type":3,
      "way_type":1,
      "ota_id":959,
      "is_single_fill":1,
      "del":0,
      "mtime":"2018-09-04 13:46:40",
      "ctime":"2018-09-04 13:46:40",
      "is_allow_delay":1,
      "ota_name":"蚂蜂窝test（平台供应商）",
      "sales_type_name":"自由行",
      "way_type_name":"出行人信息",
      "scope_name":"平台"
  },
  {
      "id":77434,
      "title":"测试展览",
      "scope":"sales",
      "sales_type":13,
      "way_type":1,
      "ota_id":959,
      "is_single_fill":0,
      "del":0,
      "mtime":"2018-09-04 10:10:19",
      "ctime":"2018-09-04 10:10:19",
      "is_allow_delay":1,
      "ota_name":"蚂蜂窝test（平台供应商）",
      "sales_type_name":"演出展览",
      "way_type_name":"出行人信息",
      "scope_name":"平台"
  },
  {
      "id":77431,
      "title":"测试spa",
      "scope":"sales",
      "sales_type":47,
      "way_type":1,
      "ota_id":959,
      "is_single_fill":0,
      "del":0,
      "mtime":"2018-09-03 15:46:33",
      "ctime":"2018-09-03 15:46:33",
      "is_allow_delay":1,
      "ota_name":"蚂蜂窝test（平台供应商）",
      "sales_type_name":"SPA/按摩",
      "way_type_name":"出行人信息",
      "scope_name":"平台"
  },
  {
      "id":77428,
      "title":"测试二日游",
      "scope":"sales",
      "sales_type":61,
      "way_type":1,
      "ota_id":959,
      "is_single_fill":0,
      "del":0,
      "mtime":"2018-09-03 15:04:14",
      "ctime":"2018-09-03 15:04:14",
      "is_allow_delay":0,
      "ota_name":"蚂蜂窝test（平台供应商）",
      "sales_type_name":"二日游",
      "way_type_name":"出行人信息",
      "scope_name":"平台"
  }]


}

handleSelectedChange(selectedKeys, selectedRow) {
  console.log(selectedKeys, selectedRow)
  this.setState({
    selectedKeys
  })
}

handleSortChange(column, index, sorter) {
  const { columns } = this.state
  columns[index].sortOrder = sorter
  console.log(column)
  this.setState({
    columns
  })
}

render() {
  return (
    <React.Fragment>
      <Table
        pagination={false}
        style={{marginTop: '10px'}}
        bordered
        dataSource={this.dataSource}
        columns={this.state.columns}
        onSortChange={this.handleSortChange.bind(this)} />
    </React.Fragment>
  )
}
```

:::

### 带有 checkbox 列

第一列是联动的选择框

:::demo 传入 `rowSelection` props，控制列表项是否可选择；
`valueKey` 为获取 `checkbox` `value` 的键, 默认为 `key`；
`getCheckboxProps`方法的返回值将作为 `checkbox` 的 `props`, 参数为某一行的数据和 index。

```js
constructor(props) {
  super(props)
  this.state = {
    selectedKeys: ['1']
  }
  this.dataSource = [
    {
      id: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    },
    {
      id: '2',
      name: '胡彦祖',
      age: 28,
      address: '西湖区湖底公园1号'
    },
    {
      id: '3',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      id: '4',
      name: '胡彦祖',
      age: 18,
      address: '西湖区湖底公园1号'
    }
  ]

  this.columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '120px'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: '150px'
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address'
    }
  ]
}

handleSelectedChange(selectedKeys, selectedRow) {
  console.log(selectedKeys, selectedRow)
  this.setState({
    selectedKeys
  })
}

render() {
  const rowSelection = {
    selectedRowKeys: this.state.selectedKeys,
    onChange: this.handleSelectedChange.bind(this),
    getCheckboxProps: (data, index) => ({disabled: data.age > 32 || index === 0}),
    valueKey: 'id'
  }
  return (
    <React.Fragment>
      <Table rowSelection={rowSelection} dataSource={this.dataSource} columns={this.columns} />
    </React.Fragment>
  )
}
```

:::

### 固定表头

表头固定

:::demo 传入 `scroll` props, 设置列表项是否可滚动

```js
constructor(props) {
  super(props)
  this.state = {
    selectedKeys: [],
    dataSource: [{
      key: '1',
      name: '胡彦发',
      age: 66,
      address: 'surface'
    },
    {
      key: '10',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    },]
  }
  this.dataSource = [
    {
      key: '0',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '3',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '4',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '5',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    },
  ]

  this.columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '120px'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: '150px'
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address'
    }
  ]
}

handleSelectedChange(selectedKeys, selectedRow) {
  console.log(selectedKeys, selectedRow)
  this.setState({
    selectedKeys
  })
}

handleChangeRosData() {
  this.setState({
    dataSource: this.dataSource,
    selectedKeys: []
  })
}

render() {
  const rowSelection = {
    selectedRowKeys: this.state.selectedKeys,
    onChange: this.handleSelectedChange.bind(this),
    getCheckboxProps: (data, index) => ({disabled: data.age <= 32 || index === 0})
  }
  return (
    <React.Fragment>
      <Button onClick={this.handleChangeRosData.bind(this)}>change rowsData</Button>
      <Table
        scroll={{y: 240}}
        rowSelection={rowSelection}
        dataSource={this.state.dataSource}
        columns={this.columns} />
    </React.Fragment>
  )
}
```

:::

### onRow 行处理事件

通过 `onRow` 参数对单元格的行进行处理

:::demo 通过 `onRow` 参数对单元格的行进行处理，`onRow` 为 function，接收 `rowData`(当前行的数据) 和 `index`(当前行的 index)，返回 `{onClick: () => {}, onMouseEnter: () => {}, ...}`, 返回的事件名称为 React 识别事件名称。`onRow`的返回值中可以添加 `className` 和 `style`。

```js
constructor(props) {
  super(props)
  this.state = {
    selectedKeys: []
  }
  this.dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address1: '西湖区湖底公园1号'
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address2: '西湖区湖底公园1号'
    },
    {
      key: '3',
      name: '胡彦祖',
      age: 42,
      address3: '西湖区湖底公园1号'
    },
    {
      key: '4',
      name: '胡彦祖',
      age: 42,
      address1: '西湖区湖底公园1号'
    },
    {
      key: '5',
      name: '胡彦祖',
      age: 42,
      address2: '西湖区湖底公园1号'
    },
  ]

  this.columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '120px'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: '150px'
    },
    {
      title: '住址',
      dataIndex: 'address1',
      key: 'address1',
      width: '150px'
    },
    {
      title: '住址',
      dataIndex: 'address2',
      key: 'address2',
      width: '150px'
    },
    {
      title: '住址',
      dataIndex: 'address3',
      key: 'address3',
      width: '150px'
    }
  ]
}

handleSelectedChange(selectedKeys, selectedRow) {
  console.log(selectedKeys, selectedRow)
  this.setState({
    selectedKeys
  })
}

handleMouseEnter() {
  console.log('hhhenter')
}

render() {
  const rowSelection = {
    selectedRowKeys: this.state.selectedKeys,
    onChange: this.handleSelectedChange.bind(this)
  }

  const onRow = (row, index) => {
    return {
      onClick: () => console.log(row, index),
      // onMouseEnter: () => console.log(row, index, 'enter')
    }
  }

  return (
    <React.Fragment>
      <Table
        onRow={onRow}
        scroll={{x: 1300, y: 240}}
        rowSelection={rowSelection}
        dataSource={this.dataSource}
        columns={this.columns} />
    </React.Fragment>
  )
}
```

:::

### fixed 列

通过 `onRow` 参数对单元格的行进行处理

:::demo 通过 `onRow` 参数对单元格的行进行处理，`onRow` 为 function，接收 `rowData`(当前行的数据) 和 `index`(当前行的 index)，返回 `{onClick: () => {}, onMouseEnter: () => {}, ...}`, 返回的事件名称为 React 识别事件名称。`onRow`的返回值中可以添加 `className` 和 `style`。

```js
constructor(props) {
  super(props)
  this.state = {
    selectedKeys: []
  }
  this.dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address1: '西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号'
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address2: '西湖区湖底公园1号'
    },
    {
      key: '3',
      name: '胡彦祖',
      age: 42,
      address3: '西湖区湖底公园1号'
    },
    {
      key: '4',
      name: '胡彦祖',
      age: 42,
      address1: '西湖区湖底公园1号'
    },
    {
      key: '5',
      name: '胡彦祖',
      age: 42,
      address2: '西湖区湖底公园1号'
    },
  ]

  this.columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '120px',
      fixed: true
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: '120px',
    },
    {
      title: '住址1',
      dataIndex: 'address1',
      key: 'address1',
    },
    {
      title: '住址2',
      dataIndex: 'address2',
      key: 'address2',
      width: '120px',
    },
    {
      title: '住址3',
      dataIndex: 'address3',
      key: 'address3',
      width: '150px'
    }
  ]
}

handleSelectedChange(selectedKeys, selectedRow) {
  console.log(selectedKeys, selectedRow)
  this.setState({
    selectedKeys
  })
}

handleMouseEnter() {
  console.log('hhhenter')
}

render() {
  const rowSelection = {
    selectedRowKeys: this.state.selectedKeys,
    onChange: this.handleSelectedChange.bind(this)
  }

  const onRow = (row, index) => {
    return {
      onClick: () => console.log(row, index),
      // onMouseEnter: () => console.log(row, index, 'enter')
    }
  }

  return (
    <React.Fragment>
      <Table
        onRow={onRow}
        scroll={{x: '130%', y: '240px'}}
        dataSource={this.dataSource}
        columns={this.columns} />
    </React.Fragment>
  )
}
```

:::

### 单元格可编辑

通过 `onRow` 参数对单元格的行进行处理, 单个单元格编辑的例子 请参考 [单个单元格编辑](https://codesandbox.io/s/p3p4jn829x) 的 `TableDemo.js`、`Cell.js`、 `style.scss`

:::demo 通过 `onRow` 参数对单元格的行进行处理，`onRow` 为 function，接收 `rowData`(当前行的数据) 和 `index`(当前行的 index)，返回 `{onClick: () => {}, onMouseEnter: () => {}, ...}`, 返回的事件名称为 React 识别事件名称。`onRow`的返回值中可以添加 `className` 和 `style`。

```js
constructor(props) {
  super(props)
  this.state = {
    selectedKeys: [],
    dataSource: [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address1: '西湖区湖底公园1号'
      },
      {
        key: '4',
        name: '胡彦祖',
        age: 38,
        address1: '西湖区湖底公园2号'
      },
      {
        key: '5',
        name: '胡彦歌',
        age: 44,
        address1: '西湖区湖底公园3号'
      },
    ],

    columns: [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '120px',
        render: this.renderEditable.bind(this, 'name')
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: '150px',
        render: this.renderEditable.bind(this, 'age')
      },
      {
        title: '住址',
        dataIndex: 'address1',
        key: 'address1',
        width: '150px'
      },
      {
        title: '编辑',
        dataIndex: 'edit',
        key: 'edit',
        width: '100px',
        render: (data, index) => {
          return <Button link onClick={this.setEditable.bind(this, index)}>{data.editable ? 'save' : 'edit'}</Button>
        }
      }
    ]
  }
}

renderEditable(key, data, index) {
  return data.editable ? (
            <Input
              size="small"
              value={data[key]}
              onChange={this.handleChangeSourceData.bind(this, data, index, key)}
              onPressEnter={this.setEditable.bind(this, index)}
            />
          ) : (
            <span onClick={this.setEditable.bind(this, index)}>{data[key]}</span>
          )
}

handleChangeSourceData(data, index, key, value) {
  const { dataSource } = this.state
  dataSource[index][key] = value
  this.setState({
    dataSource
  })
}

setEditable(index) {
  const { dataSource } = this.state
  const editable = dataSource[index].editable
  dataSource[index].editable = !editable
  this.setState({
    dataSource
  })
}

handleSelectedChange(selectedKeys, selectedRow) {
  console.log(selectedKeys, selectedRow)
  this.setState({
    selectedKeys
  })
}

render() {
  const rowSelection = {
    selectedRowKeys: this.state.selectedKeys,
    onChange: this.handleSelectedChange.bind(this)
  }

  const { dataSource, columns } = this.state

  return (
    <React.Fragment>
      <Table
        scroll={{y: 200}}
        rowSelection={rowSelection}
        dataSource={dataSource}
        columns={columns} />
    </React.Fragment>
  )
}
```

:::

### 分页

基础的表格展示用法。

:::demo 使用 `pagination` 属性可以在表格中使用分页；`pagination` 默认值为 `true`，也可以传入 `object` 类型的值，具体的值 参照 `Pagination` 组件

```js
constructor(props) {
  super(props)
  this.state = {
    selectedKeys: [],
    total: 50,
    current: 2
  }

  this.columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      sorter: true
    }
  ]

  this.dataSource = Array.from({length: 47}, (item, i) => {
    return {
      key: `${i + 1}`,
      name: `Edward King ${i + 1}`,
      age: 32,
      address: `London, Park Lane no. ${i + 1}`,
    }
  })
}

handleSelectedChange(selectedKeys, selectedRow) {
  console.log(selectedKeys, selectedRow)
  this.setState({
    selectedKeys
  })
}

handlePaginationChange(current) {
  this.setState({
    current
  })
}

changeTotal() {
  this.setState({
    total: 10
  })
}

render() {
  const rowSelection = {
    selectedRowKeys: this.state.selectedKeys,
    onChange: this.handleSelectedChange.bind(this)
  }
  const {current, total} = this.state
  return (
    <React.Fragment>
      <Button onClick={this.changeTotal.bind(this)}>change total</Button>
      <Table
        pagination={true}
        rowSelection={rowSelection}
        style={{marginTop: '10px'}}
        bordered
        dataSource={this.dataSource}
        columns={this.columns} />
    </React.Fragment>
  )
}
```

:::

### 展开 展开按钮在行首

基础的表格展示用法。

:::demo 通过设置 `expandedRow` 属性，实现展开行功能，`expandedRow` 类型为 `function` 或者 `{showExpandButton, render(){}}`,

```js
constructor(props) {
  super(props)
  this.state = {
    selectedKeys: []
  }

  this.columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
    }
  ]

  this.dataSource = Array.from({length: 45}, (item, i) => {
    return {
      key: `${i}`,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    }
  })
}

handleSelectedChange(selectedKeys, selectedRow) {
  console.log(selectedKeys, selectedRow)
  this.setState({
    selectedKeys
  })
}

handlePaginationChange(current) {
  console.log(current)
}

renderExpend(row) {
  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', key: 'state', render: () => <span>Finished</span> },
    { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: () => (
        <span className="table-operation">
          <a href="javascript:;">Pause</a>
          <a href="javascript:;">Stop</a>
          <a href="javascript:;">
            More <Icon type="down" />
          </a>
        </span>
      ),
    },
  ];

  const data = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      date: '2014-12-24 23:12:00',
      name: 'This is production name',
      upgradeNum: 'Upgraded: 56',
    });
  }
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
}

render() {
  const rowSelection = {
    selectedRowKeys: this.state.selectedKeys,
    onChange: this.handleSelectedChange.bind(this)
  }
  return (
    <React.Fragment>
      <Table
        expandedRow={this.renderExpend}
        pagination={{current: 3, pageSize: 10, hidePagination: true, onChange: this.handlePaginationChange}}
        rowSelection={rowSelection}
        style={{marginTop: '10px'}}
        dataSource={this.dataSource}
        columns={this.columns} />
    </React.Fragment>
  )
}
```

:::

### 展开 展开按钮在自定义位置

基础的表格展示用法。

:::demo 通过设置 `expandedRow` 属性，实现展开行功能，`expandedRow` 类型为 `function` 或者 `{showExpandButton, render(){}}`,

```js
constructor(props) {
  super(props)
  this.state = {
    selectedKeys: [],
    dataSource: Array.from({length: 45}, (item, i) => {
      return {
        key: `${i}`,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
      }
    })
  }

  this.columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      render: this.renderExpandedButton.bind(this)
    }
  ]
}

handleSelectedChange(selectedKeys, selectedRow) {
  console.log(selectedKeys, selectedRow)
  this.setState({
    selectedKeys
  })
}

handlePaginationChange(current) {
  console.log(current)
}

handleExpandedRow(rowData, currentIndex, index) {
  console.log(rowData, currentIndex, index)
  const {dataSource} = this.state
  dataSource[index].expanded = !dataSource[index].expanded
  this.setState({
    dataSource
  })
}

renderExpandedButton(rowData, currentIndex, index) {
  return <Button link onClick={this.handleExpandedRow.bind(this, rowData, currentIndex, index)} >
            展开
          </Button>
}

renderExpend(row, index) {
  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', key: 'state', render: () => <span>Finished</span> },
    { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: (rowData, index) => (
        <span className="table-operation">
          <Button link href="javascript:;">more</Button>
        </span>
      ),
    },
  ];

  const data = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      date: '2014-12-24 23:12:00',
      name: 'This is production name',
      upgradeNum: 'Upgraded: 56',
    });
  }
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
}

render() {
  const rowSelection = {
    selectedRowKeys: this.state.selectedKeys,
    onChange: this.handleSelectedChange.bind(this)
  }
  return (
    <React.Fragment>
      <Table
        expandedRow={{showExpandButton: false, render: this.renderExpend}}
        pagination={{current: 3, pageSize: 5, onChange: this.handlePaginationChange}}
        rowSelection={rowSelection}
        style={{marginTop: '10px'}}
        dataSource={this.state.dataSource}
        columns={this.columns} />
    </React.Fragment>
  )
}
```

:::

### 合并单元格

基础的表格展示用法。

:::demo 通过设置 `expandedRow` 属性，实现展开行功能，`expandedRow` 类型为 `function` 或者 `{showExpandButton, render(){}}`,

```js
constructor(props) {
  super(props)
  this.state = {
    selectedKeys: [],
    dataSource: Array.from({length: 45}, (item, i) => {
      return {
        key: `${i}`,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
      }
    })
  }

  this.columns = [{
    title: 'Name',
    dataIndex: 'name',
    render: (text, row, index) => {
      if (index < 4) {
        return <a href="javascript:;">{text.name}</a>;
      }
      return {
        children: <a href="javascript:;">{text.name}</a>,
        props: {
          colSpan: 5,
        },
      };
    },
  }, {
    title: 'Age',
    dataIndex: 'age',
    render: this.renderContent.bind(this, 'age'),
  }, {
    title: 'Home phone',
    colSpan: 2,
    dataIndex: 'tel',
    render: (value, row, index) => {
      const obj = {
        children: value.tel,
        props: {},
      };
      if (index === 2) {
        obj.props.rowSpan = 2;
      }
      // These two are merged into above cell
      if (index === 3) {
        obj.props.rowSpan = 0;
      }
      if (index === 4) {
        obj.props.colSpan = 0;
      }
      return obj;
    },
  }, {
    title: 'Phone',
    colSpan: 0,
    dataIndex: 'phone',
    render: this.renderContent.bind(this, 'phone'),
  }, {
    title: 'Address',
    dataIndex: 'address',
    render: this.renderContent.bind(this, 'address'),
  }];
  this.data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    tel: '0571-22098909',
    phone: 18889898989,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    tel: '0571-22098333',
    phone: 18889898888,
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'Sidney No. 1 Lake Park',
  }, {
    key: '4',
    name: 'Jim Red',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'London No. 2 Lake Park',
  }, {
    key: '5',
    name: 'Jake White',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'Dublin No. 2 Lake Park',
  }];
}

renderContent(key, value, row, index) {
  const obj = {
    children: value[key],
    props: {},
  };
  if (index === 4) {
    obj.props.colSpan = 0;
  }
  return obj;
};

render() {
  return (
    <Table bordered dataSource={this.data} columns={this.columns} />
  )
}
```

:::

### Table Attributes

| 参数              | 说明                                                | 类型            | 可选值                                             | 默认值  |
| ----------------- | --------------------------------------------------- | --------------- | -------------------------------------------------- | ------- |
| columns           | 表格列的配置描述                                    | array           | —                                                  | —       |
| dataSource        | 数据数组                                            | array           | —                                                  | —       |
| onRow             | 设置行属性                                          | function        | (rowData) => {onClick(){}, onXXX(){}}              | —       |
| scroll            | 设置横向或纵向滚动，指定滚动区域的宽和高            | object          | -                                                  | —       |
| rowSelection      | 列表项是否可选择                                    | object          | {selections, onChange }                            | —       |
| pagination        | 分页功能(配置参照[Pagination](/#/zh-CN/pagination)) | boolean/object  | true/false/{current, hidePagination...}            | true    |
| expandedRow       | 展开功能                                            | function/object | (rowData){}/{render:(rowData){}, showExpandButton} | -       |
| showExpandedIndex | 展开是否缩进                                        | boolean         | true/false                                         | false   |
| showHeader        | 是否展示表头                                        | boolean         | true / false                                       | true    |
| size              | 表格大小                                            | string          | [small/default/large]                              | default |

### columns

| 参数             | 说明                                                                    | 类型             | 可选值                                | 默认值 |
| ---------------- | ----------------------------------------------------------------------- | ---------------- | ------------------------------------- | ------ |
| dataIndex        | 该列数据对应的 key 值                                                   | string           | —                                     | —      |
| title            | 该列数据表头显示名称                                                    | string           | —                                     | —      |
| render           | 渲染该列单元格时候的回调方法, 可自定义渲染内容，合并单元格等            | function         | (rowData, index) => {children, props} | —      |
| headerRender     | 渲染该列表头时候的回调方法, 可自定义渲染内容                            | function         | (title), index) => ()                 | —      |
| onHeaderCell     | 渲染该列表头时候定义单元格回调方法                                      | function         | (rowData) => {onClick(){}, onXXX(){}} | —      |
| onCell           | 渲染该列单元格时候定义单元格回调方法                                    | function         | (rowData) => {onClick(){}, onXXX(){}} | —      |
| sorter           | 排序函数 参考 Array.prototype.sort, 若为 true，可自定义排序             | function/boolean | -                                     | —      |
| sortOrder        | 排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend'     | string           | -                                     | —      |
| defaultSortOrder | 默认排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend' | string           | -                                     | —      |
