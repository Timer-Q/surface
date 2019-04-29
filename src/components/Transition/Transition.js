import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export const UNMOUNTED = 'unmounted'
export const EXITED = 'exited'
export const ENTERING = 'entering'
export const ENTERED = 'entered'
export const EXITING = 'exiting'

function noop() {}
export default class Transition extends Component {
  static propTypes = {
    children: PropTypes.node,
    in: PropTypes.bool,
    unmountOnExit: PropTypes.bool,
    mountOnEnter: PropTypes.bool,
    enter: PropTypes.bool,
    exit: PropTypes.bool,
    addEndListener: PropTypes.func,
    timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    onEnter: PropTypes.func,
    onEntering: PropTypes.func,
    onEntered: PropTypes.func,
    onExit: PropTypes.func,
    onExiting: PropTypes.func,
    onExited: PropTypes.func,
  }

  static defaultProps = {
    in: false,
    mountOnEnter: false,
    unmountOnExit: false,
    appear: false,
    enter: true,
    exit: true,

    onEnter: noop,
    onEntering: noop,
    onEntered: noop,

    onExit: noop,
    onExiting: noop,
    onExited: noop,
    timeout: 300,
  }

  constructor(props) {
    super(props)
    // FIXME: 判断 Group 是否加载，此处暂为false
    const appear = props.enter

    let initialStatus
    this.appearStatus = null
    if (props.in) {
      if (appear) {
        initialStatus = EXITED
        this.appearStatus = ENTERING
      } else {
        initialStatus = ENTERED
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED
      } else {
        initialStatus = EXITED
      }
    }

    this.state = { status: initialStatus }

    this.nextCallback = null
  }

  static getDerivedStateFromProps({ in: nextIn }, prevState) {
    if (nextIn && prevState.status === UNMOUNTED) {
      return { status: EXITED }
    }
    return null
  }

  componentDidMount() {
    this.updateStatus(true, this.appearStatus)
  }

  componentDidUpdate(prevProps) {
    let nextStatus = null
    if (prevProps !== this.props) {
      const { status } = this.state

      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING
        }
      }
    }
    this.updateStatus(false, nextStatus)
  }

  componentWillUnmount = () => {
    this.cancelNextCallback()
  }

  updateStatus(mounting = false, nextStatus) {
    if (nextStatus !== null) {
      this.cancelNextCallback()
      // eslint-disable-next-line
      const node = ReactDOM.findDOMNode(this)

      if (nextStatus === ENTERING) {
        this.performEnter(node, mounting)
      } else {
        this.performExit(node)
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({ status: UNMOUNTED })
    }
  }

  getTimeouts = () => {
    const { timeout } = this.props
    if (
      timeout !== undefined &&
      timeout !== null &&
      typeof timeout !== 'number'
    ) {
      return timeout
    }
    return {
      exit: timeout,
      enter: timeout,
      appear: timeout,
    }
  }

  cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel()
      this.nextCallback = null
    }
  }

  setNextCallback(callback) {
    let active = true

    this.nextCallback = event => {
      if (active) {
        active = false
        this.nextCallback = null

        callback(event)
      }
    }

    this.nextCallback.cancel = () => {
      active = false
    }

    return this.nextCallback
  }

  safeSetState = (nextState, callBack) => {
    const newCallBack = this.setNextCallback(callBack)
    this.setState(nextState, newCallBack)
  }

  performEnter(node, mounting) {
    const { enter } = this.props
    // const appearing = this.context.transitionGroup
    //   ? this.context.transitionGroup.isMounting
    //   : mounting
    const appearing = mounting

    const timeouts = this.getTimeouts()
    const enterTimeout = appearing ? timeouts.appear : timeouts.enter
    if (!mounting && !enter) {
      this.safeSetState({ status: ENTERED }, () => {
        this.props.onEntered(node)
      })
      return
    }

    this.props.onEnter(node, appearing)

    this.safeSetState({ status: ENTERING }, () => {
      this.props.onEntering(node, appearing)

      this.onTransitionEnd(node, enterTimeout, () => {
        this.safeSetState({ status: ENTERED }, () => {
          this.props.onEntered(node, appearing)
        })
      })
    })
  }

  performExit(node) {
    const { exit } = this.props
    const timeouts = this.getTimeouts()

    if (!exit) {
      this.safeSetState({ status: EXITED }, () => {
        this.props.onExited(node)
      })
      return
    }
    this.props.onExit(node)

    this.safeSetState({ status: EXITING }, () => {
      this.props.onExiting(node)

      this.onTransitionEnd(node, timeouts.exit, () => {
        this.safeSetState({ status: EXITED }, () => {
          this.props.onExited(node)
        })
      })
    })
  }

  onTransitionEnd(node, timeout, handler) {
    this.setNextCallback(handler)

    const doesNotHaveTimeoutOrListener =
      timeout == null && !this.props.addEndListener
    if (!node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0)
      return
    }

    if (this.props.addEndListener) {
      this.props.addEndListener(node, this.nextCallback)
    }

    if (timeout != null) {
      setTimeout(this.nextCallback, timeout)
    }
  }

  render() {
    const { status } = this.state
    if (status === UNMOUNTED) {
      return null
    }

    const { children, ...childProps } = this.props
    // filter props for Transtition
    delete childProps.in
    delete childProps.mountOnEnter
    delete childProps.unmountOnExit
    delete childProps.appear
    delete childProps.enter
    delete childProps.exit
    delete childProps.timeout
    delete childProps.addEndListener
    delete childProps.onEnter
    delete childProps.onEntering
    delete childProps.onEntered
    delete childProps.onExit
    delete childProps.onExiting
    delete childProps.onExited

    if (typeof children === 'function') {
      return children(status, childProps)
    }

    if (children && React.isValidElement(children)) {
      const child = React.Children.only(children)
      return React.cloneElement(child, childProps)
    }
    return null
  }
}
