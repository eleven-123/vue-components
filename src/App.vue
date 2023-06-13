<template>
  <div class="mainApp-container">
    <layout></layout>
    <!-- subappFullContainer 放置全屏子应用的容器 -->
    <div id="subappFullContainer" v-show="isShowFullSubApp"></div>
  </div>
</template>

<script>
import Layout from './views/layout.vue'
export default {
  name: 'App',
  components:{
    Layout
  },
  computed:{
    isShowFullSubApp(){
      let path = this.$route.path
      let item = qiankunSubApp.find(item => item.activeRule === path) || {}
      return item.container === "#subappFullContainer"
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('./assets/css/reset.scss');
.mainApp-container{
  height: 100%;
  #subappFullContainer{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
    z-index: 10;
  }
}
</style>
