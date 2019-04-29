## NavMenu 导航菜单

为网站提供导航功能的菜单。

### 顶栏

适用广泛的基础用法。

::: demo

```js
render() {
  const logo = (
    <Icon
      style={{ marginLeft: "24px", color: "#fff", fontSize: "24px" }}
      type="logo"
    />
  )

  const style = {
    paddingRight: '20px',
    color: '#ddd',
  }

  const userInfo = (
    <div style={style}>
      addonAfter
    </div>
  )

  return (
    <div style={{height: "150px"}}>
      <Menu
        affix={false}
        mode="horizontal"
        addonBefore={logo}
        addonAfter={userInfo}>
        <Menu.SubMenu key="1" index="1" title="商品概述">
          <Menu.Item key='1-1' index='1-1'>
            基础信息
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="2" index="2" title="商品详情">
          <Menu.Item key='2-1' index='2-1'>
            商品详情
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="3" index="3" title="套餐介绍">
          <Menu.Item key='3-1' index='3-1'>
            套餐介绍
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="4" index="4" title="购买须知">
          <Menu.Item key='4-1' index='4-1'>
            购买须知
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </div>
  )
}

onSelect() {

}
```

:::

### 侧栏

适用广泛的基础用法。

::: demo

```js
constructor(props) {
  super(props)
  this.menusData = [
    {
      label: "信息管理",
      children: []
    },
    {
      label: "最近使用",
      children: [
        { label: "订单管理" },
        { label: "活动报名" },
        { label: "店铺动态" },
        { label: "数据中心" },
        { label: "产品详情推荐" },
        { label: "取还地址管理" }
      ]
    },
    {
      label: "开放平台",
      children: [
        { label: "开发者配置" },
        { label: "支持中心" },
        { label: "文档中心" }
      ]
    },
    {
      label: "产品管理",
      children: [
        { label: "产品管理" },
        { label: "发布产品" },
        { label: "产品详情推荐" },
        { label: "退改模板管理" },
        { label: "取还地址管理" },
        { label: "出行信息模板" }
      ]
    }
  ]

  this.defaultOpeneds = []
  this.depths = 0
}

renderMenus(menus = this.menusData) {
    this.depths += 1
    const activeStyle = {
      backgroundColor: "transparent"
    }

    return menus.map((item, index) => {
      if (item.children) {
        if (!this.defaultOpeneds.includes(`${this.depths}-${index}`)) {
          this.defaultOpeneds.push(`${this.depths}-${index}`)
        }

        return (
          <Menu.SubMenu
            type="flat"
            key={`${this.depths}-${index}`}
            index={`${this.depths}-${index}`}
            title={item.label}>
            {this.renderMenus(item.children)}
          </Menu.SubMenu>
        )
      } else {
        return (
          <Menu.Item
            className="side-menu-item"
            activeStyle={activeStyle}
            key={`${this.depths}-${index}`}
            index={`${this.depths}-${index}`}>
            {item.label}
          </Menu.Item>
        )
      }
    })
  }

render() {
  const logo = <div style={{textAlign: 'center'}}>
    <Icon
      style={{ color: "#fff", fontSize: "24px" }}
      type="logo"
    />
  </div>

  const style = {
    color: '#fff',
    textAlign: 'center'
  }

  const userInfo = (
    <div style={style}>
      addonAfter
    </div>
  )

  const menuItemStyle = {
    display: 'inline-block',
    paddingLeft: '10px',
  }

  const activeStyle = {
    backgroundColor: 'transparent'
  }

  const menus = this.renderMenus()

  return (
    <Menu
      showArrow={false}
      affix={false}
      mode="vertical"
      addonBefore={logo}
      addonAfter={userInfo}
      theme="dark"
      allowToggleExpand={false}
      onSelect={(a, b, c) => console.log(a, b, c)}
      defaultOpeneds={this.defaultOpeneds}>
      {menus}
    </Menu>
  )
}
```

:::

### 展开收起菜单功能

#### 适用于无 addonBefore 和 addonAfter 情况

点击自定义元素可展开收起菜单展现，隐藏/显示文案

::: demo

