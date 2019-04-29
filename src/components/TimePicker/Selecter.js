import React, { Component } from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { scrollTo } from './utils'

export default class Selecter extends Component {
  static propTypes = {
    options: PropTypes.array,
    selectedIndex: PropTypes.number,
    onSelect: PropTypes.func,
    type: PropTypes.string,
    size: PropTypes.oneOf(['small', 'default', 'large']),
  }

  static defaultProps = {
    size: 'default',
  }

  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
  }

  componentDidMount() {
    this.scrollToSelected(0)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedIndex !== this.props.selectedIndex) {
      this.scrollToSelected(120)
    }
  }

  handleMouseEnter = () => {
    if (!this.state.active) {
      this.setState({ active: true })
    }
  }

  handleMouseLeave = () => {
    if (this.state.active) {
      this.setState({ active: false })
    }
  }

  handleSelect = (value, option, event) => {
    event.stopPropagation()
    const { onSelect, type } = this.props
    onSelect && onSelect(type, value, option)
  }

  renderOptions = () => {
    const { options, selectedIndex } = this.props
    return options.map((option, index) => {
      const classes = classNames('timepicker-panel-selecter-item', {
        'timepicker-selected': selectedIndex === index,
        'timepicker-disabled': option.disabled,
      })
      let onclick = null
      if (!option.disabled) {
        onclick = this.handleSelect
      }
      return (
        <li
          className={classes}
          key={index}
          onClick={e => onclick(option.value, option, e)}
          disabled={option.disabled}>
          {option.value}
        </li>
      )
    })
  }

  scrollToSelected(duration) {
    // eslint-disable-next-line
    const selecter = ReactDom.findDOMNode(this)
    // eslint-disable-next-line
    const list = ReactDom.findDOMNode(this.list)

    if (!list) return

    const { selectedIndex } = this.props
    let index = selectedIndex
    if (index < 0) {
      index = 0
    }
    const topOption = list.children[index]
    const to = topOption.offsetTop
    scrollTo(selecter, to, duration)
  }

  render() {
    const { size } = this.props
    const classes = classNames('timepicker-panel-selecter', {
      'timepicker-panel-selecter-active': this.state.active,
      [`timepicker-panel-selecter-${size}`]: size,
    })

    return (
      <div
        className={classes}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}>
        <ul
          className="timepicker-panel-selecter-list"
          ref={node => (this.list = node)}>
          {this.renderOptions()}
        </ul>
      </div>
    )
  }
}
