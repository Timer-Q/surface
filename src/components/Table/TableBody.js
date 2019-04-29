import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Cell from './Cell'
// import shallowEqual from './utils'

export default class TableBody extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    rowSelection: PropTypes.object,
    fixed: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    onRow: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    components: PropTypes.object.isRequired,
    pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    expandedRow: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    showExpandedIndex: PropTypes.bool,
    size: PropTypes.string,
    shouldUpdateRowsHeightSync: PropTypes.bool,
    saveRefs: PropTypes.func,
    rowsHeight: PropTypes.object,
    emptyText: PropTypes.string,
    emptyStyle: PropTypes.object,
  }

  static defaultProps = {
    rowSelection: null,
    fixed: false,
    onRow() {},
    pagination: null,
    showExpandedIndex: false,
    shouldUpdateRowsHeightSync: false,
    emptyText: '暂无数据',
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.tbodyRef = React.createRef()
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      dataSource: nextProps.dataSource,
    }
  }

  getIndexInAllData(index) {
    let {
      pagination: { current, pageSize, defaultPageSize, defaultCurrent },
    } = this.props
    if (!(current >= 0)) {
      current = defaultCurrent || 0
    }
    if (!(pageSize >= 0)) {
      pageSize = defaultPageSize || 0
    }
    return (current - 1) * pageSize + index
  }

  handleToggleExpanded = index => {
    const { dataSource } = this.state
    const currentIndex = this.getIndexInAllData(index)
    dataSource[currentIndex].expanded = !dataSource[currentIndex].expanded
    this.setState({ dataSource })
  }

  getPagedRows = () => {
    const { pagination } = this.props
    const { dataSource } = this.state
    if (
      pagination.current &&
      pagination.pageSize &&
      dataSource.length > pagination.pageSize // 如果是多页数据
    ) {
      let { current, pageSize, defaultPageSize, defaultCurrent } = pagination
      if (!(current >= 0)) {
        current = defaultCurrent
      }
      const size = pageSize || defaultPageSize
      if (dataSource.length < size) {
        return dataSource
      }
      return dataSource.filter(
        (_, index) => index >= (current - 1) * size && index < current * size
      )
    }
    return dataSource
  }

  handleMouseOver = () => {}

  renderBody = () => {
    const {
      columns,
      rowSelection,
      onRow,
      className,
      style,
      components,
      expandedRow,
      showExpandedIndex,
      size,
      fixed,
      rowsHeight,
      saveRefs,
      emptyText,
      emptyStyle,
    } = this.props

    const selectState = rowSelection && rowSelection.selectedRowKeys

    const RowTag = components.body.row || 'tr'

    const cls = classNames('table-tbody', {
      [`table-${size}`]: size,
    })

    const rowsData = this.getPagedRows()
    let renderRows = (
      <tr>
        <td style={emptyStyle} className="table-tbody-empty" colSpan={columns.length}>{emptyText}</td>
      </tr>
    )

    if (rowsData && rowsData.length) {
      renderRows = rowsData.map((data, index) => {
        let isSelected = false
        if (selectState) {
          isSelected = (selectState || []).includes(data.key)
        }
        const { className: rowClassName, style: rowStyle, ...rowProps } =
          onRow(data, index) || {}

        const cls = classNames({
          'table-row': !fixed,
          [className]: className,
          [rowClassName]: rowClassName,
          'is-selected': isSelected,
        })
        const newColumns = columns.slice(0)
        if (expandedRow && expandedRow.showExpandButton !== false) {
          const expandedCls = classNames('table-expand-cell-icon', {
            'is-expanded': data.expanded,
          })
          const expandCell = {
            key: 'expanded-row',
            width: '50px',
            render: (data, index) => ({
              children: (
                <span
                  className={expandedCls}
                  onClick={this.handleToggleExpanded.bind(this, index)}
                />
              ),
            }),
          }
          if (newColumns[0].key === 'expanded-row') {
            newColumns[0] = expandCell
          } else {
            newColumns.unshift(expandCell)
          }
        }

        const styles = { ...style, ...rowStyle }

        let height
        if (fixed && rowsHeight) {
          height = rowsHeight[index]
        }

        return (
          <React.Fragment key={index}>
            <RowTag
              className={cls}
              key={`${index}-row`}
              style={styles}
              data-row-key={index}
              height={height}
              onMouseOver={this.handleMouseOver}
              {...rowProps}>
              {newColumns.map((column, i) => {
                let cls
                if (column.key === 'selection-column') {
                  cls = 'selection-column'
                }
                return (
                  <Cell
                    component={components.body.cell || 'td'}
                    row={data}
                    column={column}
                    className={cls}
                    index={index}
                    indexOfAllData={this.getIndexInAllData(index)}
                    key={column.key || `${index}-${i}`}
                  />
                )
              })}
            </RowTag>
            {expandedRow && data.expanded && (
              <RowTag
                key={`${index}-expandedRow`}
                className="table-expanded-row">
                {showExpandedIndex && <td key="expanded-indent" />}
                <td key="expanded-content" colSpan={newColumns.length}>
                  {typeof expandedRow === 'function'
                    ? expandedRow(data, index)
                    : expandedRow.render(data, index)}
                </td>
              </RowTag>
            )}
          </React.Fragment>
        )
      })
    }

    const body = (
      <tbody ref={saveRefs('tableTbodyRef')} className={cls}>
        {renderRows}
      </tbody>
    )
    return body
  }

  render() {
    return this.renderBody()
  }
}
