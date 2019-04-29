import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Tabs from '../Tabs'
import './style/card.scss'

export default class Card extends Component {
  static propTypes = {
    mode: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra: PropTypes.any,
    children: PropTypes.any,
    cover: PropTypes.any,
    actions: PropTypes.any,
    style: PropTypes.object,
    className: PropTypes.string,
    bodyClassName: PropTypes.string,
    bodyStyle: PropTypes.object,
    coverStyle: PropTypes.object,
    contentStyle: PropTypes.object,
    bordered: PropTypes.bool,
    tabList: PropTypes.array,
    onTabChange: PropTypes.func,
    activeTabKey: PropTypes.string,
    headType: PropTypes.string,
    tabs: PropTypes.object,
  }

  static defaultProps = {
    bordered: true,
  }

  static isCard = true

  renderHead() {
    const { title, extra, headType } = this.props
    const cls = classNames('card-head', {
      'card-head-normal': headType !== 'transparent',
    })
    let titleWithKey = title
    let extraWithKey = extra
    if (React.isValidElement(title)) {
      titleWithKey = React.cloneElement(title, { key: 'card-title' })
    }
    if (React.isValidElement(extra)) {
      extraWithKey = React.cloneElement(extra, { key: 'card-extra' })
    }
    return (
      (title || extra) && (
        <div className={cls}>
          {titleWithKey}
          {extraWithKey}
        </div>
      )
    )
  }

  renderCover() {
    const { cover, coverStyle } = this.props
    return (
      cover && (
        <div style={coverStyle} className="card-cover">
          {cover}
        </div>
      )
    )
  }

  renderTabs() {
    const { tabList, onTabChange, children, activeTabKey, tabs } = this.props
    return (
      <Tabs
        activeKey={activeTabKey}
        onChange={onTabChange}
        editable={false}
        isAddTab={false}
        {...tabs}>
        {tabList.map((tab, index) => (
          <Tabs.TabPane
            key={tab.key || index}
            tab={tab.title}
            closable={tab.closable}>
            {tab.content || children}
          </Tabs.TabPane>
        ))}
      </Tabs>
    )
  }

  renderBody() {
    const { children, bodyStyle, bodyClassName, tabList } = this.props
    
    let newChildren = children
    this.isTabs = false
    if (Array.isArray(tabList) && !!tabList.length) {
      this.isTabs = true
      newChildren = this.renderTabs()
    } else {
      newChildren = React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type && child.type.isCard) {
          return React.cloneElement(child, {
            className: 'card-inner',
            key: child.key || index,
          })
        }
        return child
      })
    }

    const cls = classNames('card-body', {
      'card-body-normal': !this.isTabs,
      'card-body-tabs': this.isTabs,
      [bodyClassName]: bodyClassName,
    })

    return (
      <div style={bodyStyle} className={cls}>
        {newChildren}
      </div>
    )
  }

  // TODO: actions 按钮
  renderAction() {
    const { actions } = this.props
    return actions && <div>{actions}</div>
  }

  render() {
    const { style, contentStyle, bordered, className } = this.props

    const head = this.renderHead()
    const coverNode = this.renderCover()
    const body = this.renderBody()
    const actionNode = this.renderAction()

    const cls = classNames('card', {
      'card-bordered': bordered,
      [className]: !!className,
    })

    return (
      <div style={style} className={cls}>
        {head}
        <div style={contentStyle} className="card-content">
          {coverNode}
          {body}
        </div>
        {actionNode}
      </div>
    )
  }
}
