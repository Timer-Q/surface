import React from 'react'
import PropTypes from 'prop-types'

export default function ColGroup(props) {
  const { columns, expandedRow } = props

  const cols = columns.map(item => {
    return (
      <col
        key={item.key || item.dataIndex}
        style={{ width: item.width, minWidth: item.width }}
      />
    )
  })

  if (expandedRow && expandedRow.showExpandButton !== false) {
    cols.unshift(<col key="expanded-col" style={{ width: '50px', minWidth: '50px' }} />)
  }

  return <colgroup>{cols}</colgroup>
}

ColGroup.propTypes = {
  fixed: PropTypes.bool,
  columns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  expandedRow: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
}
