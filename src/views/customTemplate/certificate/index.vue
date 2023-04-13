<template>
  <div class="certificate">
    <div class="hearder_box">
      <el-button type="primary" size="small">保存</el-button>
    </div>
    <div class="content_box">
      <!-- 控件 -->
      <control-area class="side_bar" @handleDrag="handleDrag"></control-area>
      <!-- 画布 -->
      <div class="content_editor"
          @dragover="handleDragOver">
        <!-- <h4>编辑区域</h4> -->
          <editor-area :componentData="componentData" @handleDrop="handleDrop"></editor-area>
      </div>
      <!-- 样式 -->
      <style-area class="side_bar" @handleDrag="handleDrag"></style-area>
    </div>
  </div>
</template>
<script>
import ControlArea from './component/ControlArea.vue'
import StyleArea from './component/StyleArea.vue'
import EditorArea from './component/EditorArea.vue'
export default {
  components:{
    ControlArea,
    EditorArea,
    StyleArea
  },
  data(){
    return{
      componentData: [],
      currcomponent: {},
      currKey: 0
    }
  },
  methods:{
    // handleDrag
    handleDrag(item, type){
      console.log(item, type)
      console.log('this.currcomponent==', this.currcomponent)
      item.key = this.currKey++
      
      if(type == 'click'){
        this.componentData.push(item)
      }else{
        this.currcomponent = item
      }
    },
    // 拖动元素在目标区域中 释放鼠标时触发
    handleDrop(e){
      e.preventDefault()
      e.stopPropagation()
      console.log('释放拖动元素===',e, this.componentData)
      let currcomponent = this.p_deepClone(this.currcomponent)
      currcomponent.key = this.currKey++
      currcomponent.style = {
        position: 'absolute',
        left: e.offsetX + 'px',
        top: e.offsetY + 'px'
      }
      this.currcomponent = ''
      this.componentData.push(currcomponent)
    },
    handleDragOver(e){
      e.preventDefault()
    },
    handleMouseDown(e){
      e.stopPropagation()
      console.log('handleMouseDown')
    },
    handleMouseUp(){
      console.log('handleMouseUp')
    },
  }
}
</script>
<style lang="scss" scoped>
.certificate{
  height: 100%;
  .hearder_box{
    height: 50px;
  }
  .content_box{
    min-width: 1000px;
    height: calc(100% - 50px);
    position: relative;
    border: 1px solid #ddd;
    overflow-y: auto;
    .side_bar{      
      width: 200px;
      min-height: 100%;
      padding: 10px 0 0 10px;
      background: #fff;
    }
    .content_editor{
      min-width: 500px;
      height: 100%;
      margin: 0 200px;
      padding: 10px;
      background: #ddd;
    }
  }
}
</style>