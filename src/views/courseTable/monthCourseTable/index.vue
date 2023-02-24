<template>
  <div class="month_course_table">
    <date-time-picker :pickerType="1"></date-time-picker>
    <div class="course_table">
      <!-- 第一行 -->
      <div class="table_header">
        <div class="table_item" v-for="(item, index) in weeks" :key="index">{{weeks[index]}}</div>
      </div>
      <div class="table_body">

      </div>
    </div>
  </div>
</template>
<script>
import DateTimePicker from '../component/dateTimePicker.vue'
import CourseTable from '../component/courseTable.vue'
import moment from 'moment';
import calendar from '@/assets/js/calendar.js'
console.log('calendar==', calendar)
let now = new Date(),
    year = now.getFullYear(),
    month = now.getMonth() + 1,
    day = now.getDate();

export default {
  components: { 
    DateTimePicker,
    CourseTable
  },
  props:{
    weeks:{
      type: Array,
      default: () => ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
    },
    format:{
      type: String,
      // default: 'timestamp'
      default: 'yyyy-MM'
    }
  },
  data(){
    return{
      year,
      month,
      day,
      days: [],
      currMonth: moment(moment().format('yyyy-MM'))
    }
  },
  mounted(){
    this.init()
  },
  methods: {
    init(){
      let year = this.year, 
          month = this.month;
      let daysNum = calendar.solarDays(this.year, this.month)
      console.log('solarDays==', calendar.solarDays(year, month))
      let firstDayOfMonth = new Date(this.year, this.month, 1).getDay()     //当月第一天星期几
      let lastDateOfMonth = new Date(this.year, this.month, 0).getDate()    //当月最后一天
      let lastDayOfLastMonth = new Date(this.year, this.month - 1, 0).getDate()     //上个月的最后一天
      console.log('firstDayOfMonth==', firstDayOfMonth) 
      console.log('lastDateOfMonth==', lastDateOfMonth) 
      console.log('lastDayOfLastMonth==', lastDayOfLastMonth)
      let i, 
          line = 0,  //第几行索引(当月第几个星期)
          temp = [];
      for (i = 1; i <= lastDateOfMonth; i++) {
        let day = new Date(year, month, i).getDay(), //返回星期几（0～6）
            k;
        if(day == 0){
          temp[line] = []
        }else if(i == 1){
          temp[line] = []
          k = lastDayOfLastMonth - firstDayOfMonth + 1
          for (let j = 0; j < firstDayOfMonth; j++) {
              // console.log("第一行",lunarYear,lunarMonth,lunarValue,lunarInfo)
              temp[line].push(Object.assign(
                  {day: k,disabled: true},
                  // this.getLunarInfo(this.computedPrevYear(),this.computedPrevMonth(true),k),
                  // this.getEvents(this.computedPrevYear(),this.computedPrevMonth(true),k),
              ))
              k++;
          }
        }
      }
      console.log(temp)

    },
    changeMonth(val){
      console.log('改变月份==', val.vauleOf())
    }
  }
}
</script>
<style lang="scss" scoped>
.month_course_table{
  .course_table{
    min-width: 1540px;
    border: 1px solid #ccc;
    border-right: 0;
  }
  .table_header{
    width: 100%;
    display: flex;
    .table_item{
      flex: 1;
      min-width: 220px;
      padding: 10px 4px;
      text-align: center;
      border-right: 1px solid #ccc;
    }
  }
  .table_body{

  }
}
</style>