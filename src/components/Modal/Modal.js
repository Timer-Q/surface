import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style/modal.scss'
import ModalBase from './ModalBase'

export default class Modal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible === prevState.visible) return null
    return { visible: nextProps.visible }
  }

  render() {
    const { visible } = this.state
    return <ModalBase {...this.props} visible={visible} />
  }
}
