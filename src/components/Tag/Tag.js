import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/tag.scss'

export default class Tag extends Component {
  static propTypes = {
    children: PropTypes.any,
    closable: PropTypes.bool,
    onClose: PropTypes.func,
    type: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    bordered: PropTypes.bool,
    checkable: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    closable: true,
    bordered: false,
    checkable: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: false,
    }
  }

  handleCloseClick = event => {
    const { onClose } = this.props
    onClose && onClose(event)
  }

  handleClick = event => {
    const { checkable, onChange } = this.props
    if (!checkable) {
      return null
    }
    const checked = this.getCheckedData()
    if (!('checked' in this.props)) {
      this.setState({
        checked: !checked,
      })
    }
    if (onChange) {
      onChange(!checked, event)
    }
  }

  getCheckedData = () => {
    if ('checked' in this.props) {
      return this.props.checked
    }
    return this.state.checked
  }

  renderCloseBtn() {
    const { closable } = this.props
    return closable ? (
      <span className="tag-close-btn" onClick={this.handleCloseClick}>
        &times;
      </span>
    ) : null
  }

  render() {
    const { type, style, className, bordered, checkable } = this.props
    let styles = style || {}
    const hasCustomColor = type && type.startsWith('#')
    if (hasCustomColor) {
      styles.backgroundColor = type
    }

    const checked = this.getCheckedData()

    const cls = classNames('tag', {
      [`tag-${type}`]: type,
      'tag-has-color': hasCustomColor,
      'has-border': bordered,
      [className]: className,
      'is-checked': checkable && checked,
    })

    return (
      <div className={cls} style={styles} onClick={this.handleClick}>
        {this.props.children} {this.renderCloseBtn()}
      </div>
    )
  }
}
