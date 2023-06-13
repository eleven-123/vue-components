<template>
  <el-container class="layout">
    <el-aside class="aside" :width="isCollapse ? '' : '200px'">
      <el-header class="header">
        <span>{{isCollapse ? 'VC' :'vue components'}}</span>
      </el-header>
      <el-menu class="menu" :default-active="defaultActiveIndex" active-text-color="#409EFF" :collapse="isCollapse">
        <template v-for="item in menu">
          <template v-if="item.subMenu && item.subMenu.length > 0">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item :index="subMenu.index" v-for="(subMenu, k) in item.subMenu" :key="k" @click="toChangeMenu(subMenu)">
                <span>{{subMenu.title}}</span>
              </el-menu-item>
            </el-submenu>
          </template>
          <el-menu-item v-else :key="item.index" :index="item.index" @click="toChangeMenu(item)">
            <i class="el-icon-setting"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-main class="main">        
      <el-header class="main_header">
        <div class="header_right">
          <el-button type="text" class="icon_collapse">
            <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="setFold"></i>
          </el-button> 
        </div>
      </el-header>
      <div class="main_content">
        <router-view></router-view>
        <!-- id为subappContainer就是放置子应用的容器 -->
        <div id="subappContainer"></div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data(){
    return{
      menu: [
        {
          title: 'tableList组件',
          index: '1',
          url: '',
          icon: 'setting',
          subMenu: [
            {
              title: 'el-table-component',
              url: '/elTableList',
              index: '1-1'
            },
            {
              title: 'table-component',
              url: '/tableList',
              index: '1-2'
            }
          ]
        },
        {
          title: '课表',
          index: '2',
          url: '',
          icon: 'tickets',
          subMenu: [
            {
              title: '日课表',
              url: '/dayCourseTable',
              index: '2-1'
            },
            {
              title: '周课表',
              url: '/weekCourseTable',
              index: '2-2'
            },
            {
              title: '月课表',
              url: '/monthCourseTable',
              index: '2-3'
            }
          ]
        },
        {
          title: '预约场地',
          index: '3',
          url: 'reserveSite',
        },
        {
          title: '自定义模板',
          index: '4',
          url: '',
          subMenu: [
            {
              title: '证书模板',
              url: '/certificate',
              index: '4-1'
            },
          ]
        },
        {
          title: '子应用',
          index: '5',
          url: '/newpage',
        },
        {
          title: '其他',
          index: '6',
          url: '',
        }
      ],
      defaultActiveIndex: '',
    }
  },
  computed:{
    isCollapse(){
      return this.$store.state.isFold || false
    }
  },
  methods:{
    toChangeMenu(item){
      item.url = item.url || '/home'
      this.$router.push(item.url)
    },
    setFold(){
      this.$store.commit('setFold', !this.isCollapse)
    },
    getMenuIndex(path){
      for(let i = 0; i < this.menu.length; i++){
        let item = this.menu[i];
        if(item.url == path){
          this.defaultActiveIndex = item.index
          break;
        }
        if(item.subMenu && item.subMenu.length > 0){
          for(let j = 0; j < item.subMenu.length; j++){
            let subMenu = item.subMenu[j];
            if(subMenu.url == path){
              this.defaultActiveIndex = subMenu.index
              break;
            }
          }
        }
      }
    }
  },
  watch:{
    '$route.path'(val){
      this.getMenuIndex(val)
    }
  },
  mounted(){
    this.getMenuIndex(this.$route.path)
  }
}
</script>
<style lang="scss" scoped>
.layout{
  height: 100%;
  background: #eee;
  .header{
    padding: 0;
    background: #409EFF;
    line-height: 60px;
    text-align: center;
    font-weight: 600;
    color: #fff;
  }
  .menu{
    height: calc(100% - 60px);
  }
  .main{
    height: 100%;
    padding: 10px 10px;
    overflow: hidden;
    .main_header{
      padding: 0 15px;
      background: #fff;
      border-radius: 4px;
      line-height: 60px;
      .icon_collapse{
        font-size: 20px;
      }
    }
    .main_content{
      height: calc(100% - 70px);
      overflow-y: auto;
      padding: 20px;
      margin-top: 10px;
      background: #fff;
      border-radius: 4px;
    }
  }
}
</style>