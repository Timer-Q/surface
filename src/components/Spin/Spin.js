import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/spin.scss'

function shouldDelay(spinning, delay) {
  return !!spinning && !!delay && !isNaN(Number(delay))
}

// Render indicator
let defaultIndicator = null

function renderIndicator(prop) {
  const { indicator } = prop
  const dotClassName = 'mfw-spin-dot'
  if (React.isValidElement(indicator)) {
    return React.cloneElement(indicator, {
      className: classNames(indicator.props.className, dotClassName),
    })
  }
  if (React.isValidElement(defaultIndicator)) {
    return React.cloneElement(indicator, {
      className: classNames(defaultIndicator.props.className, dotClassName),
    })
  }

  return (
    <span className={classNames(dotClassName, 'mfw-spin-dot-spin')}>
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}

export default class Spin extends Component {
  static propTypes = {
    children: PropTypes.node, // 包裹的元素
    delay: PropTypes.number, // 延迟显示加载效果时间
    indicator: PropTypes.element, // 加载指示符
    size: PropTypes.oneOf(['small', 'default', 'large']), // 组件大小 small default large
    spinning: PropTypes.bool, // 是否为加载中
    tip: PropTypes.string, // 当前包裹元素是，可以自定义文案
    wrapperClassName: PropTypes.string, // 包装器的类属性
  }

    static defaultProps = {
      children: null,
      // delay: 0,
      indicator: null,
      size: 'default',
      spinning: true,
      tip: '',
      wrapperClassName: '',
    }

    debounceTimeout = null;
    delayTimeout = null;

    constructor(props) {
      super(props)

      const { spinning, delay } = props
      this.state = {
        spinning: spinning && !shouldDelay(spinning, delay),
      }
    }

    isNestedPattern() {
      return !!(this.props && this.props.children)
    }

    componentDidMount() {
      const { spinning, delay } = this.props

      if(shouldDelay(spinning, delay)) {
        this.delayTimeout = window.setTimeout(this.delayUpdateSpinning, delay)
      }
    }

    componentWillUnmount() {
      if(this.delayTimeout) {
        clearTimeout(this.delayTimeout)
      }
      if(this.debounceTimeout) {
        clearTimeout(this.debounceTimeout)
      }
    }

    componentDidUpdate() {
      const currentSpinning = this.state.spinning
      const spinning = this.props.spinning
      if (currentSpinning === spinning) {
        return
      }
      const { delay } = this.props

      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout)
      }
      if (currentSpinning && !spinning) {
        this.debounceTimeout = window.setTimeout(() => this.setState({ spinning }), 200)
        if (this.delayTimeout) {
          clearTimeout(this.delayTimeout)
        }
      } else {
        if (shouldDelay(spinning, delay)) {
          if (this.delayTimeout) {
            clearTimeout(this.delayTimeout)
          }
          this.delayTimeout = window.setTimeout(this.delayUpdateSpinning, delay)
        } else {
          this.setState({ spinning })
        }
      }
    }

    delayUpdateSpinning = () => {
      const { spinning } = this.props
      if (this.state.spinning !== spinning) {
        this.setState({ spinning })
      }
    }

    render() {
      const { size, tip, wrapperClassName } = this.props
      const { spinning } = this.state
      const spinClassName = classNames('mfw-spin-spinning', {
        ['mfw-spin-sm']: size === 'small',
        ['mfw-spin-lg']: size === 'large',
        ['mfw-spin']: spinning,
        ['mfw-show-text']: !!tip,
      })

      const spinElement = (
        <div className={spinClassName} >
          {renderIndicator(this.props)}
          {tip ? <div className={'mfw-spin-text'}>{tip}</div> : null}
        </div>
      )
      if (this.isNestedPattern()) {
        let animateClassName = 'mfw-spin-nested-loading'
        if (wrapperClassName) {
          animateClassName += ' ' + wrapperClassName
        }
        const containerClassName = classNames({
          ['mfw-spin-container']: true,
          ['mfw-spin-blur']: spinning,
        })
        return (
          <div
            className={animateClassName}
            style={null}
          >
            {spinning && <div key="loading">{spinElement}</div>}
            <div className={containerClassName} key="container">
              {this.props.children}
            </div>
          </div>
        )
      }
      return spinElement
    }
}
