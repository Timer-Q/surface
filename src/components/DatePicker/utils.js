import moment from 'moment'
/**
 *
 * @param {*} value 选中的时间
 * @return {array} days[moment]
 */
export function getDays(value) {
  const days = []
  let result = value
  if (Array.isArray(value)) {
    result = moment(value[value.length - 1])
  }
  if (result) {
    const month = result.clone().date(1)
    const day = month.day() // 当月第一天周几
    const lastMonthDiffDay =
      (day + 7 - result.localeData().firstDayOfWeek()) % 7
    const lastMonth = month.clone().add(0 - lastMonthDiffDay, 'days')

    let passed = 0

    const baseNum = 7 * 6
    let current
    for (let i = 0; i < baseNum; i += 1) {
      current = lastMonth
      if (passed) {
        current = current.clone()
        current.add(passed, 'days')
      }
      days.push(current)
      passed++
    }
  }

  return days
}

/**
 * 将日期格式化为 string 类型
 * @param {*} props
 * @param {*} date
 * @return {string} stringDate
 */
export function formatDate(props, date = moment()) {
  const format = props.format || 'YYYY-MM-DD'
  const stringDate = date.format(format)
  return stringDate
}

export const weekDays = [
  {
    label: '日',
    value: '0',
  },
  {
    label: '一',
    value: '1',
  },
  {
    label: '二',
    value: '2',
  },
  {
    label: '三',
    value: '3',
  },
  {
    label: '四',
    value: '4',
  },
  {
    label: '五',
    value: '5',
  },
  {
    label: '六',
    value: '6',
  },
]
export const allMonths = [
  {
    label: '一月',
    value: 0,
  },
  {
    label: '二月',
    value: 1,
  },
  {
    label: '三月',
    value: 2,
  },
  {
    label: '四月',
    value: 3,
  },
  {
    label: '五月',
    value: 4,
  },
  {
    label: '六月',
    value: 5,
  },
  {
    label: '七月',
    value: 6,
  },
  {
    label: '八月',
    value: 7,
  },
  {
    label: '九月',
    value: 8,
  },
  {
    label: '十月',
    value: 9,
  },
  {
    label: '十一月',
    value: 10,
  },
  {
    label: '十二月',
    value: 11,
  },
]

/**
 * 两个日期是否相等
 * @param {*} selectedDay
 * @param {*} day
 * @param {*} parseObj
 * @param {*} props
 */
export function isSame(selectedDay, day, parseObj, props) {
  if (props.mode === 'multiple' && day) {
    const year = day.year()
    const month = day.month()
    const dateOfMonth = day.date()
    const date = path([year, month, dateOfMonth])(parseObj)
    return day.isSame(date, 'day')
  }

  return day.isSame(selectedDay, 'day')
}

/**
 * 小于当月的日期
 * @param {*} selectedDay
 * @param {*} day
 */
export function isMonthYearBefore(selectedDay, day) {
  if (selectedDay.year() < day.year()) {
    return true
  }
  return selectedDay.year() === day.year() && selectedDay.month() < day.month()
}

/**
 * 大于当月的日期
 * @param {*} selectedDay 选择的日期
 * @param {*} day 遍历中的当前日期
 */
export function isMonthYearAfter(selectedDay, day) {
  if (selectedDay.year() > day.year()) {
    return true
  }
  return selectedDay.year() === day.year() && selectedDay.month() > day.month()
}

/**
 * 获取当月有几个星期
 * @param {*} date
 */
export const getWeeksOfOneMonth = date => {
  const firstDay = date.clone().startOf('month')
  const firstDayWeeksOfYear = firstDay.weeks()
  const lastDay = date.clone().endOf('month')
  const lastDayWeeksOfYear = lastDay.weeks()

  let diffWekks = lastDayWeeksOfYear - firstDayWeeksOfYear + 1

  if (lastDayWeeksOfYear < firstDayWeeksOfYear) {
    const weeksInYear = date.clone().weeksInYear()
    diffWekks = weeksInYear - firstDayWeeksOfYear + 1
    if (lastDay.day() !== 6) {
      diffWekks += 1
    }
  }

  return {
    weeks: diffWekks,
    dayOfFirstDay: firstDay.day(),
    dayofLastDay: lastDay.day(),
  }
}

export const path = path => source =>
  path.reduce((data, p) => (data && data[p] ? data[p] : null), source)
