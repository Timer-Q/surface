import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Icon from '../Icon'
import Popover from '../Popover'
import { loopMenuItemRecursively } from './utils'

export default class SubMenu extends Component {
  static propTypes = {
    children: PropTypes.any,
    handleSelect: PropTypes.func,
    index: PropTypes.string,
    openedMenus: PropTypes.array,
    mode: PropTypes.string,
    openMenu: PropTypes.func,
    closeMenu: PropTypes.func,
    title: PropTypes.node,
    activeIndex: PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string,
    type: PropTypes.oneOf(['flat', 'list']),
    collapsed: PropTypes.bool,
    showArrow: PropTypes.bool,
    allowToggleExpand: PropTypes.bool,
  }

  static defaultProps = {
    showArrow: true,
    allowToggleExpand: true,
  }

  static isSubMenu = true

  isChildrenSelected() {
    const { activeIndex, index } = this.props
    const result = { isChildrenSelected: false }
    if (this.computedChildren) {
      loopMenuItemRecursively(this.props.children, activeIndex, result)
    } else if (activeIndex.includes(index)) {
      result.isChildrenSelected = true
    }

    return result.isChildrenSelected
  }

  opened() {
    if (this.computedChildren) {
      return this.props.openedMenus.includes(this.props.index)
    }
    return false
  }

  handleMouseEnter() {
    if (this.props.mode === 'horizontal') {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.props.openMenu(this.props.index)
      }, 300)
    }
  }

  handleMouseLeave() {
    clearTimeout(this.timeout)
    const { mode } = this.props
    if (mode === 'horizontal') {
      this.timeout = setTimeout(() => {
        this.props.closeMenu(this.props.index)
      }, 300)
    }
  }

  handleClick(event) {
    event.stopPropagation()
    const {
      mode,
      openMenu,
      closeMenu,
      index,
      children,
      allowToggleExpand,
    } = this.props
    if (allowToggleExpand) {
      if (mode === 'vertical') {
        if (!this.isOpened) {
          openMenu(index)
        } else {
          closeMenu(index)
        }
      }
    }
    if (React.Children.count(children) === 0) {
      const { handleSelect } = this.props
      if (handleSelect) {
        handleSelect([index], this)
      }
    }
  }

  handleActiveChange = (itemIndex, menuItemInstance) => {
    const { handleSelect, index } = this.props
    const indexs = [index].concat(itemIndex)
    handleSelect && handleSelect(indexs, menuItemInstance)
  }

  renderChildren = () => {
    const { children, collapsed } = this.props
    const newChildren = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          handleSelect: this.handleActiveChange.bind(this),
          key: child.key || child.props.index || index,
        })
      }
      return child
    })

    const cls = classNames('sub-menu-wrapper', {
      'sub-menu-collapsed': collapsed,
    })

    if (newChildren && newChildren.length > 0) {
      return <ul className={cls}>{newChildren}</ul>
    }
    return null
  }

  render() {
    this.computedChildren = this.renderChildren()

    this.isActive = this.isChildrenSelected()
    this.isOpened = this.opened()

    const {
      title,
      className,
      style,
      type,
      collapsed,
      showArrow,
      mode,
    } = this.props

    const classes = classNames('sub-menu', {
      'is-active': this.isActive,
      'is-opened': this.isOpened,
      [className]: className,
      [`sub-menu-${type}`]: type,
      [`sub-menu-${mode}`]: mode,
      'sub-menu-childless': !this.computedChildren,
    })

    let subMenu = (
      <li
        style={style}
        className={classes}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        onClick={this.handleClick.bind(this)}
        ref={node => (this.subMenuRef = node)}>
        <div className="sub-menu-title">
          {title}
          {showArrow && (
            <Icon key="sub-menu-title-icon" className="menu-icon" type="down" />
          )}
        </div>
        {this.computedChildren}
      </li>
    )

    if (collapsed) {
      const titleCls = classNames('sub-menu-title', {
        'sub-menu-title-collapsed': collapsed,
      })
      subMenu = (
        <li
          style={style}
          className={classes}
          onMouseEnter={this.handleMouseEnter.bind(this)}
          onMouseLeave={this.handleMouseLeave.bind(this)}
          onClick={this.handleClick.bind(this)}
          ref={node => (this.subMenuRef = node)}>
          <Popover
            trigger="hover"
            style={{ width: '100%' }}
            placement="right-start"
            content={this.computedChildren}>
            <div className="sub-menu-title">
              <span className={titleCls}>
                {title}
                {!collapsed && showArrow && (
                  <Icon
                    key="sub-menu-title-icon"
                    className="menu-icon"
                    type="down"
                  />
                )}
              </span>
            </div>
          </Popover>
        </li>
      )
    }

    return subMenu
  }
}
