const hasOwn = Object.prototype.hasOwnProperty

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

export function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}

let scrollBarWidth
const scrollStyle = {
  position: 'absolute',
  top: '-9999px',
  width: '50px',
  height: '50px',
  overflow: 'scroll',
}
/**
 * 计算 滚动条宽度
 */
export const getScrollBarWidth = (direction = 'horizontal') => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return 0
  }

  if (scrollBarWidth) {
    return scrollBarWidth
  }

  const scrollDom = document.createElement('div')
  Object.keys(scrollStyle).forEach(key => {
    scrollDom.style[key] = scrollStyle[key]
  })
  document.body.appendChild(scrollDom)

  let size = 0
  if (direction === 'vertical') {
    size = scrollDom.offsetWidth - scrollDom.clientWidth
  } else if (direction === 'horizontal') {
    size = scrollDom.offsetHeight - scrollDom.clientHeight
  }

  document.body.removeChild(scrollDom)
  scrollBarWidth = size
  return scrollBarWidth
}
