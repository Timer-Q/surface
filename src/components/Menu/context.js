import React from 'react'
import MenuItem from './MenuItem'
import SubMenu from './SubMenu'

export const { Provider, Consumer } = React.createContext()

export function MenuItemWithConsumer(props) {
  return (
    <Consumer>
      {context => {
        return (
          <MenuItem
            {...props}
            activeIndex={context.activeIndex}
            // handleSelect={context.handleSelect}
            pageYOffset={context.pageYOffset}
          />
        )
      }}
    </Consumer>
  )
}

MenuItemWithConsumer.isMenuItem = true

export function SubMenuWithConsumer(props) {
  return (
    <Consumer>
      {context => {
        return (
          <SubMenu
            showArrow={context.showArrow}
            {...props}
            openedMenus={context.openedMenus}
            openMenu={context.openMenu}
            mode={context.mode}
            handleSelect={context.handleSelect}
            closeMenu={context.closeMenu}
            activeIndex={context.activeIndex}
            indexPath={context.indexPath}
            collapsed={context.collapsed}
            allowToggleExpand={context.allowToggleExpand}
          />
        )
      }}
    </Consumer>
  )
}

SubMenuWithConsumer.isSubMenu = true
