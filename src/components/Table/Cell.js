import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Cell extends Component {
  static propTypes = {
    component: PropTypes.any,
    row: PropTypes.object,
    column: PropTypes.object,
    index: PropTypes.number,
    indexOfAllData: PropTypes.number,
  }

  static defaultProps = {
    component: 'td',
  }

  render() {
    const {
      component: CellTag,
      row,
      column,
      index,
      indexOfAllData,
      ...rest
    } = this.props
    let customProps = rest

    if (column && column.onCell) {
      customProps = { ...customProps, ...column.onCell(row) }
    }

    if (column && column.align) {
      customProps.style = { ...customProps.style, textAlign: column.align }
    }
    let children = row[column.key || column.dataIndex]
    let renderProps = {}
    const { render } = column
    if (render) {
      const data = render(row, index, indexOfAllData)
      if (data) {
        if (data.children) {
          children = data.children
          renderProps = data.props || renderProps
        } else {
          children = data
        }
      }
    }

    if (renderProps.colSpan === 0 || renderProps.rowSpan === 0) {
      return null
    }
    return (
      <CellTag {...customProps} {...renderProps}>
        {children}
      </CellTag>
    )
  }
}
