import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style/timeLine.scss'

export default class componentName extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.any,
    showLastTail: PropTypes.bool,
  }

  static defaultProps = {
    showLastTail: true,
  }

  renderTitle() {
    const { title } = this.props
    return title ? <div className="timeline-title">{title}</div> : null
  }

  renderChildren() {
    const { children, showLastTail } = this.props
    const childrenCount = React.Children.count(children)
    return React.Children.map(children, (child, index) => {
      if (
        React.isValidElement(child) &&
        index === childrenCount - 1 &&
        !showLastTail
      ) {
        return React.cloneElement(child, {
          className: 'timeline-item-last',
          key: child.key || index,
        })
      }
      return child
    })
  }

  render() {
    return (
      <div className="timeline-wrapper">
        {this.renderTitle()}
        <ul className="timeline">{this.renderChildren()}</ul>
      </div>
    )
  }
}
