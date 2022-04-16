<template>
  <div class="layout">
    <el-header class="header"><h4>vue component</h4></el-header>
    <el-container class="container">
      <el-aside class="aside" width="200px">
        <el-menu :default-openeds="['1']" active-text-color="#0072ff">
          <template v-for="(item, index) in menu" :key="index">
            <template v-if="item.subMenu">
              <el-sub-menu :index="item.index">
                <template #title>
                  <el-icon><setting /></el-icon>
                  {{item.title}}
                </template>
                <el-menu-item :index="subMenu.index" v-for="(subMenu, k) in item.subMenu" :key="k" @click="toChangeMenu(subMenu.url)">
                  <span>{{subMenu.title}}</span>
                </el-menu-item>
              </el-sub-menu>
            </template>
            <el-menu-item v-else :index="item.index" @click="toChangeMenu(subMenu.url)">
              <el-icon><setting /></el-icon>
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
.header{
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd ;
}
</style>
