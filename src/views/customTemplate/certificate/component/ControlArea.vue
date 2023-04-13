<template>
  <div class="control_area">
    <h4>模板控件列表</h4>
    <p>拖动控件到指定位置</p>
    <div v-for="(item,index) in componentList" :key="index">
      <h5>{{item.title}}</h5>
      <div class="control_list">
        <div class="control_item" v-for="(cell, idx) in item.list" :key="idx" draggable @dragstart="handleDragStart(cell)" @click.prevent="onTap(cell)">{{cell.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import {componentList} from './componentList'
export default {
  data(){
    return{
      componentList
    }
  },
  methods:{
    // 开始拖拽
    handleDragStart(item){
      this.$emit('handleDrag', item)
    },
    onTap(item){
      this.$emit('handleDrag', item, 'click')
    }
  }
}
</script>
<style lang="scss" scoped>
  .control_area{
    position: absolute;
    left: 0;
    top: 0;
    h5{
      margin: 5px;
    }
    .control_list{
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      .control_item{
        margin: 0 10px 10px 0;
        flex: 1 1 40%;
        text-align: center;
        font-size: 13px;
        line-height: 30px;
        border: 1px solid #ccc;
        cursor: grab;
        &:active {
            cursor: grabbing;
        }
      }
    }
  }
</style>