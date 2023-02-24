<template>
  <div class="day_course_table">
    <h4 class="title">{{title}}</h4>
    <!-- <course-table :rowData="rowData" :columnData="columnData"></course-table> -->
  </div>
</template>
<script>
import {getCourseTable} from '../component/mixin'
import CourseTable from '../component/courseTable.vue'
export default {
  mixins: [getCourseTable(1)],
  components:{
    CourseTable
  },
  data(){
    return{
      rowData: [],
      columnData: []
    }
  },
  mounted(){
    
  },
  methods:{

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