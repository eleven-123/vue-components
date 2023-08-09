<template>
  <div class="date-picker-panel">
    <div class="date-picker-panel_content" v-if="panelType == 2">
      <div class="year-table">
        <div class="cell-box" :class="{ active : statrYear + num - 1 == thisYear, disabled: getDiasbled(statrYear + num - 1)}" v-for="num in 10" :key="statrYear + num - 1" @click="handleYearClick(statrYear + num - 1)">{{ statrYear + num - 1}}</div>
      </div>
    </div>
    <div class="date-picker-panel_content" v-if="panelType == 3">      
      <div class="month-table">
        <div class="cell-box" :class="{ active : index + 1 == thisMonth && thisYear == date[0], disabled: getDiasbled(date[0], index + 1)}" v-for="(month, index) in months" :key="index" @click="handleMonthClick(index + 1)">{{ $t("datepicker.months."+month)}}</div>
      </div>
    </div>
    <div class="date-picker-panel_content" v-if="panelType == 1">
      <!-- 日期 -->
      <div class="date-table table-box">
        <table cellspacing="0" cellpadding="0">
          <tr>
            <th v-for="item in weekList" :key="item">{{ $t("datepicker.weeks."+item) }}</th>
          </tr>
          <tr v-for="(item, index) in dateList" :key="index" class="date-table__row">
            <td v-for="date in item" :key="date.index" :class="{disabled: getDiasbledDate(date.date)}">
              <div 
                :class="[
                  date.class, 
                  {today: date.active},
                  {current: date.date == selectedDate},
                ]" 
                @click="handleDayClick(date)"
              >
                <span>{{ date.value }}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- 时间 -->
      <div class="time-table table-box"  v-if="type == 'datetime'">
        <div class="cell-title">{{$t('datepicker.time')}}</div>
        <ul class="time-list">
          <li 
            :class="{actived:selectedTime == item.value, disabled: getTimeDisabled(item.value)}" 
            v-for="(item, index) in timeList" 
            :key="index" 
            @click="handleTimeClick(item.value)"
          >{{item.value}}</li>
        </ul>
      </div>
    </div>

    <div class="date-picker-panel_footer" v-if="type == 'datetime'">
      <el-button v-if="isShow" type="text" size="mini" @click="confimDate(1)">{{$t('datepicker.now')}}</el-button>
      <el-button size="mini" plain @click="confimDate()">{{$t('datepicker.confirm')}}</el-button>
    </div>
  </div>
</template>

