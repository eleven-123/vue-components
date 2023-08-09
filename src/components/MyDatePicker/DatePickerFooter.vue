<template>
  <div class="date-picker-footer">
    <el-button type="text" size="mini" @click="confimDate(1)">此刻</el-button>
    <el-button size="mini" plain @click="confimDate()">确定</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    mounted () {
    },
    methods: {
      confimDate(type){
        this.$emit('confirmDate', type)
      }
    },
  }
</script>

<style lang='scss' scoped>
.date-picker-footer{
  text-align: right;
  padding: 10px 12px;
  border-top: 1px solid #eee;
}
</style>
