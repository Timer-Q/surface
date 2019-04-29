import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon'
import classNames from 'classnames'
import './style/steps.scss'

export default class Steps extends Component {
  static propTypes = {
    children: PropTypes.node,
    mode: PropTypes.number,
    current: PropTypes.number,
    stepsContent: PropTypes.array,
    isArrow: PropTypes.bool,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    mode: 1,
    current: 1,
    isArrow: false,
    stepsContent: [],
  }

  render() {
    const { stepsContent, mode, current, isArrow, children } = this.props
    const cls = classNames({ show: isArrow })

    return (
      <div
        className={classNames('steps', {
          'steps-vertical': mode === 2,
        })}>
        {mode === 1 &&
          stepsContent.map((data, index) => {
            return (
              <div key={index} className="steps-item">
                <div
                  className={classNames('steps-item-title', {
                    'current-title': current === index + 1,
                    'steps-item-done': index + 1 < current,
                  })}>
                  {current <= index + 1 ? data.title : ''}
                </div>

                <a
                  href={data.link}
                  className={classNames('steps-item-name', {
                    current: data.link,
                  })}>
                  {data.name}
                  <span className={!data.link ? 'hide' : cls}>
                    <Icon type="right" />
                  </span>
                </a>
              </div>
            )
          })}
        {mode === 2 &&
          stepsContent.map((data, index) => {
            return (
              <div key={index} className="steps-vertical-item">
                <div className="steps-vertical-item-left">
                  <div
                    className={classNames('steps-vertical-item-dot', {
                      done: index + 1 <= current || data.isDone,
                    })}
                    style={{ borderColor: data.color }}
                  />
                  <div className="steps-vertical-item-name">{data.name}</div>
                </div>
                {data.isHtml && <div>{children}</div>}
                {!data.isHtml && (
                  <div className="steps-vertical-item-title">{data.title}</div>
                )}
              </div>
            )
          })}
      </div>
    )
  }
}