```js
constructor(props) {
  super(props)
  this.menusData = [
    {
      label: "最近使用",
      children: [
        { label: "订单管理" },
        { label: "活动报名" },
        { label: "店铺动态" },
        { label: "数据中心" },
        { label: "产品详情推荐" },
        { label: "取还地址管理" }
      ]
    },
    {
      label: "开放平台",
      children: [
        { label: "开发者配置" },
        { label: "支持中心" },
        { label: "文档中心" }
      ]
    },
    {
      label: "产品管理",
      children: [
        { label: "产品管理" },
        { label: "发布产品" },
        { label: "产品详情推荐" },
        { label: "退改模板管理" },
        { label: "取还地址管理" },
        { label: "出行信息模板" }
      ]
    }
  ]
  this.defaultOpeneds = []
  this.depths = 0
  this.collapsed = true
}

renderMenus(menus = this.menusData) {
    this.depths += 1

    return menus.map((item, index) => {
      if (item.children && item.children.length) {
        if (!this.defaultOpeneds.includes(`${this.depths}-${index}`)) {
          this.defaultOpeneds.push(`${this.depths}-${index}`)
        }

        return (
          <Menu.SubMenu
            type="flat"
            key={`${this.depths}-${index}`}
            index={`${this.depths}-${index}`}
            title={<span><Icon type="logo-basic"/><span>{item.label}</span></span>}>
            {this.renderMenus(item.children)}
          </Menu.SubMenu>
        )
      } else {
        return (
          <Menu.Item
            className="side-menu-item"
            key={`${this.depths}-${index}`}
            index={`${this.depths}-${index}`}>
            {item.label}
          </Menu.Item>
        )
      }
    })
  }

render() {
  const logo = (
    <Icon
      style={{ color: "#fff", fontSize: "24px" }}
      type="logo"
    />
  )

  const style = {
    color: '#ddd',
  }

  const menuItemStyle = {
    display: 'inline-block',
    paddingLeft: '10px',
  }

  const activeStyle = {
    backgroundColor: 'transparent'
  }

  const menus = this.renderMenus()

  return (
    <Menu
      affix={false}
      mode="vertical"
      theme="dark"
      collapsed={this.collapsed}
      defaultOpeneds={this.defaultOpeneds}>
      {menus}
    </Menu>
  )
}

onSelect() {

}
```

:::

### Menu Attribute

| 参数           | 说明                                                 | 类型    | 可选值              | 默认值   |
| -------------- | ---------------------------------------------------- | ------- | ------------------- | -------- |
| mode           | 模式                                                 | string  | horizontal,vertical | vertical |
| theme          | 主题色                                               | string  | light,dark          | light    |
| defaultActive  | 当前激活菜单的 index                                 | string  | —                   | —        |
| defaultOpeneds | 当前打开的 submenu 的 key 数组                       | Array   | —                   | —        |
| uniqueOpened   | 是否只保持一个子菜单的展开                           | boolean | —                   | false    |
| menuTrigger    | 子菜单打开的触发方式(只在 mode 为 horizontal 时有效) | string  | —                   | hover    |

### Menu Events

| 事件名称 | 说明               | 回调参数                                                                 |
| -------- | ------------------ | ------------------------------------------------------------------------ |
| onSelect | 菜单激活回调       | index: 选中菜单项的 indexPath: 选中菜单项的 index path                   |
| onOpen   | SubMenu 展开的回调 | index: 打开的 subMenu 的 index， indexPath: 打开的 subMenu 的 index path |
| onClose  | SubMenu 收起的回调 | index: 收起的 subMenu 的 index， indexPath: 收起的 subMenu 的 index path |

### SubMenu Attribute

| 参数  | 说明     | 类型   | 可选值 | 默认值 |
| ----- | -------- | ------ | ------ | ------ |
| index | 唯一标志 | string | —      | —      |

### MenuItem Attribute

| 参数  | 说明     | 类型   | 可选值 | 默认值 |
| ----- | -------- | ------ | ------ | ------ |
| index | 唯一标志 | string | —      | —      |

### MenuGroup Attribute

| 参数  | 说明     | 类型   | 可选值 | 默认值 |
| ----- | -------- | ------ | ------ | ------ |
| title | 分组标题 | string | —      | —      |

# Menu 实现

## 1. 属性

> Menu

| 属性 / 方法 | 说明                  | 类型              | 默认值 / 可选值                                        |
| :---------- | :-------------------- | :---------------- | :----------------------------------------------------- |
| onSelect    | 菜单激活回调          | func              | -                                                      |
| mode        | 菜单的展现形式        | string            | horizontal / ## NavMenu 导航菜单                       |
| collapsed   | 菜单的展开收起        | boolean           | false(注：有 addonAfter 和 addonBefore 信息的暂不支持) |
| onCollapse  | 展开-收起时的回调函数 | (collapsed) => {} |                                                        |

为网站提供导航功能的菜单。

> SubMenu

| 属性 / 方法  | 说明         | 类型   | 默认值 / 可选值 |
| :----------- | :----------- | :----- | :-------------- |
| handleSelect | 菜单切换回调 | func   | -               |
| index        | 菜单唯一标识 | string | -               |

