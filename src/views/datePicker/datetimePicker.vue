<template>
  <div>
    <p style="line-height: 32px">选择日期：{{date}}</p>
    <my-date-picker v-model="date" type="date"></my-date-picker>

    <p style="margin-top: 40px; line-height: 32px">选择日期时间：{{date1}}</p>
    <my-date-picker v-model="date1" type="datetime" timeStart="00:00" timeEnd="23:59" timeStep="00:01"></my-date-picker>

    <p style="margin-top: 40px; line-height: 32px">选择日期时间限制最小日期：{{date2}}</p>
    <my-date-picker v-model="date2" type="datetime" :minDate="minDate"></my-date-picker>

    <p style="margin-top: 40px; line-height: 32px">选择日期时间区间：{{rangeDate[0]}}-{{rangeDate[1]}}</p>
    <div class="date-range">
      <my-date-picker v-model="rangeDate[0]" :minDate="minDate" :maxDate="rangeDate[1]" timeStep="00:15" type="datetime"></my-date-picker>
      <span>~</span>
      <my-date-picker v-model="rangeDate[1]" :minDate="rangeDate[0] || minDate" timeStep="00:15" type="datetime"></my-date-picker>
    </div>
    
  </div>
</template>

<script>
import MyDatePicker from '@/components/MyDatePicker'
import { formatTime } from '@/assets/js/utils'
  export default {
    components:{
      MyDatePicker
    },
    data () {
      return {
        date: '',
        date1: '',
        date2: '2023-09-23 08:00',
        rangeDate:['2023-08-23 08:00',''],
        timeStep: 1,
        minDate: formatTime(new Date(), 1)
      }
    },
    mounted () {
    },
    methods: {
    },
  }
</script>

<style lang='scss' scoped>
.date-range{
  display: flex;
  line-height: 32px;
  span{
    margin: 0 4px;
  }
}
</style>
