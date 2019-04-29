import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/grid.scss'

// const responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']

export default class Row extends Component {
  static propTypes = {
    align: PropTypes.string,
    justify: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    gutter: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.string,
    ]),
    tag: PropTypes.string,
  }

  static defaultProps = {
    justify: 'start',
    align: 'middle',
    tag: 'div',
  }

  render() {
    const {
      tag,
      justify,
      align,
      gutter,
      style,
      children,
      className,
    } = this.props
    const cls = classNames('row', {
      [`row-${align}`]: align,
      [`row-${justify}`]: justify,
      [className]: className,
    })
    const Tag = tag

    const rowStyle =
      gutter > 0
        ? {
          marginLeft: gutter / -2,
          marginRight: gutter / -2,
          ...style,
        }
        : style

    const cols = React.Children.map(children, child => {
      if (!child) {
        return null
      }
      if (React.isValidElement(child) && child.props && gutter > 0) {
        return React.cloneElement(child, {
          style: {
            paddingLeft: gutter / 2,
            paddingRight: gutter / 2,
            ...child.props.style,
          },
        })
      }
      return child
    })
    return (
      <Tag className={cls} style={rowStyle}>
        {cols}
      </Tag>
    )
  }
}
