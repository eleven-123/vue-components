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