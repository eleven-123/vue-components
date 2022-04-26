<template>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss" scoped>
.container{
  height: 100%;
}
</style>
<style lang="scss">
.page_title{
  color: #222;
  font-size: 16px;
  font-weight: normal;
}
.page_content{
  color: #333;
}
</style>
