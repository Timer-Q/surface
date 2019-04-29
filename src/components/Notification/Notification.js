import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Notice from './Notice'
import './style/notification.scss'

let step = 0
const stamp = new Date().getTime()

const getUid = () => {
  return `notification-${stamp}-${step++}`
}

export default class Notification extends Component {
  static propTypes = {
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      notices: [],
    }
  }

  add = notice => {
    const key = (notice.key = notice.key || getUid())
    const { notices } = this.state
    const newNotices = notices.concat()
    const keys = notices.map(notice => notice.key)
    const index = keys.indexOf(key)
    // 如果 实例中有当前 key， 让当前实例重新渲染
    if (index >= 0) {
      newNotices.splice(index, 1, notice)
    } else {
      // TODO: maxCount
      newNotices.push(notice)
    }
    this.setState({
      notices: newNotices,
    })
  }

  remove = (key, notice) => {
    const { notices } = this.state
    const newNotices = notices.filter(notice => notice.key !== key)
    this.setState({
      notices: newNotices,
    })
    if (notice && notice.onClose) {
      notice.onClose(notice)
    }
  }

  noticeClick = notice => {
    if (notice.onClick) {
      notice.onClick(notice)
    }
  }

  getNotices = () => {
    const { notices } = this.state
    return notices.map(notice => (
      <Notice
        key={notice.key}
        {...notice}
        onClose={this.remove.bind(this, notice.key, notice)}
        onClick={this.noticeClick.bind(this, notice)}
      />
    ))
  }

  render() {
    const notices = this.getNotices()
    const { style } = this.props
    return (
      <div style={style} className="notification">
        {notices}
      </div>
    )
  }
}

Notification.newInstance = (config, cb) => {
  const { getContainer, ...rest } = config

  const divEl = document.createElement('div')

  if (getContainer) {
    const root = getContainer()
    root.appendChild(divEl)
  } else {
    document.body.appendChild(divEl)
  }
  let called = false
  function getNotificationRef(instance) {
    if (called) {
      return
    }
    called = true
    cb({
      notice(props) {
        instance.add(props)
      },
      removeNotice(key) {
        instance.remove(key)
      },
      component: instance,
      destroy() {
        ReactDOM.unmountComponentAtNode(divEl)
        divEl.parentNode.removeChild(divEl)
      },
    })
  }

  ReactDOM.render(<Notification {...rest} ref={getNotificationRef} />, divEl)
}
