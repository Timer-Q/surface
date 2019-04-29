import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Provider } from './context'

import './style/index.scss'

export default class Form extends Component {
  constructor(props) {
    super(props)
    this.formItems = []
  }

  static propTypes = {
    model: PropTypes.object,
    children: PropTypes.any,
    labelPosition: PropTypes.oneOf(['top', 'left', 'right']),
    labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    wrapperWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSubmit: PropTypes.func,
    header: PropTypes.node,
    subHeader: PropTypes.node,
    rules: PropTypes.object,
    id: PropTypes.string,
    layout: PropTypes.oneOf(['horizontal', 'vertical', 'inline']),
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    layout: 'vertical',
    size: 'default',
  }

  handleSubmit(e) {
    e.preventDefault()
    const { onSubmit } = this.props
    onSubmit && onSubmit()
  }

  /**
   * 缓存 form-items
   * @param {*} item 子item
   */
  getFormItem(item) {
    // 用 push 避免使用 setState 造成的页面刷新
    this.formItems.push(item)
  }

  /**
   * 移除指定 form-item
   * @param {*} item
   */
  remvoeFormItem(item) {
    if (item.props.prop) {
      this.formItems.splice(this.formItems.indexOf(item), 1)
    }
  }
  // 校验所有 FormItem
  validate(cb) {
    // 校验状态 是否校验成功
    let valid = true
    // 当前校验的是第几个 作用：当校验到最后一个的时候 执行 cb
    let validatedCount = 0

    const { formItems } = this
    // 如果 Form 下没有 formItems 直接执行cb
    if (formItems.length === 0 && cb) {
      cb(true)
      return Promise.resolve(true)
    }
    return new Promise(resolve => {
      formItems.forEach(item => {
        // trigger 传空，校验所有规则
        item.validate('', errors => {
          if (errors) {
            valid = false
          }
          if (++validatedCount === formItems.length) {
            if (cb instanceof Function) {
              cb(valid)
            }
            resolve(valid)
          }
        })
      })
    })
  }

  renderTitle() {
    const { header, subHeader } = this.props

    const title = header ? (
      <div className="form-header-wrapper">
        <h2 className="form-header">{header}</h2>
        {subHeader ? <h3 className="form-sub-header">{subHeader}</h3> : null}
      </div>
    ) : null

    return title
  }

  render() {
    const {
      labelPosition,
      id,
      header,
      layout,
      labelWidth,
      wrapperWidth,
      style,
      className,
      ...rest
    } = this.props
    const classes = classNames('form', {
      [`form-label-${labelPosition}`]: labelPosition,
      [`form-${layout}`]: layout,
      [className]: className,
    })
    const providerProps = {}
    if (rest.size) {
      providerProps.size = rest.size
      providerProps.labelCol = rest.labelCol
      providerProps.wrapperCol = rest.wrapperCol
    }
    return (
      <form
        id={id || header}
        onSubmit={this.handleSubmit.bind(this)}
        className={classes}
        style={style}>
        {this.renderTitle()}
        <Provider
          value={{
            formRules: this.props.rules,
            formModel: this.props.model,
            getFormItem: this.getFormItem.bind(this),
            remvoeFormItem: this.remvoeFormItem.bind(this),
            layout,
            labelWidth,
            wrapperWidth,
            ...providerProps,
          }}>
          {this.props.children}
        </Provider>
      </form>
    )
  }
}
