<template>
  <div class="course_table" ref="table">
    <!-- <div class="" v-for="table in 2" :key="table"> -->
      <table class="course_table_inner" border="0">        
        <tr :data-index="`table-tr-${rIndex}`" v-for="(row, rIndex) in rowList" :key="rIndex">
          <td 
            :data-index="`table-td-${rIndex}-${cIndex}`" 
            v-for="(column, cIndex) in columnList" 
            :key="cIndex" 
          >
            <!-- 第一行 -->
            <div v-if="rIndex == 0" class="course_table_header" :class="{center: rIndex == 0}">
              <!-- 第一列 -->
              <span v-if="cIndex == 0">时间</span>
              <span v-else-if="column" :class="{ blue: column.isToday }">{{column.weekText}}({{column.dateText}})</span>
            </div>
            <div v-else class="course_table_item" :class="{'first': cIndex == 0}" :style="getItemStyle(row, column, rIndex, cIndex)">
              <!-- 第一列 -->
              <span v-if="cIndex == 0 && row">{{row.text}}</span>
              <!-- <span v-else></span> -->
            </div>
          </td>
        </tr>
      </table>
      <div class="course_position_box" 
        :style="{
          top: tableStyleConfig.headerHeight + 1 + 'px',
          left: tableStyleConfig.headerWidth + 1 + 'px',
        }"
      >
        <course-item :courseList="courseList" :tableStyleConfig="tableStyleConfig"></course-item>
      </div>
    <!-- </div> -->
  </div>
</template>
<script>
import {getTableStyleConfig} from '../component/common'
import {formatTime} from '@/assets/js/utils'
import CourseItem from '../component/courseItem.vue'
import $ from 'jquery'
export default {
  props:{
    // 行数据
    rowData: {
      type: Array,
      default() {
        return [];
      },
    },
    // 列数据
    columnData: {
      type: Array,
      default() {
        return [];
      },
    },
    courseList:{
      type: Array,
      default: () => []
    },
    // 表格样式
    tableStyleConfig: {
      type: Object,
      default() {
        return getTableStyleConfig();
      },
    },
    tableShowType:{
      type: Number,
      default: 3
    }
  },
  components:{
    CourseItem
  },
  computed:{
    rowList(){
      return [{}].concat(this.rowData)
    },
    columnList(){
      return [{}].concat(this.columnData)
    },
    isFold(){
      return this.$store.state.isFold
    }
  },
  filters:{
    filterFormatTime(time){
      return formatTime(time, 4)
    }
  },
  data(){
    return{

    }
  },
  mounted(){
    this.mainDom = document.querySelector(".main_content");
    this.tableDom = this.$refs.table;
    this.updateTable();
    window.addEventListener("resize", this.resizeMianView);
  },
  watch: {
    isFold() {
      this.$nextTick(() => {
        this.getScrollLeft();
      });
    }
  },
  methods:{
    updateTable() {
      this.getOffsetTop();
      this.getScrollLeft();
    },
    // 获取课表距离顶部距离
    getOffsetTop() {
      const height = this.mainDom.clientHeight;
      const offset = $(this.tableDom).offset();
      this.tableStyleConfig.offsetMainTop = offset.top - $(this.mainDom).offset().top + this.mainDom.scrollTop;
      this.slideTop = height - this.tableStyleConfig.offsetMainTop - 30;
    },
    // 获取课表宽度及滚动宽度
    getScrollLeft() {
      const config = this.tableStyleConfig;
      const offset = $(this.tableDom).offset();
      const tw = $(this.tableDom).outerWidth();
      this.$set(config, "offsetTop", offset.top);
      this.$set(config, "offsetLeft", offset.left);
      this.$set(config, "offsetWidth", tw);
      let width = parseInt((tw - config.headerWidth) / 7 - 1)
      config.width = width < 120 ? 120 : width;
    },
    resizeMianView(){
      this.updateTable();
    },
    getItemStyle(item = {}, val = {}, i, j) {
      const config = this.tableStyleConfig;
      let width = j == 0 ? config.headerWidth : (config.width);
      let height = i == 0 ? config.headerHeight : config.height;
      const height1 = (item && item.height_index ? item.height_index : 0) * (config.height - config.padding);
      height = height + height1 + "px";
      width = width + "px";
      return {
        height,
        width,
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeMianView);
  },
}
</script>
<style lang="scss" scoped>
.blue{
  color: #409EFF;
}
.course_table{
  *{
    box-sizing: border-box;
  }
  position: relative;
  .course_table_inner{
    // width: 100%;
    border-collapse: collapse;
    border: 1px solid #ccc;
    td{
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      &:last-child{
        border-right: none;
      }
      &:nth-child(n+2){
        min-width: 120px;
      }
      &.td_first{
        // width: 80px;
      }
    }
    tr:last-child td{
      border-bottom: none;
    }
    .course_table_header{
      min-height: 40px;
      line-height: 40px;
    }
    .course_table_item{
      min-height: 80px;
      padding: 5px;
    }
    .course_table_header, .course_table_item{
      &.center{
       text-align: center;
      }
      &.first{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .course_position_box{
    position: absolute;
  }
}
</style>