> MenuItem

| 属性 / 方法 | 说明         | 类型   | 默认值 / 可选值 |
| :---------- | :----------- | :----- | :-------------- |
| index       | 菜单唯一标识 | string | -               |
| disabled    | 菜单是否禁用 | bool   | -               |

## 2. 组件分析

> MenuItem

- 点击的时候将自己的 index 向上级传
- 显示是否被激活

> SubMenu

- 控制菜单的显示/隐藏
- 根据 activeIndex(激活项) 判断所属当前 SubMenu 的 MenuItem 是否被激活
- 鼠标进入/离开 切换 显示/隐藏状态
- 抛出 handleSelect 给 MenuItem

> Menu

- 存储 打开的菜单项（openedMenus）
- 存储 激活项（activeIndex: array）
- 抛出 openMenu 给 SubMenu
- 抛出 closeMenu 给 SubMenu
- 抛出 handleSelect 给 SubMenu

## 3. 组件实现

> MenuItem -> onClick([index]) => handleSelect([index]) => SubMenu => handleSelect([index, index]) => Menu

> activeIndex => SubMenu => loopMenuItemRecursively(children, activeIndex, ret) => isActived => MenuItem => isActived

```jsx
// MenuItem
active() {
  const { index, activeIndex } = this.props
  return index === activeIndex || activeIndex.indexOf(index) > -1
}

handleClick = () => {
  const { index, handleSelect } = this.props
  handleSelect([index], this)
}

render() {
  const { disabled, children } = this.props
  return (
    <li
      className={classNames('menu-item', {
        'is-active': this.active(),
        'is-disabled': disabled
      })}
      onClick={this.handleClick}>
      {children}
    </li>
  )
}
```

```jsx
// SubMenu
handleActiveChange = (itemIndex, menuItemInstance) => {
  const { handleSelect, index } = this.props
  const indexs = [index].concat(itemIndex)
  handleSelect && handleSelect(indexs, menuItemInstance)
}

renderChildren = () => {
  const { children } = this.props
  const newChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        handleSelect: this.handleActiveChange.bind(this)
      })
    }
  })
  return <ul className="sub-menu-wrapper">{newChildren}</ul>
}

isChildrenSelected() {
  const { activeIndex } = this.props
  const result = { isChildrenSelected: false }
  loopMenuItemRecursively(this.props.children, activeIndex, result)
  return result.isChildrenSelected
}

render() {
  this.isActive = this.isChildrenSelected()
  // ...
}
```

```jsx
// Menu
static getDerivedStateFromProps(nextProps) {
  return {
    activeIndex: nextProps.activeIndex
  }
}

handleSelect = (indexs, instance) => {
  let { openedMenus } = this.state

  if (!('activeIndex' in this.props)) {
    this.setState({
      activeIndex: indexs
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
    if (openedMenus.indexOf(index) < 0) {
      openedMenus.push(index)
    }
  }

  this.setState({ openedMenus })
}

render() {
  const { mode, children, addonBefore, addonAfter } = this.props
  const { openedMenus, activeIndex } = this.state
  return (
    <Provider
      value={{
        openedMenus: openedMenus,
        openMenu: this.openMenu,
        mode: mode,
        closeMenu: this.closeMenu,
        handleSelect: this.handleSelect,
        activeIndex: activeIndex
      }}>
      <div className="menu-wrapper">
        <div className="menu">
          {addonBefore}
          <div className="menu-item-wrapper">
            {React.Children.map(children, child => {
              return React.cloneElement(child, {
                handleSelect: this.handleSelect.bind(this)
              })
            })}
          </div>
          {addonAfter}
        </div>
      </div>
    </Provider>
  )
}
```

## 4. 使用

```jsx
this.state = {
  subMenus: this.subMenus,
  activeIndex: ["1-1"]
}

<Menu
  addonBefore={logo}
  addonAfter={userInfo}
  activeIndex={activeIndex}
  className="menu"
  mode="horizontal">
  <Menu.SubMenu index="1" title="商品概述">
    <Menu.Item key='1-1' index='1-1'>
      基础信息
    </Menu.Item>
  </Menu.SubMenu>
  <Menu.SubMenu index="2" title="商品详情">
    {subMenus["2"]}
  </Menu.SubMenu>
  <Menu.SubMenu index="3" title="套餐介绍">
    {subMenus["3"]}
  </Menu.SubMenu>
  <Menu.SubMenu index="4" title="购买须知">
    {subMenus["4"]}
  </Menu.SubMenu>
</Menu>
```

## 5. 遇到问题

> 暂无

// TODO:
mode =》 vertical 未实现
