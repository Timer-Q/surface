import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import BaseTable from './BaseTable'
import { shallowEqual } from './utils'

export default class Table extends Component {
  static propTypes = {
    columns: PropTypes.array,
    scroll: PropTypes.object,
    style: PropTypes.object,
    className: PropTypes.string,
    bordered: PropTypes.bool,
  }

  columnsManage = () => {
    this.leftFixedColumns = []
    this.rightFixedColumns = []
    const { columns } = this.props
    columns.forEach(item => {
      if (item.fixed === 'left' || item.fixed === true) {
        this.leftFixedColumns.push(item)
      }
      if (item.fixed === 'right') {
        this.rightFixedColumns.push(item)
      }
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      currentHoverKey: null,
      scrollTop: 0,
    }
  }

  componentDidMount() {
    this.updateRowsHeightSync()
  }

  componentDidUpdate() {
    this.updateRowsHeightSync()
  }

  saveRefs = name => node => (this[name] = node)

  updateRowsHeightSync() {
    if (this.shouldUpdateRowsHeightSync) {
      clearTimeout(this.updateRowsHeightTimer)
      this.updateRowsHeightTimer = setTimeout(() => {
        let headRowsHeight = 'auto'
        let newRowsHeight = {}
        if (this.tableTheadRef) {
          const tableHeadRow = this.tableTheadRef.querySelectorAll(
            '.table-head-row'
          )
          const node = tableHeadRow[0]
          headRowsHeight = node ? node.getBoundingClientRect().height : 'auto'
        }
        if (this.tableTbodyRef) {
          const tableRows =
            this.tableTbodyRef.querySelectorAll('.table-row') || []
          newRowsHeight = Array.prototype.reduce.call(
            tableRows,
            (prev, row) => {
              const index = row.getAttribute('data-row-key')
              const { height = 'auto' } = row.getBoundingClientRect()
              prev[index] = height
              return prev
            },
            {}
          )
        }
        this.getRowsHeight(newRowsHeight, headRowsHeight)
      }, 150)
    }
  }

  changeScrollTop = scrollTop => {
    this.setState({
      scrollTop,
    })
  }

  getRowsHeight = (rowsHeight, headRowsHeight) => {
    if (
      shallowEqual(this.state.rowsHeight, rowsHeight) &&
      shallowEqual(this.state.headRowsHeight, headRowsHeight)
    ) {
      return
    }
    this.setState({
      rowsHeight,
      headRowsHeight,
    })
  }

  renderFixedTable = direction => {
    const { scroll, ...rest } = this.props
    const { scrollTop, rowsHeight, headRowsHeight } = this.state
    const newScroll = { y: scroll.y }
    const cls = `table-fixed is-${direction}`
    let columns = this.leftFixedColumns
    if (direction === 'right') {
      columns = this.rightFixedColumns
    }
    return (
      <div className={cls}>
        <BaseTable
          {...rest}
          rowsHeight={rowsHeight}
          headRowsHeight={headRowsHeight}
          pagination={false}
          columns={columns}
          scroll={newScroll}
          scrollTop={scrollTop}
          setScrollTop={this.changeScrollTop}
          fixed={true}
        />
      </div>
    )
  }

  render() {
    this.columnsManage()
    const { bordered, className, style, ...rest } = this.props
    const { scrollTop } = this.state
    const leftFixedLength = this.leftFixedColumns.length
    const rightFixedLength = this.rightFixedColumns.length
    this.shouldUpdateRowsHeightSync =
      leftFixedLength > 0 || rightFixedLength > 0

    const cls = classNames('table', {
      'table-bordered': bordered,
      [className]: className,
    })

    return (
      <div className={cls} style={style}>
        <BaseTable
          shouldUpdateRowsHeightSync={this.shouldUpdateRowsHeightSync}
          {...rest}
          saveRefs={this.saveRefs}
          scrollTop={scrollTop}
          setScrollTop={this.changeScrollTop}
        />
        {!!leftFixedLength && this.renderFixedTable('left')}
        {!!rightFixedLength && this.renderFixedTable('right')}
      </div>
    )
  }
}
