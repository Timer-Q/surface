import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style/affix.scss'

export default class Affix extends Component {
  static propTypes = {
    children: PropTypes.node,
    offsetBottom: PropTypes.number,
    offsetTop: PropTypes.number,
    right: PropTypes.number,
    isAlways: PropTypes.bool,
    isImmediate: PropTypes.bool,
    isContainer: PropTypes.bool,
  }

  static defaultProps = {
    offsetBottom: 10,
    offsetTop: 10,
    isAlways: false,
    isImmediate: false,
    isContainer: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      fixed: false,
    }
  }

  getElementTop(element) {
    let actualTop = element.offsetTop
    let current = element.offsetParent

    while (current !== null){
      actualTop += current.offsetTop
      current = current.offsetParent
    }
    return actualTop
  }

  onScrollHandle(defaultScrollTop) {
    const elementTop = this.contentNode.getBoundingClientRect().top || 0

    if (window.scrollY <= defaultScrollTop && !this.props.isAlways) {
      this.setState({fixed: false})
    }
    else if (elementTop <= this.props.offsetTop) {
      this.setState({fixed: true})
    }
  }

  componentDidMount() {
    if (this.props.isImmediate) {
      this.setState({fixed: true})
      return
    }
    if (this.contentNode) {
      const defaultScrollTop = this.contentNode.getBoundingClientRect().top || 0
      window.addEventListener('scroll', this.onScrollHandle.bind(this, defaultScrollTop))
    }
  }

  componentWillUnmount() {
    if (this.props.isImmediate) {
      return
    }
    if (this.contentNode) {
      window.removeEventListener('scroll', this.onScrollHandle.bind(this))
    }
  }

  render() {
    const { children, isContainer } = this.props
    const fixStyle = {
      position: isContainer ? 'absolute' : this.state.fixed ? 'fixed' : '',
      top: this.state.fixed || isContainer? this.props.offsetTop + 'px' : '',
      right: this.state.fixed || isContainer? this.props.right + 'px' : '',
      zIndex: this.state.fixed ? 999 : 0,
    }

    return (
      <div
        className="affix"
        ref={node => this.contentNode = node}
        style={fixStyle}>
        {children}
      </div>
    )
  }
}
