import React, { Component } from 'react'
import Radio from './Radio'
import './style/radioButton.scss'

export default class RadioButton extends Component {
  static defaultProps = {
    prefixCls: 'radio-button',
    type: 'radio',
  }

  render() {
    return <Radio {...this.props} />
  }
}
