<template>
  <div class="reserve_site">
    <p>场地预约</p>
    <div class="reserve_site_content">      
      <div class="duration_list">
        选择时长:<div class="duration_item" :class="{on: duration == item.value}" v-for="(item, index) in durationList" :key="index" @click="changeDuration(item)">{{item.value}}分钟</div>
      </div>
      <div class="date_list">
        <div class="date_item" :class="{on: activeDate == item.dateTime}" v-for="(item, index) in dateList" :key="index" @click="changeDate(item)">
          <p>{{item.dateTime | filterDateTime}}</p>
          <p>{{item.num}}场可订</p>
        </div>
      </div>
      <div class="time_course_box">
        <table class="time_table">
          <thead class="tt_header">
            <tr>
              <td>
                <div class="time cell cellWidth"></div>
              </td>
              <td v-for="(item, index) in classRoom" :key="index">
                <div class="cell cellWidth">{{item.classRoomName}}</div>
              </td>
            </tr>          
          </thead>
          <tbody class="tt_body">
            <tr class="tt_tr" v-for="(item, index) in timeList" :key="index">
              <td>
                <div class="time cell cellWidth">{{item.text}}</div>
              </td>
              <td v-for="(classroom, cIdx) in classRoom" :key="cIdx">
                <div class="cell cellWidth" :class="{disabled: todayTime == activeDate && item.disabled}" @click="toBooking(item, classroom)"></div>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 课表内容 -->
        <div class="courseList" @click="activeCorse = null">
          <div class="courseList_item cellWidth" ref="courseList" v-for="(item, i) in courseList" :key="i" :class="{repeatCourse: item.isShowRepeat}" :style="item.style" @click.stop="clickCourse(item)">
            <span :class="tableInfo.cellHeight == 28 ?'m-ellipsis':'s-ellipsis'">{{ item.text }}</span>
            <div class="tip" v-if="item.tip">{{ item.tip }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
// const todayTime = moment().startOf('day').valueOf();
const todayTime = 1662393600000;
const dayArray = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
export default {
  data(){
    return{
      todayTime,
      durationList: [], //可选时长
      duration: 30, //选中的时长
      dateList: [], //可预约的日期
      activeDate: todayTime, //当前选中的日期
      classRoom: [], //场地
      timeList: [], //时间
      schoolStartTime: '', //开始时间
      schoolEndTime: '', //结束时间
      courseList: [], //已排课程
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
  mounted(){
    this.getData()
  },
  methods:{
    getData(){
      this.p_post('/api/getCourseList.json').then(res => {
        console.log('res==', res)
        this.classRoom = res.classRoomTitleList
        // 可预约日期 #TODO
        this.dateList = [
          {
            dateTime: 1662393600000,
            num: 12
          },
          {
            dateTime: 1662480000000,
            num: 8
          },
          {
            dateTime: 1662566400000,
            num: 5
          },   
        ]
        //可选时长 #TODO
        this.durationList = [
          {
            value: 30
          },
          {
            value: 45
          },
          {
            value: 60
          },
          {
            value: 90
          },
          {
            value: 120
          }
        ]
        this.duration = this.durationList[0].value

        this.schoolStartTime = res.schoolStartTime
        this.schoolEndTime = res.schoolEndTime
        this.setTimeTable(res)
      })
    },
    // 绘制时间表
    setTimeTable(data){
      // 时间轴
      this.timeList = this.getHourList(this.schoolStartTime, this.schoolEndTime)
      this.courseList = this.getCourseList(data.courses || []);
    },
    getHourList(start, end) {
      let splitNum = this.duration / 60;
      // let splitNum = 1;
      let nhour = new Date().getHours()
      let nminute = new Date().getMinutes()
      let shour = new Date(start).getHours()
      let ehour = new Date(end).getHours()
      let eminute = new Date(end).getMinutes()
      ehour = eminute == 0 ? (ehour - 1) : ehour
      if (shour > ehour) {
        ehour = 24
      }
      const list = []
      while (Number(shour) <= Number(ehour)) {
        let sminute = (shour - parseInt(shour))*60;
        let text = `${parseInt(shour)}:${sminute <= 9 ? '0'+sminute : sminute}`
        list.push({
          text,
          hour: shour,
          minute: shour * splitNum * this.duration,
          // isNow: nhour === shour,
          disabled: nhour > parseInt(shour) || (nhour == parseInt(shour) && nminute >= sminute),
          key: shour
        })
        shour = shour + splitNum
      }
      return list
    },
    getCourseList(list=[]){
      return []
    },
    // 切换时长
    changeDuration(item){
      this.duration = item.value
      this.setTimeTable()
    },
    // 切换日期
    changeDate(item){
      this.activeDate = item.dateTime
    },
    // 预订
    toBooking(item, classRoom){
      if(this.todayTime == this.activeDate && item.disabled){
        return false
      }
      console.log('预订===', item, classRoom)
    }
  }
}
</script>
<style lang="scss" scoped>
.reserve_site{
  font-size: 14px;
  .reserve_site_content{
    background: #F1F2F3;
    padding: 15px 24px;
  }  
  .duration_list{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px 10px;
    background: #fff;
    border-radius: 10px;
    .duration_item{
      padding: 5px 10px;
      margin-left: 10px;
      color: #666;
      border: 1px solid #ccc;
      border-radius: 5px;
      &.on{
        color: #0072FF;
        border-color: #0072FF;
      }
    }
  }
  .date_list{    
    display: flex;
    .date_item{
      min-width: 80px;
      margin-right: 24px;
      padding: 5px 0 12px;
      text-align: center;
      position: relative;
      cursor: pointer;
      &.on{
        color: #0072FF;
        &::after{
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 4px;
          background: #0072FF;
          border-radius: 2px;
        }
      }
    }
  }
  .cellWidth{
    width: 100px;
  }
  .time_table{  
    .cell{
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 4px;
      cursor: pointer;
    }
    .tt_header{
      .cell{
        height: 30px;
      }
    }
    .tt_body{
      .cell{
        height: 80px;
        background: #F6F8FA;
        border-radius: 5px;
        &.disabled{
          background: url('@/assets/image/courseTable/disabledBg.png') no-repeat;
          cursor: default;
        }
      }
    }
    .tt_header, .tt_tr{
      .time{
        width: 40px;
        justify-content: flex-end;
        align-items: flex-start;
        background: transparent;
        color: #999;
        font-size: 14px;
        line-height: 1;
        cursor: default
      }
    }
  }
  .time_course_box{    
    padding: 10px;    
    background: #fff;
    border-radius: 10px; 
    position: relative; 
  }
  .courseList{
    position: absolute;
    z-index: 2;
    top: 50px;
    left: 60px;
    right: 10px;
    bottom: 10px;
    overflow: hidden;
    border: 1px solid red;
  }
}
</style>