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
    scrollLeft: PropTypes.number,
    scrollTop: PropTypes.number,
    changeScroll: PropTypes.func,
  }

  static defaultProps = {
    columns: [],
    scroll: {},
    scrollLeft: 0,
    scrollTop: 0,
    changeScroll: noop,
  }

  constructor(props) {
    super(props)
    this.tableHeaderRef = React.createRef()
  }

  componentDidUpdate() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.setScroll()
        this.ticking = false
      })
    }
    this.ticking = true
  }

  setScroll = () => {
    const { scrollLeft, scrollTop } = this.props
    const { current } = this.tableHeaderRef
    if (current) {
      current.scrollLeft = scrollLeft
      current.scrollTop = scrollTop
    }
  }

  handleScroll = event => {
    const { scrollLeft } = event.target
    const { changeScroll, scrollLeft: propsScrollLeft } = this.props
    if (scrollLeft !== propsScrollLeft) {
      changeScroll(scrollLeft)
    }
  }

  render() {
    const { columns, children, scroll } = this.props
    let styles = {}
    const scrollBarWidth = getScrollBarWidth()
    if (scroll.x) {
      styles.marginBottom = '-15px'
      styles.paddingBottom = '15px'
      if (scrollBarWidth > 0) {
        styles.paddingBottom = 0
      }
      styles.overflowX = 'auto'
    }
    return (
      <div className="table-head-hide-scrollbar">
        <div
          onScroll={this.handleScroll}
          ref={this.tableHeaderRef}
          style={styles}
          className="table-head">
          <table style={{ width: scroll.x }}>
            <ColGroup key="table-scroll-header-col-group" columns={columns} />
            {children}
          </table>
        </div>
      </div>
    )
  }
}
