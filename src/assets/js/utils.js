// 金额 - ￥1.00 
export function formatMoney(val) {
  return checkString(val) ? '￥' + showPrice(val) : ''
}

// 金额 - 保留两位小数 1.00
export function showPrice(num) {
  let f = parseFloat(num)
  if (isNaN(f)) {
    return num
  }
  f = Math.round(num * 100) / 100
  let s = f.toString()
  let rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2) {
    s += '0'
  }
  return s
}

export function checkString(str) {
  return !isUndefined(str) && String(str).replace(/(^\s*)|(\s*$)/g, '').length > 0
}

export function isUndefined(data) {
  return data === undefined || data === null
}

// 深拷贝
export function deepClone(target) {
  let result;
  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      result = [];
      for (let i in target) {
        result.push(deepClone(target[i]))
      }
    } else if (target === null) {
      result = null;
    } else if (target.constructor === RegExp) {
      result = target;
    } else {
      result = {};
      for (let i in target) {
        result[i] = deepClone(target[i]);
      }
    }
  } else {
    result = target;
  }
  return result;
}

export function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

// 日期格式化
export function formatTime(date, type, str = '-') {
  if (isUndefined(date)) {
    return date
  }
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  const year = formatNumber(date.getFullYear())
  const month = formatNumber(date.getMonth() + 1)
  const day = formatNumber(date.getDate())
  const hour = formatNumber(date.getHours())
  const minute = formatNumber(date.getMinutes())
  const second = formatNumber(date.getSeconds())
  let week = date.getDay()
  week = week == 0 ? 7 : week
  const t1 = [year, month, day].join(str)
  const t2 = [hour, minute, second].join(':')
  const t3 = [hour, minute].join(':')
  if (type === 1) {
    return t1
  } else if (type === 2) {
    return t2
  } else if (type === 3) {
    return `${t1} ${t3}`
  } else if (type === 'object') {
    return {
      week,
      year,
      month,
      day,
      hour,
      minute,
      second
    }
  }
  return `${t1} ${t2}`
}