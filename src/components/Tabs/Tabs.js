import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Button from '../Button'
import Icon from '../Icon'
import Input from '../Input'
import './style/tabs.scss'

export default class Tabs extends Component {
  static propTypes = {
    defaultActiveKey: PropTypes.string,
    activeKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.string,
    onNextClick: PropTypes.func,
    onPrevClick: PropTypes.func,
    onChange: PropTypes.func,
    onEdit: PropTypes.func,
    onTitleEdit: PropTypes.func,
    children: PropTypes.any,
    destroyInactiveTabPane: PropTypes.bool,
    closable: PropTypes.bool,
    isAddTab: PropTypes.bool,
    addText: PropTypes.string,
    editable: PropTypes.bool,
    extra: PropTypes.node,
    inputMaxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    style: PropTypes.object,
    contentClass: PropTypes.string,
    contentStyle: PropTypes.object,
    affix: PropTypes.bool,
    offsetTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bounds: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    isAddTab: true,
    editable: true,
    affix: false,
    offsetTop: 0,
    bounds: 0,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeKey: null,
      isNavOverflow: false,
      showOverflowNav: false,
      editKey: null,
      isFixed: false,
    }
    this.inkInfo = {
      width: 0,
      left: 0,
    }
    this.translateX = 0
    this.inkBarRef = React.createRef()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      'activeKey' in nextProps &&
      nextProps.activeKey !== prevState.activeKey
    ) {
      return {
        activeKey: nextProps.activeKey,
      }
    }
    return null
  }

  componentDidMount() {
    this.getIsNavOverflow()
    window.addEventListener('scroll', this.handleScroll.bind(this))
  }

  componentDidUpdate = () => {
    this.getIsNavOverflow()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this))
    this.clearTimers()
  }

  clearTimers() {
    clearTimeout(this.setInkBarTimer)
    clearTimeout(this.fixNavBarTimer)
  }

  setTranslate = translateX => {
    const { navBarEl } = this.getRefsInfo
    if (navBarEl) {
      navBarEl.style.transform = translateX
      this.setInkBarPosition()
    }
  }

  handleScroll() {
    const navContainerEl = this.navContainerRef
    if (navContainerEl) {
      const navContainerRect = navContainerEl.getBoundingClientRect()
      const { isFixed } = this.state
      const { affix, offsetTop, bounds } = this.props
      if (affix) {
        if (navContainerRect.top < offsetTop + bounds) {
          if (!isFixed) {
            this.setState({
              isFixed: true,
            })
          }
        } else {
          if (isFixed) {
            this.setState({
              isFixed: false,
            })
          }
        }
      }
    }
  }

  /**
   * 判断 tabs 是否超出长度
   */
  getIsNavOverflow = () => {
    this.getRefsInfo
    const { navRect, navBarRect } = this.refsInfo
    const { isNavOverflow } = this.state
    this.setInkBarPosition()

    if (navBarRect.width > navRect.width && !isNavOverflow) {
      this.setState({
        isNavOverflow: true,
      })
    }
    if (navBarRect.width <= navRect.width && isNavOverflow) {
      this.setState({
        isNavOverflow: false,
      })
    }
    this.fixNavBarPosition()
  }
  /**
   * @param {*} direction 方向 -1: left 1: right
   * tabs 整体 水平 translate 事件
   */
  handleNavBarTranslate = direction => {
    if (!direction) return

    const { navRect, navBarRect } = this.getRefsInfo
    const stepWidth = navRect.width - 40

    if (navBarRect.width <= navRect.width) {
      return
    }
    // 向左移
    if (direction < 0) {
      // 如果tabs 最右边 已经不超出 或者超出的部分 小于 stepWidth
      // 让 tabs 向左移动 tabs 的宽度 多出来的距离
      // 即 让tabs 最右边正好不超出

      const hiddenWidth = navBarRect.right - navRect.right
      if (hiddenWidth < stepWidth) {
        const currentTranslateX = -(navBarRect.width - stepWidth)
        this.translateX = currentTranslateX
        this.setTranslate(`translateX(${currentTranslateX}px)`)
        return
      }
    }
    // 向右移
    if (direction > 0) {
      const hiddenWidth = navRect.left - navBarRect.left
      if (hiddenWidth < stepWidth) {
        this.translateX = 0
        this.setTranslate('translateX(0px)')
        return
      }
    }

    const distance = direction * stepWidth

    this.translateX = this.translateX + distance
    this.setTranslate(`translateX(${this.translateX}px)`)
  }
  /**
   * 点击一个 tab 的时候 判断该tab 是否部分被隐藏 然后移动 tabs
   */
  handleOneTabTranslate = () => {
    const { navRect, navBarEl, navBarRect } = this.refsInfo

    const activedEl = navBarEl.querySelector('.tabs-tab.is-actived')
    const { left, right } = activedEl
      ? activedEl.getBoundingClientRect()
      : { left: 0, right: 0 }

    if (left < navRect.left + 20) {
      this.setTranslate(`translateX(${navBarRect.left - left}px)`)
    }
    if (right > navRect.right - 20) {
      this.setTranslate(
        `translateX(${navBarRect.left -
          navRect.left -
          (right - navRect.right) -
          40}px)`
      )
    }
  }

  fixNavBarPosition = () => {
    this.fixNavBarTimer = setTimeout(() => {
      const { navRect, navBarRect, navBarEl } = this.refsInfo
      if (navBarEl) {
        let transform = navBarEl.style.transform
        if (navBarRect.width <= navRect.width) {
          transform = 'translateX(0px)'
        } else {
          if (navBarRect.left - 20 > navRect.left) {
            transform = 'translateX(0px)'
          }
          if (navBarRect.right < navRect.right - 20) {
            transform = `translateX(${navRect.width - navBarRect.width - 40}px)`
          }
        }
        if (transform) {
          navBarEl.style.transform = transform
        }
      }
    }, 100)
  }

  /**
   * 新增 tab 的时候 让最后一个不被隐藏
   */
  addTabTranslate = () => {
    const { navRect, navBarRect } = this.refsInfo
    if (this.state.isNavOverflow) {
      this.translateX = -(navBarRect.width - navRect.width + 40)
      this.setTranslate(`translateX(${this.translateX}px)`)
    }
  }
  /**
   * 获取 tabs 外层 和 tabs 的 dom信息
   */
  get getRefsInfo() {
    // eslint-disable-next-line
    const navEl = ReactDOM.findDOMNode(this.navRef)
    const navRect = navEl ? navEl.getBoundingClientRect() : {}

    // eslint-disable-next-line
    const navBarEl = ReactDOM.findDOMNode(this.navBarRef)
    const navBarRect = navBarEl ? navBarEl.getBoundingClientRect() : {}

    this.refsInfo = {
      navEl,
      navRect,
      navBarEl,
      navBarRect,
    }

    return this.refsInfo
  }

  /**
   * tab 点击事件
   * @param {*} tab
   * @param {*} event
   */
  handleTabClick(tab, index, event) {
    event.stopPropagation()
    this.activedTabEl = event.target
    if (!('activeKey' in this.props) && tab.key !== this.state.activeKey) {
      this.setState({ activeKey: tab.key })
    }
    if (tab.key !== this.state.activeKey) {
      const { onChange } = this.props
      onChange && onChange(tab.key, tab)
    }
    setTimeout(() => {
      this.handleOneTabTranslate(tab, index)
    })
  }

  /**
   * 删除tab
   */
  handleRemove = (tab, index, event) => {
    event.stopPropagation()
    const { onEdit } = this.props
    onEdit && onEdit('remove', tab.key, tab)
    if (!('activeKey' in this.props)) {
      const prevIndex = index - 1
      const prevKey = this.tabPanes[prevIndex >= 0 ? prevIndex : 0].key
      this.setState({
        activeKey: prevKey,
      })
    }
    this.setInkBarPosition()
  }

  /**
   * 增加 tab
   */
  handleAdd = event => {
    event.stopPropagation()
    const { onEdit } = this.props
    onEdit && onEdit('add')
    setTimeout(() => {
      this.addTabTranslate()
    })
  }

  handleChangeEditState = (key, event) => {
    event.stopPropagation()
    if (this.state.editKey) {
      this.setState({
        editKey: null,
      })
      return
    }
    this.setState({
      editKey: key,
    })
  }

  handleTitleEdit(key, event) {
    const { onTitleEdit } = this.props
    onTitleEdit && onTitleEdit(key, event.target.value)
    this.setState({
      editKey: null,
    })
  }
  /**
   * ink bar 位置计算
   */
  setInkBarPosition = () => {
    this.setInkBarTimer = setTimeout(() => {
      const { type } = this.props
      const { navRect, navBarEl } = this.getRefsInfo
      if (!type && navBarEl) {
        const activedEl = navBarEl.querySelector('.tabs-tab.is-actived')
        const { left, width } = activedEl
          ? activedEl.getBoundingClientRect()
          : { left: 0, width: 0 }

        // eslint-disable-next-line
        const inkBarEl = ReactDOM.findDOMNode(this.inkBarRef.current)
        if (inkBarEl) {
          inkBarEl.style.transform = `translateX(${left - navRect.left}px)`
          inkBarEl.style.width = `${width}px`
        }
      }
    }, 200)
  }

  renderSuffixIcon(key, child) {
    const { editable } = this.props
    let isEdit = editable
    if ('editable' in child) {
      isEdit = child.editable
    }
    return (
      isEdit && (
        <Icon
          key={`${key}-edit-icon`}
          onClick={e => this.handleChangeEditState(key, e)}
          type="edit"
        />
      )
    )
  }

  threnderExtra() {
    const { isAddTab, addText, extra } = this.props
    if (isAddTab) {
      return React.isValidElement(extra) ? (
        React.cloneElement(extra, { key: 'menu-add-btn' })
      ) : (
        <Button
          onClick={this.handleAdd}
          icon="plus"
          key="menu-add-btn"
          shape={!addText ? 'circle' : null}
          type="default"
          className="tabs-nav-button">
          {addText}
        </Button>
      )
    }
  }

  renderCloseIcon(pane, index) {
    const { closable } = this.props
    const { closable: paneClosable } = pane.props
    const isClosable = paneClosable !== undefined ? paneClosable : closable
    return (
      isClosable && (
        <Icon
          className="tabs-tab-close"
          type="close"
          onClick={e => this.handleRemove(pane, index, e)}
        />
      )
    )
  }

  renderTabs() {
    const { activeKey, editKey } = this.state
    const {
      children,
      destroyInactiveTabPane,
      inputMaxLength,
      type,
    } = this.props
    const tabNavs = []
    const tabPanes = []
    children &&
      React.Children.forEach(children, (child, index) => {
        if (!('tab' in child.props)) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Tabs 的 children 上必须有 tab 属性')
          }
          return
        }
        const { tab } = child.props

        let actived
        // 如果没有默认激活项 把第一个设置为 activevd
        if (!activeKey && index === 0) {
          actived = true
        } else {
          actived = activeKey === child.key
        }

        const classes = classNames('tabs-tab', {
          'is-actived': actived,
          'tabs-tab-button': !!type,
        })

        tabNavs.push(
          <div
            key={index}
            className={classes}
            onClick={this.handleTabClick.bind(this, child, index)}>
            <div className="tabs-tab-content">
              {editKey === (child.key || index) ? (
                <Input
                  key={`${child.key}-edit`}
                  size="small"
                  maxLength={inputMaxLength}
                  onBlur={this.handleTitleEdit.bind(this, child.key || index)}
                  bordered={false}
                  defaultValue={tab}
                  style={{ maxWidth: '80px' }}
                />
              ) : (
                tab
              )}
              {this.renderSuffixIcon(child.key || index, child.props)}
            </div>
            {this.renderCloseIcon(child, index)}
          </div>
        )
        tabPanes.push(
          React.isValidElement(child)
            ? React.cloneElement(child, {
              actived,
              destroyInactiveTabPane,
              key: child.key || `pane-${index}`,
            })
            : child
        )
      })
    return { tabNavs, tabPanes }
  }

  render() {
    const { tabNavs, tabPanes } = this.renderTabs()
    this.tabNavs = tabNavs || []

    this.tabPanes = tabPanes || []
    const { isFixed, isNavOverflow } = this.state

    const {
      className,
      style,
      offsetTop,
      bounds,
      type,
      isAddTab,
      contentClass,
      contentStyle,
    } = this.props

    const tabCls = classNames('tabs', {
      [className]: !!className,
    })

    const cls = classNames('tabs-nav', {
      'tabs-nav-overflow': isNavOverflow,
      'tabs-nav-bordered': !type,
      'tabs-nav-add': isAddTab,
    })

    const navStyle = isFixed
      ? {
        position: isFixed ? 'fixed' : 'relative',
        top: `${offsetTop + bounds}px`,
        left: this.refsInfo ? `${this.refsInfo.navRect.left}px` : undefined,
        width: this.refsInfo ? `${this.refsInfo.navRect.width}px` : undefined,
        zIndex: 100,
        padding: '5px 0',
      }
      : null

    const contentCls = classNames('tabs-content', {
      [contentClass]: contentClass,
    })
    return (
      <div style={style} className={tabCls}>
        <div
          ref={node => (this.navContainerRef = node)}
          className="tabs-nav-container">
          <div className="tabs-nav-content">
            <div
              style={navStyle}
              ref={node => (this.navRef = node)}
              className={cls}
              key="tabs-nav">
              {isNavOverflow && (
                <span className="tab-arrow">
                  <Icon
                    onClick={this.handleNavBarTranslate.bind(this, 1)}
                    type="left"
                  />
                </span>
              )}
              <div
                ref={node => (this.navBarRef = node)}
                className="tabs-nav-bar">
                {tabNavs}
              </div>
              {isNavOverflow && (
                <span className="tab-arrow">
                  <Icon
                    type="right"
                    onClick={this.handleNavBarTranslate.bind(this, -1)}
                  />
                </span>
              )}
            </div>
            {this.threnderExtra()}
          </div>
          {!type && this.tabNavs.length > 0 && (
            <div
              key="tabs-ink-bar"
              ref={this.inkBarRef}
              className="tabs-ink-bar"
            />
          )}
        </div>
        <div key="tabs-content" style={contentStyle} className={contentCls}>
          {tabPanes}
        </div>
      </div>
    )
  }
}
