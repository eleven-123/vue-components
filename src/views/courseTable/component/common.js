import { isUndefined, formatTime, formatNumber } from "@/assets/js/utils";

function getOption (option) {
  const date = option.date || new Date()
  const week = date.getDay()
  return {
    year: option.year || date.getFullYear(),
    month: isUndefined(option.month) ? date.getMonth() : (option.month - 1),
    week: week === 0 ? 7 : week,
    day: option.day || date.getDate()
  }
}
// 获取年第一天
export function getYearStart (option = {}) {
  const { year } = getOption(option)
  return new Date(year, 0, 1)
}
// 获取年最后一天
export function getYearEnd (option = {}) {
  const { year } = getOption(option)
  return new Date(year, 12, 0)
}
// 获取月第一天
export function getMonthStart (option = {}) {
  const { year, month } = getOption(option)
  return new Date(year, month, 1)
}
// 获取月最后一天
export function getMonthEnd (option = {}) {
  const { year, month } = getOption(option)
  return new Date(year, month + 1, 0)
}
// 获取周第一天
export function getWeekStart (option = {}) {
  const { year, month, week, day } = getOption(option)
  return new Date(year, month, day - week + 1)
}
// 获取周最后一天
export function getWeekEnd (option = {}) {
  const { year, month, week, day } = getOption(option)
  return new Date(year, month, day - week + 7)
}
// 获取天开始时间
export function getDayStart (option = {}) {
  const { year, month, day } = getOption(option)
  return new Date(year, month, day)
}
// 获取天结束时间
export function getDayEnd (option = {}) {
  const { year, month, day } = getOption(option)
  return new Date(year, month, day, 23, 59, 59)
}

// 星期数字转文字
export function weekdayToText(weekday, type = 1) {
  let list1 = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  let list2 = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
  let list = type == 1 ? list1 : list2
  return list[weekday - 1]
}

// 获取一周列表
export function getWeekList(option = {}) {
  let list = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"], arr = [];
  let time = getWeekStart(option)
  const today = getDayStart().getTime()
  list.forEach((item, i) => {
    let timestamp = time.getTime() + i * 24 * 3600 * 1000
    let dateObj = formatTime(timestamp, 'object')
    arr.push({
      week: i + 1,
      weekText: item,
      weekText1: weekdayToText(i + 1),
      dateText: dateObj.month + '-' + dateObj.day,
      formatText: dateObj.year + '-' + dateObj.month + '-' + dateObj.day,
      timestamp,
      key: timestamp,
      isToday: timestamp === today,
      ischeck: false
    })
  })
  return arr
}

// 获取课表纵向时间列表
export function getHourList(start, end) {
  let nhour = new Date().getHours()
  let shour = new Date(start).getHours()
  let ehour = new Date(end).getHours()
  let eminute = new Date(end).getMinutes()
  ehour = eminute == 0 ? (ehour - 1) : ehour
  if (shour > ehour) {
    ehour = 24
  }
  const list = []
  while (Number(shour) <= Number(ehour)) {
    list.push({
      text: `${formatNumber(shour)}:00`,
      hour: shour,
      minute: shour * 60,
      isNow: nhour === shour,
      key: shour
    })
    shour++;
  }
  return list
}

export function getTableStyleConfig(option = {}) {
  return {
    padding: 5,
    height: 80,
    width: 200,
    headerHeight: 40, //头部标题高度 40
    headerWidth: 80, //左侧标题宽度
    maxScrollLeft: 0, //横向最大可滚动距离
    offsetMainTop: 0, // 课表距离main顶部距离
    ...option
  }
}