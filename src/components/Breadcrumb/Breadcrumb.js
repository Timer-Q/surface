import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/breadcrumb.scss'

export default class Breadcrumb extends Component {
  static propTypes = {
    current: PropTypes.number,
    routeContent: PropTypes.array,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    routeContent: [],
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { routeContent, onClick } = this.props
    return (
      <div className="breadcrumb">
        {routeContent.map((data, index) => {
          return (
            <div
              key={index}
              onClick={() => onClick(data, index)}
              className={classNames('breadcrumb-item', {
                'current': index === routeContent.length - 1,
              })}>
              <div className="breadcrumb-item-title">
                {data.name}
              </div>
              <div className={index < routeContent.length - 1 ? 'show' : 'hide'}>/</div>
            </div>
          )
        })}
      </div>
    )
  }
}
