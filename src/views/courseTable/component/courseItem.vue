<template>
  <div>
    <div class="course_item" 
      :style="getCourseItemStyle(item)"
      v-for="(item, index) in courseList" 
      :key="index"
    >
      <h4 class="course_title">
        <span>{{item.courseName || '练琴'}} </span>
        <span>{{item.courseType | filterCourseType}}</span></h4>
      <div class="course_inner">
        <p>{{item.startTime | filterFormatTime}}~{{item.endTime | filterFormatTime}}</p>      
        <p>{{item.student}}</p>
      </div>      
    </div>
  </div>
</template>
<script>
import {getTableStyleConfig} from '../component/common'
import {formatTime} from '@/assets/js/utils'
export default {
  props:{
    // 数据
    courseList: {
      type: Array,
      default() {
        return [];
      },
    },
    tableStyleConfig:{
      type: Object,
      default: () => getTableStyleConfig()
    }
  },
  computed:{
    
  },
  filters:{
    filterFormatTime(time){
      return formatTime(time, 4)
    },
    filterCourseType(type){
      return ['个', '集', '琴'][type-1]
    }
  },
  data(){
    return{
    }
  },
  methods:{
    getCourseItemStyle(course){
      const config = this.tableStyleConfig;
      const styleIndex = course.styleIndex || {};
      let y_index = styleIndex.y_index || 0;
      let y_index_1 = styleIndex.y_index_1 ? styleIndex.y_index_1 : 0;
      let height = config.height - 2 * config.padding;
      let top = parseInt(y_index) * (config.height + 1) + config.padding + (config.paddingTop || 0) + y_index_1 * (height + config.padding);
      let def = {
        position: "absolute",
        width: config.width - 2 * config.padding + "px",
        left: (styleIndex.x_index || 0) * (config.width + 1) + config.padding + 1 + "px",
        top: top + "px",
        height: height + "px",
      };
      return {...def}
    }
  }
}
</script>
<style lang="scss" scoped>
.course_item{
  font-size: 12px;
  line-height: 20px;
  background: #eee;
  border-radius: 8px;
  border: 1px solid #ccc;
  position: absolute;
  overflow: hidden;
  .course_title{
    background: #409EFF;
    color: #fff;
    font-weight: normal;
    padding: 2px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    justify-content: space-between;
    span{
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;

    }
  }
  .course_inner{
    padding: 2px 5px;
    p{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>