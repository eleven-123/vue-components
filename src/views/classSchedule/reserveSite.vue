<template>
  <div>
    <p>场地预约</p>
    <div class="">
      <div v-for="(item, index) in dateList" :key="index">
        <p>{{item.dateTime | filterDateTime}}</p>
        <p>{{item.num}}场可订</p>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
const todayTime = moment().startOf('day').valueOf();
const dayArray = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
export default {
  data(){
    return{
      dateList: [
        {
          dateTime: 1662307200000,
          num: 7
        },
        {
          dateTime: 1662422400000,
          num: 5
        }
      ]
    }
  },
  filters:{
    filterDateTime(datetime){
      let weekTxt;
      if(todayTime == datetime){
        weekTxt = '今天'
      }else{
        weekTxt = dayArray[moment(datetime).day()-1]
      }
      return `${weekTxt}(${moment(datetime).format('MM-DD')}))`
    }
  },
  created(){

  },
  methods:{
    
  }
}
</script>