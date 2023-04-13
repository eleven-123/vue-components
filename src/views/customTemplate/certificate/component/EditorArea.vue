<template>
  <div class="canvas_box" ref="refCanvasBox">
    <div class="editor_area" ref="refEditorCanvas" :style="canvasStyleObj" @drop="handleDrop" >
    <!--页面组件列表展示-->
    <!-- <div v-for="(item, index) in componentData" :key="index">
      <component
        :is="item.component"
        v-if="item.component != 'VText'"
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      />
      <component
        :is="item.component"
        v-else
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
        @input="handleInput"
      />
    </div> -->
    <div class="component_item on" v-for="item in componentData" :key="item.key" :style="item.style" 
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >{{item.name}}</div>
  </div>
  </div>
</template>
<script>
export default {
  props:{
    // 画布样式canvasStyleData
    canvasStyleData:{
      type: Object,
      default: () => {}
    },
    componentData:{
      type: Array,
      default: () => []
    }
  },
  data(){
    return{
      canvasStyleObj: {
        color: '#000',
        opacity: 1,
        background: '#fff',
        fontSize: 14,
        transform: 'scale(1)'
      },
      canvasHeight: 0,
      canvasWidth: 0,
      scale: 21 / 29.7,
      canvasScaleHeight: 0
    }
  },  
  mounted(){
    this.handleResize()
    this.$nextTick(() => {
      this.$refs.refEditorCanvas.addEventListener("wheel", this.handleWheel);
      window.addEventListener("resize", this.handleResize);
    })
  },
  beforeDestroy(){
    this.$refs.refEditorCanvas.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("resize", this.handleResize);
  },
  methods:{
    handleDragStart(e){
      console.log(e)
    },
    handleDrop(e){
      this.$emit('handleDrop', e)
    },
    handleResize(){
      this.canvasStyleObj = {...this.canvasStyleObj, ...this.canvasStyleData}
      this.canvasHeight = this.$refs.refCanvasBox.offsetHeight;
      this.canvasWidth = this.scale * this.canvasHeight
      this.canvasStyleObj.width = parseInt(this.scale * this.$refs.refEditorCanvas.offsetHeight) + 'px'
      this.canvasScaleHeight = this.$refs.refEditorCanvas.offsetHeight
    },
    // 鼠标滚动缩放画布
    handleWheel(e){
      let height = this.$refs.refEditorCanvas.offsetHeight
      let wheelHeight = this.canvasScaleHeight - e.deltaY / 4;
      if(wheelHeight > 100 && wheelHeight < this.canvasHeight){
        this.canvasScaleHeight = wheelHeight
        let transformScale = wheelHeight / height
        this.canvasStyleObj.transform = 'scale(' + transformScale + ')'
      }
      
    },
    handleDragOver(){
      console.log('handleDragOver')
    },
    handleMouseDown(){
      console.log('handleMouseDown')
    },
    handleMouseUp(){
      console.log('handleMouseUp')
    },
    getComponentStyle(){

    }
  }
}
</script>
<style lang="scss" scoped>
.canvas_box{
  height:100%;
  display: flex;
  align-items: center;
  .editor_area{
    width: 400px;
    height: 565px;
    max-height: 100%;
    margin: 0 auto;
    background: #fff;
    position: relative;
  }
  .component_item{
    padding: 5px 20px;
    line-height: 20px;
    &.on{
      color: #0067ff;
      border: 1px dashed #0067ff;
    }
  }
}
</style>