import Notification from './Notification'

let defaultDuration = 4.5
let defaultTop = 24
let defaultBottom = 24
let defaultPlacement = 'topRight'
let defaultGetContainer

let stepKey = 0
// 四个位置的 实例，为了避免 同时创建多个不同位置的 notice 的时候，会把其他位置的 notice 放到后面创建的位置上
let notificationInstance = {}

const iconType = {
  info: 'info-circle',
  success: 'check-circle',
  error: 'exclamation-circle',
  warning: 'exclamation-circle',
  loading: 'loading',
}

const getPlacementStyle = (placement = defaultPlacement) => {
  let style = {}
  switch (placement) {
    case 'topRight':
      style = {
        right: 0,
        top: defaultTop,
        bottom: 'auto',
      }
      break
    case 'topLeft':
      style = {
        left: 0,
        top: defaultTop,
        bottom: 'auto',
      }
      break
    case 'bottomRight':
      style = {
        right: 0,
        bottom: defaultBottom,
        top: 'auto',
      }
      break
    case 'bottomLeft':
      style = {
        left: 0,
        bottom: defaultBottom,
        top: 'auto',
      }
      break
    default:
      style = {
        right: 0,
        top: defaultTop,
        bottom: 'auto',
      }
      break
  }
  return style
}

const getNotificationInstance = (placement, cb) => {
  if (notificationInstance[placement]) {
    cb(notificationInstance[placement])
    return
  }
  Notification.newInstance(
    {
      className: `${placement}`,
      style: getPlacementStyle(placement),
      getContainer: defaultGetContainer,
    },
    instance => {
      notificationInstance[placement] = instance
      cb(instance)
    }
  )
}

const notice = (config, type) => {
  const icon = iconType[type]

  const duration = config.duration >= 0 ? config.duration : defaultDuration

  getNotificationInstance(config.placement || defaultPlacement, instance => {
    instance.notice({
      key: stepKey++,
      icon,
      type,
      ...config,
      duration,
    })
  })
}

const apis = {
  success: config => {
    return notice(config, 'success')
  },

  info: config => {
    return notice(config, 'info')
  },

  error: config => {
    return notice(config, 'error')
  },

  warning: config => {
    return notice(config, 'warning')
  },

  warn: config => {
    return notice(config, 'warning')
  },

  open: config => {
    return notice(config)
  },

  close: key => {
    Object.keys(notificationInstance).forEach(placement =>
      notificationInstance[placement].removeNotice(key)
    )
  },

  config: config => {
    const { bottom, duration, getContainer, placement, top } = config
    if (duration !== undefined) {
      defaultDuration = duration
    }
    if (placement !== undefined) {
      defaultPlacement = placement
    }
    if (bottom !== undefined) {
      defaultBottom = bottom
    }
    if (top !== undefined) {
      defaultTop = top
    }
    if (getContainer !== undefined) {
      defaultGetContainer = getContainer
    }
  },
  destroy: () => {
    Object.keys(notificationInstance).forEach(placement => {
      notificationInstance[placement].destroy()
      delete notificationInstance[placement]
    })
  },
}

export default apis
