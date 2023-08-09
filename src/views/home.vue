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
                <i :class="item.icon ? 'el-icon-'+item.icon : 'el-icon-setting'"></i>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item :index="subMenu.index" v-for="(subMenu, k) in item.subMenu" :key="k" @click="toChangeMenu(subMenu)">
                <span>{{subMenu.title}}</span>
              </el-menu-item>
            </el-submenu>
          </template>
          <el-menu-item v-else :key="item.index" :index="item.index" @click="toChangeMenu(item)">
            <i :class="item.icon ? 'el-icon-'+item.icon : 'el-icon-setting'"></i>
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
          <el-dropdown class="language_box" @command="handleLangClick">
            <span class="el-dropdown-link">
              {{language}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="lang_itme" :class="{on: language === item.name}" :command='item.lang' v-for="item in langList" :key="item.lang">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
          icon: 'tickets',
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
          title: '日期选择器',
          index: '6',
          url: '',
          icon: 'date',
          subMenu: [
            {
              title: '日期时间选择器',
              url: '/datetimePicker',
              index: '6-1'
            },
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
          title: '其他',
          index: '5',
          url: '',
        }
      ],
      defaultActive:{
        index: ''
      },
      language: '语言',
      langList:[
        {lang: 'zh', name: '简体中文'},
        {lang: 'tw', name: '繁體中文'},
        {lang: 'en', name: 'English'}
      ]
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
      // isCollapse = !isCollapse
      this.$store.commit('setFold', !this.isCollapse)
    },
    showLanguage(){
      const lang = localStorage.lang || 'zh'
      this.language = this.langList.find(v => v.lang === lang).name
    },
    // 切换语言
    handleLangClick(lang){
      if(this.$i18n.locale == lang) return false;
      this.$i18n.locale = lang
      localStorage.lang = lang
      location.reload()
    }
  },
  created(){
    this.showLanguage()
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
      .language_box{
        float: right;
        cursor: pointer;
        line-height: 24px;
        margin-top: 18px;
        .lang_itme{
          border: 1px solid red;
        }
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
<style lang="scss">
.lang_itme{
  &.on{
    color: #409EFF;
  }
}
</style>
