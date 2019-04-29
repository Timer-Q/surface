import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Provider } from './context'
import './style/menu.scss'

class Menu extends Component {
  static propTypes = {
    children: PropTypes.node,
    onSelect: PropTypes.func, // 菜单激活回调 (index: 选中菜单项的)
    mode: PropTypes.oneOf(['horizontal', 'vertical']), // horizontal,vertical 水平的 还是垂直的
    defaultActive: PropTypes.string, // 当前激活菜单的 index
    defaultOpeneds: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // 当前打开的submenu的 key 数组
    uniqueOpened: PropTypes.bool, // 是否只保持一个子菜单的展开
    activeIndex: PropTypes.array,
    addonBefore: PropTypes.node,
    addonAfter: PropTypes.node,
    affix: PropTypes.bool,
    theme: PropTypes.oneOf(['light', 'dark']),
    className: PropTypes.string,
    showArrow: PropTypes.bool,
    collapsed: PropTypes.bool,
  }

  static defaultProps = {
    theme: 'light',
  }

  constructor(props) {
    super(props)
    this.state = {
      activeIndex: [],
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const state = {
      activeIndex: nextProps.activeIndex || prevState.activeIndex,
      openedMenus: prevState.openedMenus || [],
    }
    if ('defaultOpeneds' in nextProps) {
      state.openedMenus = nextProps.defaultOpeneds
    }
    return state
  }

  /**
   * MenuItem click 调用事件
   * @param {*} indexs 点击的 MenuItem 以及 其父组件的 index(props) 组成的数组
   * @param {*} instance 点击的 MenuItem
   */
  handleSelect = (indexs, instance) => {
    let { openedMenus } = this.state

    if (!('activeIndex' in this.props)) {
      this.setState({
        activeIndex: indexs,
      })
    }
    const { onSelect } = this.props
    if (onSelect) {
      onSelect(indexs, openedMenus, instance)
    }
  }

  openMenu = index => {
    let { openedMenus } = this.state
    const { mode } = this.props

    if (openedMenus.indexOf(index) !== -1) return

    if (mode === 'horizontal') {
      openedMenus = [index]
    } else {
      if (!openedMenus.includes(index)) {
        openedMenus.push(index)
      }
    }

    this.setState({ openedMenus })
  }

  closeMenu = index => {
    let { openedMenus } = this.state

    openedMenus.splice(openedMenus.indexOf(index), 1)
    this.setState({ openedMenus })
  }

  render() {
    const {
      mode,
      theme,
      children,
      addonBefore,
      addonAfter,
      affix,
      className,
      showArrow,
      collapsed,
      ...rest
    } = this.props
    const { openedMenus, activeIndex } = this.state
    const menuCls = classNames('menu', {
      'menu-fixed': affix,
      [`menu-${mode}`]: mode,
      [`menu-${theme}`]: theme,
      'menu-collapsed': collapsed,
      [className]: className,
    })
    const wrapperCls = classNames('menu-wrapper', {
      [`menu-wrapper-${mode}`]: mode,
    })
    
    return (
      <Provider
        value={{
          openedMenus,
          openMenu: this.openMenu,
          mode,
          closeMenu: this.closeMenu,
          handleSelect: this.handleSelect,
          onCollapse: this.onCollapse,
          activeIndex,
          showArrow,
          collapsed: collapsed,
          allowToggleExpand: rest.allowToggleExpand,
        }}>
        <div className={wrapperCls}>
          <div className={menuCls}>
            {addonBefore
              ? React.cloneElement(addonBefore, { key: 'menu-addon-before' })
              : null}
            {children && (
              <ul className="menu-item-wrapper">
                {React.Children.map(children, (child, index) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                      handleSelect: this.handleSelect.bind(this),
                      key: child.key || child.props.index || index,
                    })
                  }
                  return child
                })}
              </ul>
            )}
            {addonAfter
              ? React.cloneElement(addonAfter, { key: 'menu-addon-after' })
              : null}
          </div>
        </div>
      </Provider>
    )
  }
}

export default Menu
