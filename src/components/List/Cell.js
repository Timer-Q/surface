import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class Cell extends Component {
  static propTypes = {
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    link: PropTypes.string,
    isBold: PropTypes.bool,
  }

  static defaultProps = {
    title: '',
    description: '',
    link: '',
    isBold: false,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { title, description, link, isBold } = this.props

    return (
      <div className="cell-wrap">
        <div className="cell-wrap-name">{title}</div>
        <div
          className={classNames('cell-wrap-desc', {
            'is-bold': isBold,
            link: link,
          })}
        >
          {link && (
            <a href={link || 'javascript:void(0)'} className="link">
              {description}
            </a>
          )}
          {!link && <div className="text">{description}</div>}
        </div>
      </div>
    )
  }
}