<script>
  import { formatTime } from './datePicker'
  const todayMoment = formatTime(new Date(), 'object')
  // 计算时间
  const parseTime = function(time) {
    const values = (time || '').split(':');
    if (values.length >= 2) {
      const hours = parseInt(values[0], 10);
      const minutes = parseInt(values[1], 10);

      return {
        hours,
        minutes
      };
    }
    return null;
  };
  const compareTime = function(time1, time2) {
    const value1 = parseTime(time1);
    const value2 = parseTime(time2);

    const minutes1 = value1.minutes + value1.hours * 60;
    const minutes2 = value2.minutes + value2.hours * 60;

    if (minutes1 === minutes2) {
      return 0;
    }

    return minutes1 > minutes2 ? 1 : -1;
  };
  const nextTime = function(time, step) {
    const timeValue = parseTime(time);
    const stepValue = parseTime(step);

    const next = {
      hours: timeValue.hours,
      minutes: timeValue.minutes
    };

    next.minutes += stepValue.minutes;
    next.hours += stepValue.hours;

    next.hours += Math.floor(next.minutes / 60);
    next.minutes = next.minutes % 60;

    return (next.hours < 10 ? '0' + next.hours : next.hours) + ':' + (next.minutes < 10 ? '0' + next.minutes : next.minutes);
  };
  export default {
    props:{
      date: {
        type: Array,
        default: () => {
          const date = todayMoment,
                year = date.year,
                month = date.month;
          return [year, month]
        }
      },
      // 选择器类型 date datetime
      type:{
        type: String,
        default: 'date'
      },
      dateList: {
        type: Array,
        default: () => []
      },
      // 时间选择限制开始结束时间、计步数
      timeStart: {
        type: String,
        default: ""
      },
      timeEnd: {
        type: String,
        default: ""
      },
      timeStep: {
        type: String,
        default: ''
      },
      valueFormat:{
        type: String,
        default: "yyyy-M-d HH:mm"
      },
      panelType: {
        type: Number,
        default: 1
      },
      minDate:{
        type: String,
        default: '',
      },
      maxDate:{
        type: String,
        default: '',
      },
      defaultValue:{
        type: String,
        default: '',
      }
    },
    data () {
      return {
        // weekList: ["日", "一", "二", "三", "四", "五", "六"],
        weekList: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
        timeList: [],
        selectedTime: '', //当前选中的时间
        selectedDate: '', //当前选中日期
        // months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
        yearTable: [],
        minTime: '',
        maxTime: '',
      }
    },
    watch:{
      defaultValue:{
        handler:function(val){
          if(val){
            let dateObj = formatTime(val, 'object')
            this.selectedDate = `${dateObj.year}-${Number(dateObj.month)}-${Number(dateObj.day)}`
            
            let split = val.split(' ')
            if(split[1]){
              this.selectedTime = split[1]
            }
          }
        },
        immediate: true
      }
    },
    computed:{
      statrYear(){
        return Math.floor(this.date[0] / 10) * 10;
      },
      thisYear(){
        return todayMoment.year
      },
      thisMonth(){
        return todayMoment.month
      },
      // "此刻"快速选择
      isShow(){
        let thisMoment = Date.now()
        let flag = this.timeStep == "00:01" && this.timeStart == "00:00"
        if(this.minDate || this.maxDate){
          return flag && (thisMoment >= new Date(this.minDate).getTime() || thisMoment <= new Date(this.maxDate).getTime())
        }
        return flag
      },
    },
    mounted () {
      if(this.timeStart && this.timeEnd && this.timeStep){
        this.getTimeList()
      }
    },
    methods: {
      init(){
        this.selectedTime = ''
        this.selectedDate = ''
      },
      // 面板禁用（年份选择、月份选择）
      getDiasbled(year, month, day){
        if(this.minDate || this.maxDate){
          let minDate = formatTime(this.minDate, 'object'),
              maxDate = formatTime(this.maxDate, 'object');
          if(this.panelType == 1){
            return new Date(`${year}-${month}-${day} 00:00:00`).getTime() < new Date(`${minDate.year}-${minDate.month}-${minDate.day} 00:00:00`).getTime() || new Date(`${year}-${month}-${day} 00:00:00`).getTime() > new Date(`${maxDate.year}-${maxDate.month}-${maxDate.day} 00:00:00`).getTime()
          }
          if(this.panelType == 2){
            return year < minDate.year || year > maxDate.year
          }
          if(this.panelType == 3){
            return (year <= minDate.year && month < minDate.month) || (year >= maxDate.year && month > maxDate.month)
          }
        }
        return false
      },
      // 日期选项禁用
      getDiasbledDate(date){
        const [year, month, day] = date.split('-')
        return this.getDiasbled(year, Number(month), Number(day))
      },
      // 时间选项禁用
      getTimeDisabled(time){
        if(this.selectedDate && (this.minDate || this.maxDate)){
          return new Date(this.selectedDate+' '+time).getTime() < new Date(this.minDate).getTime() || new Date(this.selectedDate+' '+time).getTime() > new Date(this.maxDate).getTime()
        }
        return false
      },
      // 获取时间
      getTimeList(){
        let start = this.timeStart,
            end = this.timeEnd,
            step = this.timeStep,
            result = [];

        let current = start;
        while (compareTime(current, end) <= 0) {
          result.push({
            value: current,
            disabled: compareTime(current, this.minTime || '-1:-1') <= 0 ||
              compareTime(current, this.maxTime || '100:100') >= 0
          });
          current = nextTime(current, step);
        }
        this.timeList = result
      },
      // 选择日期
      handleDayClick(item){
        if (item.selectedDate == item.date) return;
        if(this.getDiasbledDate(item.date)) return false;
        this.selectedDate = item.date;
        let defaultTime = this.selectedTime || this.timeStart || '00:00:00'
        if(this.minDate){
          defaultTime = new Date(this.selectedDate+' '+defaultTime).getTime() < new Date(this.minDate).getTime() ? (this.minDate).split(' ')[1] : defaultTime
        }
        if(this.maxDate){
          defaultTime = new Date(this.selectedDate+' '+defaultTime).getTime() > new Date(this.maxDate).getTime() ? (this.maxDate).split(' ')[1] : defaultTime
        }
        this.selectedTime = this.formatFn(defaultTime, 'time')
        this.$emit("dateChange", {date:item.date, time: this.selectedTime});
      },
      // 选择时间
      handleTimeClick(timeStr){
        this.selectedTime = timeStr
        if(this.selectedDate){
          this.$emit("dateChange", {date:this.selectedDate, time: this.selectedTime});
        }
      },
      formatFn(date, type){
        if(type == 'time'){
          let obj = date.split(':')
          if(this.valueFormat == 'yyyy-MM-dd HH:mm'){
            return `${obj[0]}:${obj[1]}`
          }
          if(this.valueFormat == 'yyyy-MM-dd HH:mm:dd'){
            return date
          }
        }
        return date
      },
      initDefaultTime(){
        let timeObj = formatTime(new Date(), 'object'),
            stepObj = parseTime(this.timeStep);
        // 获取最接近分钟数(向上取)，如：当timeStep="0:30"时，10:00 => 10:00， 10:01 => 10:30
        let minutes = (stepObj.minutes) * Math.ceil((Number(timeObj.hour)*60+Number(timeObj.minute))/(stepObj.minutes))
        if(stepObj.hours){
          minutes += stepObj.hours * 60
        }
        let hour = Math.floor(minutes / 60),
            min = minutes % 60

        return `${timeObj.year}-${timeObj.month}-${timeObj.day} ${hour<10?'0'+hour:hour}:${min<10?'0'+min:min}`
      },
      // 确认
      confimDate(type){
        // 未选择日期，默认为当前时间(时间向上取最接近的时间)
        let currDate = this.initDefaultTime().split(' ')

        // “此刻”，时间默认为（向上）最接近的时间
        if(type){
          this.selectedDate = currDate[0]
          // this.selectedTime = currDate[1]

          let selected = parseTime(currDate[1]),
              end = parseTime(this.timeEnd)
          // 若此刻时间大于最大可选时间，选中则为最大可选时间
          if(selected.hours*60+selected.minutes > end.hours*60+end.minutes){
            this.selectedTime = this.timeEnd
          }else{
            this.selectedTime = currDate[1]
          }
        }
        // 未选择日期
        if(!this.selectedDate){
          this.selectedDate = currDate[0]
        }
        // 未选择时间，默认为最小时间
        if(!this.selectedTime){
          this.selectedTime = this.timeStart
        }
        // 若存在最小最大日期，需校验最小最大日期
        if(this.minDate || this.maxDate){
          if(new Date(this.minDate).getTime() >= new Date(this.selectedDate + ' ' + this.selectedTime).getTime() || new Date(this.maxDate).getTime() <= new Date(this.selectedDate + ' ' + this.selectedTime).getTime()){
            let limitDate = formatTime((this.minDate || this.maxDate), 'object')
            this.selectedDate = `${limitDate.year}-${Number(limitDate.month)}-${Number(limitDate.day)}` || this.selectedDate
            this.selectedTime = `${limitDate.hour<10?'0'+Number(limitDate.hour):limitDate.hour}:${limitDate.minute<10?'0'+Number(limitDate.minute):limitDate.minute}` || this.selectedTime
          }
        }
        
        this.$emit('confirmDate', {date: this.selectedDate, time: this.selectedTime})
      },
      handleYearClick(year){
        if(this.getDiasbled(year)){
          return false
        }
        this.$emit('changeYear', {year})
      },
      handleMonthClick(month){
        if(this.getDiasbled(this.date[0], month)){
          return false
        }
        this.$emit('changeMonth', {month})
      }
    },
  }
