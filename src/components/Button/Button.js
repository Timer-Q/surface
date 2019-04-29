import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../Icon'
import './style/index.scss'

export default class Button extends Component {
  static propTypes = {
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    children: PropTypes.any,
    type: PropTypes.oneOf([
      'primary',
      'success',
      'warning',
      'danger',
      'default',
    ]),
    htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),
    size: PropTypes.oneOf(['tiny', 'small', 'default', 'large']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    icon: PropTypes.any,
    ghost: PropTypes.bool,
    link: PropTypes.bool,
    shape: PropTypes.oneOf(['circle']),
    className: PropTypes.any,
    isActived: PropTypes.bool,
  }

  static defaultProps = {
    size: 'default',
    type: 'primary',
    ghost: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: props.loading,
    }
  }

  static delayTimeout = null

  static getDerivedStateFromProps(nextProps, prevState) {
    const preLoading = prevState.loading
    const curLoading = nextProps.loading
    if (preLoading) {
      clearTimeout(Button.delayTimeout)
    }
    // NOTE: 延时 loading
    if (typeof curLoading !== 'boolean' && curLoading && curLoading.delay) {
      Button.delayTimeout = setTimeout(() => {
        return { loading: curLoading }
      }, curLoading.delay)
    } else {
      return { loading: curLoading }
    }
  }

  componentWillUnmount() {
    this.delayTimeout && clearTimeout(this.delayTimeout)
  }

  handleClick(e) {
    const { onClick, disabled } = this.props
    if (disabled) {
      return
    }
    onClick && onClick(e)
  }

  render() {
    const {
      type,
      loading, // eslint-disable-line
      htmlType,
      size,
      children,
      icon,
      shape,
      ghost,
      link,
      disabled,
      className,
      isActived,
      ...otherProps
    } = this.props
    const loadingState = this.state.loading
    const classes = classNames('button', {
      [`button-${type}`]: type,
      'button-link': link,
      [`button-size-${size}`]: size,
      'button-ghost': ghost,
      [`button-${shape}`]: shape,
      [className]: className,
      'has-background': !ghost && !link,
      'button-disabled': disabled,
      'button-loading': loadingState,
      'is-actived': isActived,
    })

    const ComponentTag = otherProps.href ? 'a' : 'button'

    const iconType = loadingState ? 'loading' : icon

    let newChildren = children

    newChildren = React.Children.map(newChildren, child => {
      if (typeof child === 'string') {
        return (
          <span className="button-content" key="button-children">
            {child}
          </span>
        )
      }
      return child
    })

    return (
      <ComponentTag
        {...otherProps}
        type={otherProps.href ? undefined : htmlType || 'button'}
        className={classes}
        disabled={disabled}
        onClick={this.handleClick.bind(this)}>
        {iconType && (
          <Icon key="pre-icon" type={iconType} />
        )}
        {newChildren && newChildren}
      </ComponentTag>
    )
  }
}
