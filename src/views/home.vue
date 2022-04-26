<template>
  <div class="layout">
    <el-header class="header"><h4 @click="toChangeMenu('/home')">vue components</h4></el-header>
    <el-container class="content">
      <el-aside class="aside" width="200px">
        <el-menu class="menu" default-active="1-1" :default-openeds="['1']" active-text-color="#0072ff">
          <template v-for="item in menu">
            <template v-if="item.subMenu">
              <el-submenu :index="item.index" :key="item.index">
                <template #title>
                  <i class="el-icon-setting"></i>
                  {{item.title}}
                </template>
                <el-menu-item :index="subMenu.index" v-for="(subMenu, k) in item.subMenu" :key="k" @click="toChangeMenu(subMenu.url)">
                  <span>{{subMenu.title}}</span>
                </el-menu-item>
              </el-submenu>
            </template>
            <el-menu-item v-else :key="item.index" :index="item.index" @click="toChangeMenu(subMenu.url)">
              <i class="el-icon-setting"></i>
              <span>{{item.title}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
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
      ]
    }
  },
  methods:{
    toChangeMenu(url){
      if(!url) return false;
      this.$router.push(url)
    }
  }
}
</script>

<style scoped lang="scss">
.layout{
  height: 100%;
  .header{
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd ;
  }
  .content{
    height: calc(100% - 60px);
    .menu{
      min-height: 100%;
    }
    .main{
      min-height: 100%;
    }
  }
}

</style>
