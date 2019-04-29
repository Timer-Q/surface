import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class Col extends Component {
  static propTypes = {
    span: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    pull: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    push: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    xs: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
    ]),
    sm: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
    ]),
    md: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
    ]),
    lg: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
    ]),
    tag: PropTypes.string,
    children: PropTypes.node,
    order: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
  }

  render() {
    const {
      span,
      order,
      offset,
      push,
      pull,
      className,
      children,
      ...others
    } = this.props

    let sizeClassObj = {}

    const sizeProps = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

    sizeProps.forEach(size => {
      let sizeProps = {}
      if (typeof this.props[size] === 'number') {
        sizeProps.span = this.props[size]
      } else if (typeof this.props[size] === 'object') {
        sizeProps = this.props[size] || {}
      }

      delete others[size]

      sizeClassObj = {
        ...sizeClassObj,
        [`col-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
        [`col-${size}-order-${sizeProps.order}`]:
          sizeProps.order || sizeProps.order === 0,
        [`col-${size}-offset-${sizeProps.offset}`]:
          sizeProps.offset || sizeProps.offset === 0,
        [`col-${size}-push-${sizeProps.push}`]:
          sizeProps.push || sizeProps.push === 0,
        [`col-${size}-pull-${sizeProps.pull}`]:
          sizeProps.pull || sizeProps.pull === 0,
      }
    })

    const classes = classNames(
      {
        [`col-${span}`]: span !== undefined,
        [`col-order-${order}`]: order,
        [`col-offset-${offset}`]: offset,
        [`col-push-${push}`]: push,
        [`col-pull-${pull}`]: pull,
      },
      className,
      sizeClassObj
    )
    return (
      <div className={classes} {...others}>
        {children}
      </div>
    )
  }
}
