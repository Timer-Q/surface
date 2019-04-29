import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/progress.scss'

export default class Progress extends Component {
  static propTypes = {
    status: PropTypes.oneOf([
      'normal',
      'exception',
      'warning',
      'active',
      'success',
    ]),
    type: PropTypes.oneOf(['line', 'circle']),
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
    percent: PropTypes.number,
    successPercent: PropTypes.number,
    style: PropTypes.object,
    strokeColor: PropTypes.string,
    format: PropTypes.func,
    showInfo: PropTypes.bool,
    children: PropTypes.node,
  }

  static defaultProps = {
    type: 'line',
    percent: 0,
    showInfo: true,
    strokeWidth: 4,
    status: 'normal',
    width: 100,
  }

  relativeStrokeWidth() {
    const { strokeWidth, width } = this.props
    return ((strokeWidth / width) * 100).toFixed(1)
  }

  trackPath() {
    const radius = parseInt(50 - parseFloat(this.relativeStrokeWidth()) / 2, 10)
    return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius *
      2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`
  }

  perimeter() {
    const radius = 50 - parseFloat(this.relativeStrokeWidth()) / 2
    return 2 * Math.PI * radius
  }

  circlePathStyle() {
    const perimeter = this.perimeter()
    return {
      strokeDasharray: `${perimeter}px,${perimeter}px`,
      strokeDashoffset: (1 - this.props.percent / 100) * perimeter + 'px',
      transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease',
    }
  }

  stroke() {
    let ret
    switch (this.props.status) {
      case 'success':
        ret = '#44c566'
        break
      case 'exception':
        ret = '#ff4a26'
        break
      case 'warning':
        ret = '#ffc700'
        break
      default:
        ret = '#1890ff'
    }
    return ret
  }

  render() {
    const {
      percent,
      successPercent,
      format,
      showInfo,
      strokeWidth,
      strokeColor,
      status,
      type,
      width,
      style,
    } = this.props
    let text
    if (showInfo) {
      if (format && typeof format === 'function') {
        text = format()
      } else if (percent >= 0) {
        text = `${percent}%`
      }
    }

    const hasSuccessPercent = 'successPercent' in this.props

    const bgStyle = {
      width: `${percent}%`,
      height: `${strokeWidth}px`,
      background: strokeColor,
      opacity: hasSuccessPercent ? .4 : null,
    }

    const successBgStyle = {
      width: `${successPercent}%`,
      height: `${strokeWidth}px`,
      background: strokeColor,
    }

    const bgCls = classNames('progress-bar-bg', {
      [`progress-bar-${status}`]: status,
    })

    const successBgCls = classNames('progress-bar-success-bg', bgCls)

    let progressNode
    if (type === 'line') {
      progressNode = (
        <div className="progress" style={style}>
          <div className="progress-outer">
            <div className="progress-bar">
              <div className={bgCls} style={bgStyle} />
              {hasSuccessPercent && (
                <div className={successBgCls} style={successBgStyle} />
              )}
            </div>
          </div>
          {showInfo && <span className="progress-text">{text}</span>}
        </div>
      )
    } else {
      const progressStyle = {
        height: `${width}px`,
        width: `${width}px`,
        ...style,
      }
      progressNode = (
        <div className="progress-circle" style={progressStyle}>
          <svg viewBox="0 0 100 100">
            <path
              className="progress-circle-track"
              d={this.trackPath()}
              stroke="#e5e9f2"
              strokeWidth={this.relativeStrokeWidth()}
              fill="none"
            />
            <path
              className="progress-circle-path"
              d={this.trackPath()}
              strokeLinecap="round"
              stroke={this.stroke()}
              strokeWidth={this.relativeStrokeWidth()}
              fill="none"
              style={this.circlePathStyle()}
            />
          </svg>
          {showInfo && <span className="progress-text">{text}</span>}
        </div>
      )
    }

    return progressNode
  }
}
