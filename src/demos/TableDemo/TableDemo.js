import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'components'
import Cell from './Cell'
import './style.scss'

export default class TableDemo extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedKeys: [],
      dataSource: [
        {
          key: '1',
          name: '胡彦斌',
          age: 32,
          address1: '西湖区湖底公园1号',
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
        },
      ],

      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: '120px',
          render: row => (
            <Cell
              handleSave={this.handleSave}
              columnKey="name"
              editable={true}
              row={row}
            />
          ),
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
          width: '150px',
          editable: true,
        },
        {
          title: '住址',
          dataIndex: 'address1',
          key: 'address1',
          width: '150px',
        },
        {
          title: '编辑',
          dataIndex: 'edit',
          key: 'edit',
          width: '100px',
          render: (data, index) => {
            return (
              <Button link onClick={this.setEditable.bind(this, index)}>
                {data.editable ? 'save' : 'edit'}
              </Button>
            )
          },
        },
      ],
    }
  }

  handleSave = row => {
    const { dataSource } = this.state
    const newDataSource = [...dataSource]
    const index = newDataSource.findIndex(item => row.key === item.key)
    newDataSource.splice(index, 1, {
      ...newDataSource[index],
      ...row,
    })
    this.setState({
      dataSource: newDataSource,
    })
  }

  handleChangeSourceData(data, index, key, value) {
    const { dataSource } = this.state
    dataSource[index][key] = value
    this.setState({
      dataSource,
    })
  }

  setEditable(index) {
    const { dataSource } = this.state
    const editable = dataSource[index].editable
    dataSource[index].editable = !editable
    this.setState({
      dataSource,
    })
  }

  handleSelectedChange(selectedKeys, selectedRow) {
    console.log(selectedKeys, selectedRow)
    this.setState({
      selectedKeys,
    })
  }

  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedKeys,
      onChange: this.handleSelectedChange.bind(this),
    }

    const { dataSource, columns } = this.state

    return (
      <React.Fragment>
        <Table
          scroll={{ y: 200 }}
          rowSelection={rowSelection}
          dataSource={dataSource}
          columns={columns}
          // components={{
          //   body: {
          //     cell: Cell
          //   }
          // }}
        />
      </React.Fragment>
    )
  }
}