</script>

<style lang='scss' scoped>
.date-picker-panel{
  .date-picker-panel_content{
    display: flex;
    margin: 5px 10px;
    .table-box{
      flex: 1;
      font-size: 12px;
      table{
        width: 100%;
      }
    }
    .date-table{
      th{
        padding: 5px;
        color: #606266;
        font-weight: 400;
        text-align: center;
        border-bottom: 1px solid #ebeef5;
      }
      td {
        width: 40px;
        height: 30px;
        padding: 4px 0;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
        position: relative;
        div {
          height: 30px;
          padding: 3px 0;
          box-sizing: border-box;
          line-height: 24px;
          &.prev-month, &.next-month{
            color: #c0c4cc;
          }
          &.today{
            color: #0072ff;
          }
          span{
            width: 24px;
            height: 24px;
            display: block;
            margin: 0 auto;
            line-height: 24px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 50%;
          }
          &.current{
            span{
              color: #fff;
              background: #0072ff;
            }
          }
        }
        &.disabled{
          cursor: not-allowed;
          color: #c0c4cc;
        }
      }
    } 
    .time-table{
      flex: 0 0 auto;
      width: 60px;
      text-align: center;
      .cell-title{
        padding: 5px;
        color: #606266;
        border-bottom: 1px solid #ebeef5;
      }
      .time-list{
        list-style: none;
        max-height: 225px;
        overflow: auto;
        li{
          cursor: pointer;
          line-height: 28px;
          &.actived{
            color: #fff;
            background: #0072ff;
          }
          &.disabled{
            color: #c0c4cc;
            cursor: not-allowed;
          }
        }
      }
    }
    .year-table, .month-table{
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .cell-box{
        flex: 0 0 25%;
        padding: 20px 0;
        text-align: center;
        cursor: pointer;
        font-size: 12px;
        &.active{
          color: #0072ff;
          font-weight: 600;
        }
        &.disabled{
          cursor: not-allowed;
          color: #c0c4cc;
        }
      }
    }
  }
  .date-picker-panel_footer{
    text-align: right;
    padding: 10px 12px;
    border-top: 1px solid #eee;
  }
}
</style>
