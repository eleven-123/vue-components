<template>
  <el-container class="layout">
    <el-aside class="aside" :width="isCollapse ? '' : '200px'">
      <el-header class="header">
        <span>{{isCollapse ? 'VC' :'vue components'}}</span>
      </el-header>
      <el-menu class="menu" :default-active="defaultActive.index" active-text-color="#409EFF" :collapse="isCollapse">
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
            <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="isCollapse = !isCollapse"></i>
          </el-button> 
        </div>
      </el-header>
      <div class="main_content">
        <router-view></router-view>
      </div>      
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'HomeComponent',
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
          title: '其他',
          index: '2',
          url: '',
        }
      ],
      defaultActive:{
        index: ''
      },
      isCollapse: false
    }
  },
  methods:{
    toChangeMenu(item){
      item.url = item.url || '/home'
      this.$router.push(item.url)
    }
  },
  created(){
    let path = this.$route.path;
    for(let i = 0; i < this.menu.length; i++){
      let item = this.menu[i];
      if(item.url == path){
        this.defaultActive.index = item.index
        break;
      }
      if(item.subMenu && item.subMenu.length > 0){
        for(let j = 0; j < item.subMenu.length; j++){
          let subMenu = item.subMenu[j];
          if(subMenu.url == path){
            this.defaultActive.index = subMenu.index
            break;
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
