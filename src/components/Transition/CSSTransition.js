import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Transition from './Transition'

const addClass = (node, className) => {
  if (className) {
    node.classList.add(className)
  }
}

const removeClass = (node, className) => {
  node.classList.remove(className)
}

export default class CSSTransition extends Component {
  static propTypes = {
    children: PropTypes.node,
    classNames: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    transitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onEnter: PropTypes.func,
    onEntering: PropTypes.func,
    onEntered: PropTypes.func,
    onExit: PropTypes.func,
    onExiting: PropTypes.func,
    onExited: PropTypes.func,
  }

  getClassName = type => {
    const { classNames, transitionName } = this.props
    const cls = classNames || transitionName
    let className, activeClassName, doneClassName
    if (cls) {
      if (typeof cls !== 'string') {
        className = cls[type]
        activeClassName = cls[`${type}Active`]
        doneClassName = cls[`${type}Done`]
      } else {
        className = `${cls}-${type}`
        activeClassName = `${className}-active`
        doneClassName = `${className}-done`
      }
      return {
        className,
        activeClassName,
        doneClassName,
      }
    }
    return {}
  }

  reflowAndAddClass = (node, className) => {
    if (className) {
      node && node.scrollTop
      addClass(node, className)
    }
  }

  removeClasses = (node, type) => {
    const { className, activeClassName, doneClassName } = this.getClassName(
      type
    )

    className && removeClass(node, className)
    activeClassName && removeClass(node, activeClassName)
    doneClassName && removeClass(node, doneClassName)
  }

  onEnter = (node, mounting) => {
    const { className } = this.getClassName(mounting ? 'appear' : 'enter')
    this.removeClasses(node, 'exit')
    addClass(node, className)
    const { onEnter } = this.props
    if (onEnter) {
      onEnter(node)
    }
  }

  onEntering = (node, mounting) => {
    const { activeClassName } = this.getClassName(mounting ? 'appear' : 'enter')
    this.reflowAndAddClass(node, activeClassName)
    const { onEntering } = this.props
    if (onEntering) {
      onEntering(node)
    }
  }

  onEntered = (node, mounting) => {
    const { doneClassName } = this.getClassName('enter')
    this.removeClasses(node, mounting ? 'appear' : 'enter')
    addClass(node, doneClassName)
    const { onEntered } = this.props
    if (onEntered) {
      onEntered(node)
    }
  }

  onExit = node => {
    const { className } = this.getClassName('exit')
    this.removeClasses(node, 'appear')
    this.removeClasses(node, 'enter')
    addClass(node, className)
    const { onExit } = this.props
    if (onExit) {
      onExit(node)
    }
  }

  onExiting = node => {
    const { activeClassName } = this.getClassName('exit')
    this.reflowAndAddClass(node, activeClassName)
    const { onExiting } = this.props
    if (onExiting) {
      onExiting(node)
    }
  }

  onExited = node => {
    const { doneClassName } = this.getClassName('exit')
    this.removeClasses(node, 'exit')
    addClass(node, doneClassName)
    const { onExited } = this.props
    if (onExited) {
      onExited(node)
    }
  }

  render() {
    const { ...props } = this.props
    delete props.transitionName
    delete props.classNames
    return (
      <Transition
        {...props}
        onEnter={this.onEnter}
        onEntered={this.onEntered}
        onEntering={this.onEntering}
        onExit={this.onExit}
        onExiting={this.onExiting}
        onExited={this.onExited}
      />
    )
  }
}
