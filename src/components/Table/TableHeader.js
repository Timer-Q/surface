import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Checkbox from '../Checkbox'

export default class TableHeader extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    fixed: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    rowSelection: PropTypes.object,
    onHeaderCheckChange: PropTypes.func,
    isSelectedAll: PropTypes.bool,
    isIndeterminate: PropTypes.bool,
    components: PropTypes.object.isRequired,
    expandedRow: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    onSort: PropTypes.func,
    saveRefs: PropTypes.func,
    size: PropTypes.string,
    headRowsHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    renderSorter: PropTypes.func,
  }

  static defaultProps = {
    fixed: false,
    isSelectedAll: false,
    rowSelection: null,
  }

  handleChange = value => {
    const { onHeaderCheckChange } = this.props
    if (onHeaderCheckChange) {
      onHeaderCheckChange(value)
    }
  }

  renderHeaderCell = (column, index) => {
    const {
      isSelectedAll,
      isIndeterminate,
      components,
      renderSorter,
    } = this.props
    const CellTag = components.header.cell

    let child = column.title
    let cls
    if (column.key === 'selection-column') {
      child = (
        <Checkbox
          key={column.key}
          indeterminate={isIndeterminate}
          checked={isSelectedAll}
          onChange={this.handleChange}
        />
      )
      cls = 'selection-column'
    }

    const customProps = column.onHeaderCell
      ? column.onHeaderCell(column, index)
      : {}

    if (column.headerRender) {
      child = column.headerRender(child, index)
      if (React.isValidElement(child)) {
        React.cloneElement(child, { key: child.props.key || index })
      }
    }
    if (column.sorter) {
      cls = 'table-thead-sorter'
      if (renderSorter) {
        child = renderSorter(column, index, child)
      }
    }

    let style = column.headerStyle
    if (column.headerAlign) {
      style = { ...style, textAlign: column.headerAlign }
    }

    customProps.style = { ...customProps.style, ...style }

    return (
      <CellTag className={cls} key={column.key || index} {...customProps}>
        {child}
      </CellTag>
    )
  }

  renderHeader() {
    const {
      columns,
      components,
      expandedRow,
      size,
      saveRefs,
      headRowsHeight,
    } = this.props
    const RowTag = components.header.row

    const newColumns = columns.slice(0)
    if (expandedRow && expandedRow.showExpandButton !== false) {
      newColumns.unshift({
        key: 'expanded-cell',
        title: '',
        width: '50px',
      })
    }

    const ths = newColumns.map((column, index) => {
      return this.renderHeaderCell(column, index)
    })

    const cls = classNames('table-thead', {
      [`table-${size}`]: size,
    })

    return (
      <thead ref={saveRefs('tableTheadRef')} className={cls}>
        <RowTag className="table-head-row" style={{ height: headRowsHeight }}>
          {ths}
        </RowTag>
      </thead>
    )
  }

  render() {
    return this.renderHeader()
  }
}
