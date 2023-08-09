/**
 * @Description  获取当前月份的天数
 * @param { Array } 年月组成的数组，例如：[2022,7]
 * @return {Number}例如：2022年7月有31天 返回31
 **/
 export function getCurrentMonthCount([year, month]) {
  // 当我们实例化Date函数的时候，传入第三个参数为0可以通过getDate获取到当前月份具体有多少天
  return new Date(year, month, 0).getDate();
}

/**
 * @Description  获取当前月份1号是星期二几
 * @param { Array } 年月组成的数组，例如：[2022,7]
 * @return {Number}  例如2022-7-1是星期5，返回5
 **/

export function getFirstMonthDayWeek([year, month]) {
  return new Date(year, month - 1, 1).getDay();
}

/**
 * @Description  根据年月，组装渲染天的表格数据
 * @param { Array } 年月组成的数组，例如：[2022,7]
 * @return {Array}
 **/

/* 

时间组件写法的思路：
1.对于时间组件的布局，可以先去参考iview element等开源组件库的date-picker组件的布局，基本上都是一样的
2.在清楚布局之后，我们需要根据用户传入的时间，生成一个6*7=42的天数的td单元格，在这42个单元格中，包含上月剩余的天数，当前月份的全部天数，下月的开始天数
3.如果你清楚了步骤二，那么我们接下来就容易多了，我们要计算上月的天数，当前月份的全部天数，下月的开始天数，以及当前月份1号星期几
4.由于头部是星期日，星期一，星期二，星期三，星期四，星期五，星期六的布局，因此我们需要计算当前月份1号星期几，这样我们就能找到上月的剩余天数了，下月的剩余天数就等于42-当前月份天数-上月剩余天数
5.在上面步骤知道后我们就可以着手根据上面提供的工具函数，生成我们需要的表格数据了

最终生成的是6*7的二维数组，因为表格天数的布局为6*7的布局，数据格式如下：
数组的个数代表了渲染的列数，内部每项数组代表每列的td个数
[
  [
    {
      //代表当前的td几号
       value: xxx,
       //上个月的号数和下个月的号数标识下，渲染的时候，我们样式另外布局
        disbled: true,
        //当前td的时间格式，用于点击了，给input显示以及供用户使用格式为2022-7-22
        date: xxx,
        // 当前天的时间td，我们需要高亮显示。添加标识
        active：xxx,
        //当前td的索引
        index: xxx,
    },
    {},
    {},
    {},
    {},
    {},
    {}
  ],
  [],
  [],
  [],
  [],
  [],
]

*/
export function genarateDayData([year, month]) {
  year = Number(year)
  month = Number(month)
  // 获取上月天数
  let lastMonthCount = getCurrentMonthCount([year, month - 1]);
  // 获取当月天数
  let currentMonthCount = getCurrentMonthCount([year, month]);
  // 获取当月1号星期
  let currentMonthFirstDayWeek = getFirstMonthDayWeek([year, month]);
  let dayList = [];
  let lastMonthPointer = 1;
  let currentMonthPoiner = 1;
  let nextMonthPointer = 1;
  // 根据日期组件的天数布局，共计42天，包含上月剩余天数+当月天数+下月初始天数
  for (let i = 0; i < 42; i++) {
    // 上个月需要渲染的td个数，以及对应的值
    if (lastMonthPointer <= currentMonthFirstDayWeek) {
      // 上月
      dayList.unshift({
        value: lastMonthCount--,
        // disbled: true,
        class: 'prev-month',
        date: year + "-" + (month - 1) + "-" + (lastMonthCount + 1),
        index: i,
      });
      lastMonthPointer++;
    } else if (currentMonthPoiner <= currentMonthCount) {
      // 当月
      dayList.push({
        value: currentMonthPoiner++,
        // disbled: false,
        active:
          new Date().getFullYear() == year &&
          new Date().getMonth() + 1 == month &&
          currentMonthPoiner - 1 == new Date().getDate(),
        date: year + "-" + month + "-" + (currentMonthPoiner - 1),
        index: i,
        class: 'available',
      });
    } else {
      // 下月
      dayList.push({
        value: nextMonthPointer++,
        // disbled: true,
        class: 'next-month',
        date: year + "-" + (month + 1) + "-" + (nextMonthPointer - 1),
        index: i,
      });
    }
  }
  // 当前天数高亮
  // 最后将数据生成二维数组返回:对应的就是6*7的二维数组用于渲染天数表格列
  let result = [];
  let index = 1;
  let i = 0;
  while (index <= 6) {
    let arr = [];
    for (let j = 0; j < 7; j++) {
      arr.push(dayList[i]);
      i++;
    }
    result.push(arr);
    index++;
  }
  return result;
}

export function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

// 日期格式化
export function formatTime(date, type, str = '-') {
  // const valueFormatList = ['yyyy']
  // let type = valueFormat
  if (!date) {
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
  } else if (type === 4) {
    return t3
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