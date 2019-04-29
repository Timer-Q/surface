import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class InputGroup extends Component {
  static propTypes = {
    children: PropTypes.any,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    className: PropTypes.string,
    mode: PropTypes.string,
    style: PropTypes.object,
    noDivision: PropTypes.bool,
  }

  static defaultProps = {
    size: 'default',
    mode: 'group',
  }

  render() {
    const { children, size, className, mode, style, noDivision } = this.props
    let cloneChildren = children

    const classes = classNames('input-group-wrapper', {
      [`input-group-${size}`]: !!size,
      [className]: className,
      'input-group-normal': mode === 'group',
      [`input-group-${mode}`]: mode === 'list',
      'input-group-no-division': noDivision,
    })

    cloneChildren = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        const props = {
          className: 'input-group',
          key: index,
          size,
        }
        if (child.type.propTypes && 'bordered' in child.type.propTypes) {
          props.bordered = false
        }
        if (child.props.className) {
          props.className = `${child.props.className} ${props.className}`
        }
        return React.cloneElement(child, props)
      }
      return child
    })
    return (
      <div style={style} className={classes}>
        {cloneChildren}
      </div>
    )
  }
}
