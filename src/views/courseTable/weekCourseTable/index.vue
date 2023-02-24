<template>
  <div class="day_course_table">
    <h4 class="title">{{title}}</h4>
    <date-time-picker @change="onChange"></date-time-picker>
    <course-table :rowData="rowData" :columnData="columnData" :courseList="courseList" :tableStyleConfig="tableStyleConfig"></course-table>
  </div>
</template>
<script>
import {getWeekList, getHourList} from '../component/common'
import {getCourseTable} from '../component/mixin'
import CourseTable from '../component/courseTable.vue'
import DateTimePicker from '../component/dateTimePicker.vue'
export default {
  mixins: [getCourseTable(2)],
  components:{
    CourseTable,
    DateTimePicker
  },
  data(){
    return{
      rowData: null,
      columnData: null,
      courseList: []
    }
  },
  mounted(){
    this.getCourseData()
    this.columnData = getWeekList()
  },
  methods:{
    getCourseData(){
      this.p_post('/api/getCourseList.json').then(res => {
        let rowData = getHourList(res.schoolstarttime, res.schoolendtime)
        rowData.forEach((item) => {
          item.list = new Array(7).fill("").map(() => []);
        });
        this.rowData = rowData
        this.courseList = this.dealCourseData(res.courselist || [])
        this.handleIndexData();

      })
    },
    // 每行的数据
    handleIndexData() {
      let y_num = 0
      this.rowData.forEach((item) => {
        let max = 0;
        item.list.forEach((val) => {
          max = Math.max(max, val.length);
          val.forEach((ele, i) => {
            const styleIndex = ele.styleIndex;
            styleIndex.y_index_1 = y_num + i;
          });
        });
        // height_index该行最大数量（课时个数）
        item.height_index = Math.max(max - 1, 0);
        y_num += (item.height_index || 0);
      });
    },
    // 选择日期
    onChange(data){
      this.columnData = getWeekList({ date: data.startDate });
      this.getCourseData()
    }
  }
}
</script>
<style lang="scss" scoped>
.day_course_table{
  .title{
    margin-bottom: 20px;
  }
}
</style>