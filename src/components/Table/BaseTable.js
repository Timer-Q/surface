import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Checkbox from '../Checkbox'
import Pagination from '../Pagination'
import Icon from '../Icon'
import { Provider } from './tableContext'
import { TableHeaderWithConsumer, TableBodyWithConsumer } from './tableContext'
import TableSrollHeader from './TableScrollHeader'
import TableSrollBody from './TableScrollBody'
import ColGroup from './ColGroup'
import './style/table.scss'

function noop() {}

export default class BaseTable extends Component {
  static propTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    fixed: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    bordered: PropTypes.bool,
    rowSelection: PropTypes.object,
    scroll: PropTypes.object, // {x, y}
    style: PropTypes.object,
    onRow: PropTypes.func,
    className: PropTypes.string,
    components: PropTypes.object,
    pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    expandedRow: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    showHeader: PropTypes.bool,
    scrollTop: PropTypes.number,
    setScrollTop: PropTypes.func,
    saveRefs: PropTypes.func,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    onSortChange: PropTypes.func,
  }

  static defaultProps = {
    fixed: false,
    rowSelection: null,
    scroll: null,
    onRow() {},
    saveRefs() {},
    components: {
      table: 'table',
      header: {
        wrapper: 'thead',
        row: 'tr',
        cell: 'th',
      },
      body: {
        wrapper: 'tbody',
        row: 'tr',
        cell: 'td',
      },
    },
    pagination: true,
    expandedRowRender: noop,
    showHeader: true,
    size: 'default',
    onSortChange: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      rowSelection: null,
      scrollLeft: 0,
      pagination: {
        current: 1,
        pageSize: 5,
      },
      ...this.getSortColumn(),
    }
    this.resultKeys = [] // 选中的 key
    this.resultRows = [] // 选中的 row data
    this.checkboxPropsCache = {}
  }

  static getDerivedStateFromProps(nextProps) {
    const { rowSelection } = nextProps
    const state = {}
    // selection data
    if (rowSelection) {
      state.rowSelection = rowSelection
    }
    return state
  }

  getPaginationData = () => {
    const { pagination } = this.props
    if (typeof pagination === 'boolean') {
      if (pagination) {
        return {
          ...this.state.pagination,
        }
      } else {
        return {
          hidePagination: true,
        }
      }
    }
    return {
      ...this.state.pagination,
      ...pagination,
    }
  }

  getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
    const { rowSelection } = this.state
    const { dataSource } = this.props

    // 是否全选
    const enableRows = this.enableRows || this.getEnableRows()
    this.isSelectedAll =
      selectedRowKeys.length ===
      (enableRows ? enableRows.rows.length : dataSource.length)

    if ('onChange' in rowSelection) {
      const { onChange } = rowSelection
      onChange(selectedRowKeys, selectedRows)
    } else {
      this.setState({
        rowSelection: {
          selectedRowKeys,
          selectedRows,
        },
      })
    }
  }

  changeScroll = scrollLeft => {
    this.setState({
      scrollLeft,
    })
  }

  getRowDataKeyValue = (rowSelection = {}, rowData, index) => {
    const key = rowSelection.valueKey || 'key'
    return rowData[key] || index
  }

  getOneCheckboxProp = (rowData, index) => {
    const { rowSelection = {} } = this.props
    if (rowSelection.getCheckboxProps) {
      const value = this.getRowDataKeyValue(rowSelection, rowData, index)
      if (!this.checkboxPropsCache[value]) {
        this.checkboxPropsCache[value] = rowSelection.getCheckboxProps(
          rowData,
          index
        )
      }
      return this.checkboxPropsCache[value]
    }
    return {}
  }

  /**
   * 通过 选中的 keys 获取对应的 rows 数据
   */
  getRowsByKeys = (rows = [], keys = []) => {
    if (!rows.length || !keys.length) {
      return rows
    }
    return rows.filter((row, index) => {
      const key = this.getRowDataKeyValue(this.props.rowSelection, row, index)
      return keys.includes(key)
    })
  }

  getEnableRows = () => {
    const { dataSource, rowSelection } = this.props
    this.enableRows = dataSource
    this.isSelectedAll = false
    if (rowSelection) {
      const enableRows = { keys: [], rows: [] }
      this.enableRows = dataSource.reduce((acc, current, index) => {
        const currentCheckboxProps = this.getOneCheckboxProp(current, index)
        const value = this.getRowDataKeyValue(rowSelection, current, index)
        if (currentCheckboxProps) {
          if (!currentCheckboxProps.disabled) {
            acc.keys.push(value)
            acc.rows.push(current)
          }
        } else {
          acc.keys.push(value)
          acc.rows.push(current)
        }
        return acc
      }, enableRows)

      const enbaleKeysInSelected = rowSelection.selectedRowKeys.filter(key =>
        this.enableRows.keys.includes(key)
      )

      const enableKeysLength = enbaleKeysInSelected.length

      // header checkbox 是否全选
      this.isSelectedAll =
        rowSelection.selectedRowKeys.length > 0 &&
        enableKeysLength === this.enableRows.rows.length

      // header checkbox 是否半选
      this.isIndeterminate = !this.isSelectedAll && enableKeysLength > 0
    }
    return this.enableRows
  }

  onHeaderCheckChange = isCheckedAll => {
    const enableRows = this.enableRows || this.getEnableRows()
    const { rowSelection } = this.props

    if (isCheckedAll) {
      const addedKeys = enableRows.keys.filter(
        key => !rowSelection.selectedRowKeys.includes(key)
      )
      this.resultKeys = [...rowSelection.selectedRowKeys, ...addedKeys]
    } else {
      this.resultKeys = this.resultKeys.filter(key => {
        return !enableRows.keys.includes(key)
      })
    }
    this.resultRows = this.getRowsByKeys(this.props.dataSource, this.resultKeys)
    this.getSelectedRowKeys(this.resultKeys, this.resultRows)
  }

  onBodyCheckChange = (row, value) => {
    if (value) {
      const {
        rowSelection: { selectedRowKeys },
      } = this.state

      const keyIndex = selectedRowKeys.indexOf(value)
      this.resultKeys = selectedRowKeys
      if (keyIndex > -1) {
        this.resultKeys.splice(keyIndex, 1)
      } else {
        this.resultKeys.push(value)
      }
      // 所有选中的 行数据 包括 disabled
      this.resultRows = this.getRowsByKeys(
        this.props.dataSource,
        this.resultKeys
      )

      this.getSelectedRowKeys(this.resultKeys, this.resultRows)
    }
  }

  /**
   * 排序
   */

  getSortOrder = column => {
    if ('sortOrder' in column) {
      return column.sortOrder
    }
    return this.state.sortOrder
  }

  computNextSortOrder = currentSortOrder => {
    let newSortOrder = currentSortOrder
    if (!currentSortOrder) {
      newSortOrder = 'ascend'
    } else if (currentSortOrder === 'ascend') {
      newSortOrder = 'descend'
    } else if (currentSortOrder === 'descend') {
      newSortOrder = ''
    }
    return newSortOrder
  }

  toggleSorter = (column = {}, index) => {
    const { sortColumn, sortOrder } = this.state

    let newSortOrder
    if (column !== sortColumn) {
      this.setState({
        sortColumn: column,
      })
    }
    if (!('sortOrder' in column)) {
      newSortOrder = this.computNextSortOrder(sortOrder)
      if (column.sortOrder !== sortOrder) {
        this.setState({
          sortOrder: newSortOrder,
        })
      }
    } else {
      newSortOrder = this.computNextSortOrder(column.sortOrder)
    }
    this.props.onSortChange(column, index, newSortOrder)
  }

  getSortColumn = () => {
    const { columns } = this.props

    const sortColumns = []
    const defaultSortColumns = []
    columns.forEach(column => {
      if ('sortOrder' in column) {
        sortColumns.push(column)
      } else if ('defaultSortOrder' in column) {
        defaultSortColumns.push(column)
      }
    })

    const sortColumn = defaultSortColumns[0] || sortColumns[0]
    if (sortColumn) {
      return {
        sortColumn: sortColumn,
        sortOrder: sortColumn.sortOrder || sortColumn.defaultSortOrder,
      }
    }
    return {
      sortColumn: null,
      sortOrder: null,
    }
  }

  getSorterFunc = () => {
    const { sortColumn, sortOrder } = this.state
    if (!sortColumn || typeof sortColumn.sorter !== 'function') {
      return
    }
    let currentSortOrder = sortOrder
    if ('sortOrder' in sortColumn) {
      currentSortOrder = sortColumn.sortOrder
    }
    return (prev, next) => {
      const result = sortColumn.sorter(prev, next)
      if (result !== 0) {
        return currentSortOrder === 'descend' ? -result : result
      }
      return 0
    }
  }

  sortData = (data, sortFunc) => {
    if (data && data.length && typeof sortFunc === 'function') {
      return data.sort(sortFunc)
    }
    return []
  }

  /**
   * 分页 change
   */
  handlePaginationChange = current => {
    const pagination = this.getPaginationData()
    this.setState({
      pagination: {
        ...pagination,
        current,
      },
    })
    const { onChange } = pagination
    if (onChange) {
      onChange(current)
    }
  }

  handlePaginationSizeChange = pageSize => {
    const pagination = this.getPaginationData()
    this.setState({
      pagination: {
        ...pagination,
        pageSize,
      },
    })
    const { onSizeChange } = pagination
    if (onSizeChange) {
      onSizeChange(pageSize)
    }
  }

  renderPagination = pagination => {
    const { dataSource, size } = this.props
    if (!pagination.hidePagination && dataSource.length > 0) {
      const cls = classNames('table-pagination', {
        [`table-pagination-${size}`]: size,
      })
      return (
        <Pagination
          className={cls}
          total={dataSource.length}
          {...pagination}
          onChange={this.handlePaginationChange}
          onSizeChange={this.handlePaginationSizeChange}
        />
      )
    }
    return null
  }

  renderSorter = (column, index, children) => {
    let sortKey = null
    const { sortColumn, sortOrder } = this.state
    if (!sortColumn) {
      return
    }
    if (column.key === sortColumn.key) {
      if ('sortOrder' in column) {
        sortKey = column.sortOrder
      } else {
        sortKey = sortOrder
      }
    }
    return (
      <div
        className="table-thead-sorter-content"
        onClick={() => this.toggleSorter(column, index)}>
        {children}
        <span key="sort" className="table-thead-sorter-button">
          <Icon
            key="sort-ascend"
            className={`${sortKey === 'ascend' ? 'is-active' : ''}`}
            type="caret-up"
          />
          <Icon
            key="sort-descend"
            className={`${sortKey === 'descend' ? 'is-active' : ''}`}
            type="caret-down"
          />
        </span>
      </div>
    )
  }

  render() {
    const {
      dataSource,
      columns,
      rowSelection,
      scroll,
      onRow,
      components,
      expandedRow,
      showHeader,
      scrollTop,
      setScrollTop,
      size,
      saveRefs,
      ...rest
    } = this.props

    const pagination = this.getPaginationData()
    const { scrollLeft } = this.state

    let newColumns = columns

    // 设置 selection column
    if (rowSelection) {
      const selectionColumn = {
        key: 'selection-column',
        render: (data, index) => {
          let checkboxProps = {}
          const value = this.getRowDataKeyValue(rowSelection, data, index)
          if (rowSelection.getCheckboxProps) {
            checkboxProps = rowSelection.getCheckboxProps(data, index)
            this.checkboxPropsCache[value] = checkboxProps
          }
          return {
            children: (
              <Checkbox
                checked={(rowSelection.selectedRowKeys || []).includes(value)}
                value={value}
                onChange={this.onBodyCheckChange.bind(this, data)}
                {...checkboxProps}
              />
            ),
          }
        },
        fixed: rowSelection.fixed,
        width: rowSelection.columnWidth,
      }
      if (newColumns[0] && newColumns[0].key === 'selection-column') {
        newColumns[0] = selectionColumn
      } else {
        newColumns.unshift(selectionColumn)
      }
    }

    const sortFunc = this.getSorterFunc()
    let data = dataSource.slice(0)
    if (sortFunc) {
      data = this.sortData(data, sortFunc)
    }

    const TableTag = components.table
    const baseComponents = {
      table: 'table',
      header: {
        wrapper: 'thead',
        row: 'tr',
        cell: 'th',
      },
      body: {
        wrapper: 'tbody',
        row: 'tr',
        cell: 'td',
      },
    }

    const combineComponents = Object.assign(baseComponents, components)
    this.getEnableRows()

    return (
      <Provider
        value={{
          ...rest,
          columns: newColumns,
          dataSource: data,
          rowSelection,
          scroll,
          onRow,
          pagination,
          expandedRow,
          size,
          saveRefs,
          onSort: this.handleSort,
          components: combineComponents,
          onHeaderCheckChange: this.onHeaderCheckChange,
          onBodyCheckChange: this.onBodyCheckChange,
          isSelectedAll: this.isSelectedAll,
          isIndeterminate: this.isIndeterminate,
        }}>
        {scroll ? (
          <div key="table-scroll" className="table-scroll">
            {showHeader && (
              <TableSrollHeader
                key="table-scroll-header"
                columns={newColumns}
                scroll={scroll}
                scrollLeft={scrollLeft}
                changeScroll={this.changeScroll}
                fixed={rest.fixed}>
                <TableHeaderWithConsumer
                  renderSorter={this.renderSorter}
                  key="table-scroll-header-children"
                />
              </TableSrollHeader>
            )}

            <TableSrollBody
              key="table-scroll-body"
              columns={newColumns}
              scroll={scroll}
              scrollLeft={scrollLeft}
              scrollTop={scrollTop}
              setScrollTop={setScrollTop}
              changeScroll={this.changeScroll}
              fixed={rest.fixed}>
              <TableBodyWithConsumer key="table-scroll-body-children" />
            </TableSrollBody>
          </div>
        ) : (
          <TableTag key="table">
            <ColGroup
              key="table-col-group"
              expandedRow={expandedRow}
              columns={newColumns}
            />
            {showHeader && (
              <TableHeaderWithConsumer
                renderSorter={this.renderSorter}
                key="table-header"
              />
            )}
            <TableBodyWithConsumer key="table-body" />
          </TableTag>
        )}
        {this.renderPagination(pagination)}
      </Provider>
    )
  }
}
