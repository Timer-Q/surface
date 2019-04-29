function arrayTreeFilter(source, filterFunction, options = {childrenKey: 'children'}) {
  const {childrenKey} = options
  let children = source || []
  const result = []
  let level = 0
  do {
    const filterData = children.filter(child => filterFunction(child, level))[0]
    if (!filterData) {
      break
    }
    result.push(filterData)
    children = filterData[childrenKey] || []
    level += 1
  } while (children.length)
  return result
}
function analyseIsArray(arr){
  return Object.prototype.toString.apply(arr) === '[object Array]'
}


let class2type = {}
let toString = class2type.toString
let hasOwn = class2type.hasOwnProperty

function isPlainObject(obj) {
  let proto, Ctor
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false
  }
  proto = Object.getPrototypeOf(obj)
  if (!proto) {
    return true
  }
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
  return typeof Ctor === 'function' && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object)
}

function isFunction(fun){
  return Object.prototype.toString.apply(fun) === '[object Function]'
}
function isArray(fun){
  return Object.prototype.toString.apply(fun) === '[object Array]'
}

function extend() {
  // 默认不进行深拷贝
  var deep = false
  var name, options, src, copy, clone, copyIsArray
  var length = arguments.length
  // 记录要复制的对象的下标
  var i = 1
  // 第一个参数不传布尔值的情况下，target 默认是第一个参数
  var target = arguments[0] || {}
  // 如果第一个参数是布尔值，第二个参数是 target
  if (typeof target == 'boolean') {
    deep = target
    target = arguments[i] || {}
    i++
  }
  // 如果target不是对象，我们是无法进行复制的，所以设为 {}
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {}
  }

  // 循环遍历要复制的对象们
  for (; i < length; i++) {
    // 获取当前对象
    options = arguments[i]
    // 要求不能为空 避免 extend(a,,b) 这种情况
    if (options != null) {
      for (name in options) {
        // 目标属性值
        src = target[name]
        // 要复制的对象的属性值
        copy = options[name]

        // 解决循环引用
        if (target === copy) {
          continue
        }

        // 要递归的对象必须是 plainObject 或者数组
        if (deep && copy && (isPlainObject(copy) ||
                (copyIsArray = Array.isArray(copy)))) {
          // 要复制的对象属性值类型需要与目标属性值相同
          if (copyIsArray) {
            copyIsArray = false
            clone = src && Array.isArray(src) ? src : []

          } else {
            clone = src && isPlainObject(src) ? src : {}
          }

          target[name] = extend(deep, clone, copy)

        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }

  return target
}

function debounce(cb,delay){
  let timer

  return function() {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb && cb.apply(context, args)
    }, delay)
  }
}

module.exports= {
  arrayTreeFilter: arrayTreeFilter,
  analyseIsArray: analyseIsArray,
  extend: extend,
  isArray: isArray,
  debounce: debounce,
}
