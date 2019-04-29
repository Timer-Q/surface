import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ColGroup from './ColGroup'
import { getScrollBarWidth } from './utils'

function noop() {}

export default class TableScrollBody extends Component {
  static propTypes = {
    columns: PropTypes.array,
    scroll: PropTypes.object,
    children: PropTypes.node,
    changeScroll: PropTypes.func,
    scrollLeft: PropTypes.number,
    scrollTop: PropTypes.number,
    setScrollTop: PropTypes.func,
    fixed: PropTypes.bool,
  }

  static defaultProps = {
    columns: [],
    scroll: {},
    changeScroll: noop,
    scrollLeft: 0,
    scrollTop: 0,
    setScrollTop: noop,
  }

  constructor(props) {
    super(props)
    this.tableBodyRef = React.createRef()
  }

  componentDidUpdate() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.setScrollLeft()
        this.ticking = false
      })
    }
    this.ticking = true
  }

  handleScroll = event => {
    if (event.target !== this.tableBodyRef.current) {
      return
    }
    const { scrollLeft, scrollTop } = event.target
    const {
      changeScroll,
      setScrollTop,
      scrollLeft: propsScrollLeft,
      scrollTop: propsScrollTop,
    } = this.props
    if (scrollLeft !== propsScrollLeft) {
      changeScroll(scrollLeft)
    }
    if (scrollTop !== propsScrollTop) {
      setScrollTop(scrollTop)
    }
  }

  setScrollLeft = () => {
    const { current } = this.tableBodyRef
    const { scrollLeft, scrollTop } = this.props
    if (current) {
      current.scrollLeft = scrollLeft
      current.scrollTop = scrollTop
    }
  }

  render() {
    const { columns, scroll, children, fixed } = this.props
    const scrollBarWidth = getScrollBarWidth()
    // TODO: scrollbar width
    const style = {}
    if (fixed) {
      style.marginRight = '-15px'
      style.paddingRight = '15px'
      if (scrollBarWidth > 0) {
        style.paddingRight = '0'
        style.marginBottom = '-15px'
        style.paddingBottom = '15px'
      }
    }
    if (scroll.x) {
      style.overflowX = 'auto'
    }
    if (scroll.y) {
      style.overflowY = 'auto'
      style.maxHeight = scroll.y
    }

    return (
      <div
        className="table-body-hide-scrollbar"
        onScroll={this.handleScroll.bind(this)}
        ref={this.tableBodyRef}
        style={style}>
        <div className="table-body">
          <table style={{ width: scroll.x }}>
            <ColGroup key="table-scroll-body-col-group" columns={columns} />
            {children}
          </table>
        </div>
      </div>
    )
  }
}
