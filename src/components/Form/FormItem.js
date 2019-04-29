import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AsyncValidator from 'async-validator'
import classNames from 'classnames'
import Transition from '../Transition'
import Grid from '../Grid'
import { Consumer } from './context'

function noop() {}
export default class FormItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: '',
      valid: true,
      validating: false,
    }
    this.required = false
    this.rules = []
  }

  static propTypes = {
    children: PropTypes.node,
    value: PropTypes.any,
    prop: PropTypes.string, // model 中的某一项的 key
    rules: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    formRules: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    label: PropTypes.string,
    header: PropTypes.node,
    formModel: PropTypes.object,
    model: PropTypes.object,
    getFormItem: PropTypes.func,
    remvoeFormItem: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    wrapperWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size: PropTypes.oneOf(['large', 'default', 'small', 'tiny']),
    layout: PropTypes.string,
    labelCol: PropTypes.object,
    wrapperCol: PropTypes.object,
  }

  static defaultProps = {
    onClick: noop,
    onFocus: noop,
    onBlur: noop,
  }

  componentDidMount() {
    const { getFormItem } = this.mixProps
    if (getFormItem) {
      this.mixProps.getFormItem(this)
    }
  }

  componentWillUnmount() {
    const { remvoeFormItem } = this.mixProps
    if (remvoeFormItem) {
      this.mixProps.remvoeFormItem(this)
    }
  }

  handleBlur() {
    const { onBlur } = this.mixProps
    onBlur && onBlur()
    setTimeout(() => {
      this.validate('blur')
    })
  }

  handleFocus = () => {
    const { onFocus } = this.mixProps
    onFocus && onFocus()
  }

  handleClick = () => {
    const { onClick } = this.mixProps
    onClick && onClick()
  }

  handleChange = () => {
    // NOTE: 由于数据绑定和校验的触发都是由 change 事件触发，
    // 如果不加 setTimeout validate 会先执行 然后数据才会变化
    setTimeout(() => {
      this.validate('change')
    })
  }

  /**
   * 获取当前 prop 对应的 value
   */
  getFieldValue() {
    // Form 组件上的 model props
    const { formModel } = this.mixProps
    const { model: modelInProps } = this.mixProps
    const model = modelInProps || formModel
    const { value } = this.mixProps
    if (!model || !this.mixProps.prop) return
    /**
     * TODO: 增加 多级 modal 校验
     */
    return model[this.mixProps.prop] || value
  }

  /**
   * 获取校验规则
   * @return {Array} 返回当前字段 对应的 rules
   */
  getRules() {
    // Form 上 所有表单元素的校验规则
    const allRules = this.mixProps.formRules
    // FormItem 上针对当前字段的校验规则
    const selfRules = this.mixProps.rules

    if (!allRules && !selfRules) {
      return []
    }

    // 从 allRules 中选取当前字段对应的 rules
    const currentRules = allRules ? allRules[this.mixProps.prop] : []
    // 将 FormItem 上的 rules 和 Form 上该字段的 rules 合并
    // return [].concat(selfRules || currentRules || [])
    const rules = [].concat(selfRules || currentRules || [])
    if (rules.length) {
      rules.forEach(rule => {
        if (rule.required) {
          this.required = true
        }
      })
    } else {
      this.required = false
    }
    return rules
  }

  /**
   * 获取 没有 trigger 和 trigger 匹配的 rule
   * @param {*} trigger 触发条件 （change、blur。。。）
   */
  getFilteredRules(trigger) {
    if (!this.rules.length) return
    // 返回 没有 trigger 和 trigger match 的
    return this.rules.filter(rule => {
      return !rule.trigger || rule.trigger.indexOf(trigger) > -1
    })
  }

  /**
   * 校验 字段
   * @param {*} trigger 触发方式
   * @param {*} cb 回调
   */
  validate(trigger, cb) {
    const rules = this.getFilteredRules(trigger)
    // 有对应的规则 返回 true
    if (!rules || rules.length === 0) {
      if (cb instanceof Function) {
        cb()
      }
      return true
    }

    // 将 状态 切换为 validating: true
    this.setState({ validating: true })

    // 生成符合 validator 需要的 格式
    // fieldName: [rules]
    const descriptor = { [this.mixProps.prop]: rules }
    // 生成 validator
    const validator = new AsyncValidator(descriptor)
    // 生成 符合校验格式的 数据 fieldName: value
    const model = { [this.mixProps.prop]: this.getFieldValue() }
    return new Promise(resolve => {
      validator.validate(model, { firstFields: true }, errors => {
        this.setState(
          {
            error: errors ? errors[0].message : '',
            validating: false,
            valid: !errors,
          },
          () => {
            if (cb instanceof Function) {
              resolve(errors)
              cb(errors)
            }
          }
        )
      })
    })
  }

  /**
   * 渲染 label
   */
  renderLabel() {
    const { label, labelWidth, labelCol } = this.mixProps
    if (!label) {
      return
    }
    const cls = classNames('form-item-label', {
      'form-item-required': this.required,
    })
    let labelNode = <label style={{ width: `${labelWidth}px` }}>{label}</label>

    if (labelCol) {
      labelNode = <Grid.Col {...labelCol}>{labelNode}</Grid.Col>
    }

    return React.cloneElement(labelNode, { className: cls })
  }

  /**
   * 渲染错误信息
   */
  renderErrorMessage() {
    if (!this.rules.length || this.state.valid) {
      return null
    }
    return (
      <Transition in={!this.state.valid}>
        <span className="form-item-error">{this.state.error}</span>
      </Transition>
    )
  }

  renderHeader() {
    const { header } = this.mixProps
    if (!header) return
    const cls = classNames('form-item-header', {
      'form-item-required': this.required,
    })
    if (typeof header === 'string') {
      return <h4 className={cls}>{header}</h4>
    } else {
      return (
        <div className={cls}>
          {header.label && (
            <span className="form-item-header-label">{header.label}</span>
          )}
          {header.content && (
            <span className="form-item-header-content">{header.content}</span>
          )}
        </div>
      )
    }
  }

  renderChildren = () => {
    const {
      label,
      children,
      style,
      className,
      size,
      layout,
      wrapperCol,
    } = this.mixProps

    const classes = classNames('form-item-wrapper')

    const formItemCls = classNames('form-item', {
      [className]: !!className,
      [`form-item-${size}`]: size,
      [`form-item-${layout}`]: layout,
    })
    let newChildren = children
    newChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        let childClassName = ''
        if (child && child.props && child.props.className) {
          childClassName = child.props.className
        }
        if (!this.state.valid && this.rules.length) {
          childClassName = `${className} has-error`
        }

        const props = {
          className: childClassName,
          style: { width: this.mixProps.wrapperWidth, ...child.props.style },
        }
        return React.cloneElement(child, props)
      }
      return child
    })

    let childrenWithMessage = (
      <div className={classes}>
        {newChildren}
        {this.renderErrorMessage()}
      </div>
    )

    if (wrapperCol) {
      childrenWithMessage = (
        <Grid.Col {...wrapperCol}>{childrenWithMessage}</Grid.Col>
      )
    }

    let contentChildren = (
      <React.Fragment>
        {this.renderLabel()}
        {childrenWithMessage}
      </React.Fragment>
    )

    if (wrapperCol) {
      contentChildren = (
        <Grid.Row style={{ flex: 1 }}>{contentChildren}</Grid.Row>
      )
    }

    return (
      <div
        title={label}
        className={formItemCls}
        onBlur={this.handleBlur.bind(this)}
        onChange={this.handleChange}
        style={style}
        onClick={this.handleClick}
        onFocus={this.handleFocus}>
        {this.renderHeader()}
        {contentChildren}
      </div>
    )
  }

  render() {
    return (
      <Consumer>
        {context => {
          this.mixProps = { ...context, ...this.props }
          this.rules = this.getRules()
          return this.renderChildren()
        }}
      </Consumer>
    )
  }
}
