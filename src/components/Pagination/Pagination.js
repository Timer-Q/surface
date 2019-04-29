import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../Icon'
import Select from '../Select'
import Input from '../Input'
import Pager from './Pager'
import './style/pagination.scss'

function noop() {}

export default class Pagination extends Component {
  static propTypes = {
    children: PropTypes.node,
    total: PropTypes.number,
    pageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    defaultPageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    current: PropTypes.number,
    defaultCurrent: PropTypes.number,
    onChange: PropTypes.func,
    showSizeChanger: PropTypes.bool,
    pageSizeOptions: PropTypes.array,
    onSizeChange: PropTypes.func,
    showQuickJumper: PropTypes.bool,
    showTotal: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    size: PropTypes.oneOf(['small', 'default']),
  }

  static defaultProps = {
    total: 0,
    defaultPageSize: '10',
    defaultCurrent: 1,
    onChange: noop,
    showSizeChanger: false,
    pageSizeOptions: ['10', '20', '30', '40'],
    onSizeChange: noop,
    showQuickJumper: false,
    showTotal: false,
    size: 'default',
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.overflowBound = 5
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const state = {
      current: prevState.current || nextProps.defaultCurrent,
      pageSize: prevState.pageSize || nextProps.defaultPageSize,
      total: prevState.total || nextProps.total,
    }
    if ('current' in nextProps) {
      state.current = nextProps.current
    }
    if ('pageSize' in nextProps) {
      state.pageSize = nextProps.pageSize
    }
    if ('total' in nextProps) {
      state.total = nextProps.total
    }
    return state
  }

  handleChange = page => {
    const current = this.calculateCurrent(page)
    if (!('current' in this.props)) {
      this.setState({
        current,
      })
    }
    const { onChange } = this.props
    onChange(current)
  }

  calculateCurrent = (value = this.state.current) => {
    let current = value
    if (current < 1) {
      current = 1
    }
    if (current > this.allPages) {
      current = this.allPages
    }
    return current
  }

  handleStep(step) {
    const { current: prevCurrent } = this.state
    const current = prevCurrent + step
    this.handleChange(current)
  }

  getAllPages(pageSize = this.state.pageSize) {
    const { total } = this.props
    const result = Math.ceil(total / pageSize)
    const allPages = result >= 1 ? result : 1
    return allPages
  }

  hanglePageSizeChange = pageSize => {
    this.allPages = this.getAllPages(pageSize)
    const current = this.calculateCurrent()
    this.setState({
      pageSize,
      current,
    })
    const { onSizeChange } = this.props
    onSizeChange(pageSize)
  }

  handleJumpPage = () => {
    const { jumpValue } = this.state
    this.setState({
      jumpValue: '',
    })
    this.handleChange(+jumpValue)
  }

  renderPages() {
    let { pageSize, current } = this.state

    this.allPages = this.getAllPages(pageSize)

    if (this.allPages < current) {
      current = this.allPages
    }

    const firstPage = (
      <Pager key={1} onChange={this.handleChange} current={current} page={1} />
    )

    const lastPage = (
      <Pager
        key={this.allPages}
        onChange={this.handleChange}
        current={current}
        page={this.allPages}
      />
    )

    const jumpPrev = (
      <li
        className="pagination-more prev"
        onClick={this.handleStep.bind(this, -this.overflowBound)}
        title={`向前 ${this.overflowBound} 页`}
        key="pagination-prev-more">
        <span className="pagination-more-ellipsis">•••</span>
        <Icon className="pagination-more-icon" type="double-left" />
      </li>
    )
    const jumpNext = (
      <li
        className="pagination-more next"
        onClick={this.handleStep.bind(this, this.overflowBound)}
        title={`向后 ${this.overflowBound} 页`}
        key="pagination-next-more">
        <span className="pagination-more-ellipsis">•••</span>
        <Icon className="pagination-more-icon" type="double-right" />
      </li>
    )

    let pageList = []
    if (this.allPages <= this.overflowBound + 2) {
      for (let i = 1; i <= this.allPages; i += 1) {
        pageList.push(
          <Pager
            key={i}
            onChange={this.handleChange}
            current={current}
            page={i}
          />
        )
      }
    } else {
      if (current <= this.overflowBound) {
        for (let i = 1; i < this.overflowBound + 2; i += 1) {
          pageList.push(
            <Pager
              key={i}
              onChange={this.handleChange}
              current={current}
              page={i}
            />
          )
        }
        pageList.push(jumpNext)
        pageList.push(lastPage)
      } else if (current < this.allPages - 2) {
        pageList.push(firstPage)
        pageList.push(jumpPrev)
        for (let i = current - 2; i <= current + 2; i += 1) {
          pageList.push(
            <Pager
              key={i}
              onChange={this.handleChange}
              current={current}
              page={i}
            />
          )
        }
        pageList.push(jumpNext)
        pageList.push(lastPage)
      } else {
        pageList.push(firstPage)
        pageList.push(jumpPrev)
        for (
          let i = this.allPages - this.overflowBound;
          i <= this.allPages;
          i += 1
        ) {
          pageList.push(
            <Pager
              key={i}
              onChange={this.handleChange}
              current={current}
              page={i}
            />
          )
        }
      }
    }

    return pageList
  }

  render() {
    const { current, pageSize, jumpValue } = this.state
    const {
      showSizeChanger,
      pageSizeOptions,
      showQuickJumper,
      showTotal,
      total,
      className,
      style,
      size,
    } = this.props
    const pageList = this.renderPages()

    const isMin = current === 1 || this.allPages === 1
    const isMax = current === this.allPages || this.allPages === 1

    const prevCls = classNames('pagination-item prev', {
      disabled: isMin,
    })

    const nextCls = classNames('pagination-item next', {
      disabled: isMax,
    })

    const cls = classNames('pagination', {
      [className]: className,
      [`pagination-${size}`]: size,
    })

    return (
      <ul style={style} className={cls}>
        <li onClick={this.handleStep.bind(this, -1)} className={prevCls}>
          <Icon type="left" />
        </li>
        {pageList}
        <li onClick={this.handleStep.bind(this, 1)} className={nextCls}>
          <Icon type="right" />
        </li>
        <li className="pagination-addon">
          {showSizeChanger && (
            <Select
              value={pageSize}
              onChange={this.hanglePageSizeChange}
              className="pagination-select"
              size="small">
              {pageSizeOptions.map((option, index) => (
                <Select.Option value={option} key={index}>
                  {`${option} 条/页`}
                </Select.Option>
              ))}
            </Select>
          )}
          {showQuickJumper && (
            <span className="pagination-extra">
              跳至
              <Input
                size="small"
                value={jumpValue}
                onPressEnter={this.handleJumpPage}
                onChange={value => this.setState({ jumpValue: value })}
              />
              页
            </span>
          )}
          {showTotal && <span className="pagination-extra">共{total}条</span>}
        </li>
      </ul>
    )
  }
}
