import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class ButtonGroup extends Component {
  static propTypes = {
    children: PropTypes.node,
    size: PropTypes.string,
    className: PropTypes.string,
  }
  render() {
    const { children, size, className, ...otherProps } = this.props

    const newChildren = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { size, key: child.key || index })
      }
      return child
    })

    const cls = classNames('button-group', {
      [className]: !!className,
    })

    return (
      <div {...otherProps} className={cls}>
        {newChildren}
      </div>
    )
  }
}
