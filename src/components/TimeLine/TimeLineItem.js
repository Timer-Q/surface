import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class TimeLineItem extends Component {
  static propTypes = {
    children: PropTypes.any,
    head: PropTypes.any,
    className: PropTypes.string,
    title: PropTypes.any,
    titleStyle: PropTypes.object,
    subTitle: PropTypes.any,
  }

  render() {
    const {
      children,
      head,
      title,
      subTitle,
      className,
      titleStyle,
      ...rest
    } = this.props
    const headClasses = classNames('timeline-item-head', {
      'timeline-item-head-auto': !head,
      'timeline-item-head-icon': head,
    })

    const itemCls = classNames('timeline-item', {
      [className]: className,
    })

    const subTitleNode = subTitle ? (
      <span key="timeline-title-subtitle" className="timeline-item-subtitle">
        {subTitle}
      </span>
    ) : null

    let titleNode
    if (title) {
      titleNode = (
        <div style={titleStyle} className="timeline-item-title">
          {React.isValidElement(title)
            ? React.cloneElement(title, { key: 'timeline-title' })
            : title}
          {subTitleNode}
        </div>
      )
    }

    const newChildren = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: 'timeline-item-content-row',
          key: child.key || index,
        })
      }
      return child
    })

    return (
      <li {...rest} className={itemCls}>
        <div key="timeline-head" className={headClasses}>
          {head}
        </div>
        {titleNode}
        {newChildren && (
          <div key="timeline-content" className="timeline-item-content">
            {newChildren}
          </div>
        )}
        <div key="timeline-tail" className="timeline-item-tail" />
      </li>
    )
  }
}
