import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class Pager extends Component {
  static propTypes = {
    children: PropTypes.node,
    page: PropTypes.number.isRequired,
    current: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  }

  handleChange = () => {
    const { page, current, onChange } = this.props
    if (page !== current) {
      onChange(page)
    }
  }

  render() {
    const { page, current } = this.props

    const cls = classNames('pagination-item', {
      'is-actived': page === current,
    })

    return (
      <li key={page} onClick={this.handleChange} className={cls}>
        {page}
      </li>
    )
  }
}
