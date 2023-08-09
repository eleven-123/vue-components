<template>
  <div class="date-picker-header">
    <i @click="changeYear(0)" class="el-icon-d-arrow-left"></i>
    <i @click="changeMonth(0)" class="el-icon-arrow-left" v-show="panelType == 1"></i>
    <div class="date-content">
      <span v-show="panelType == 2">{{ statrYear }}年 - {{statrYear + 10}}年</span>
      <span @click="changePanel(2)" v-show="panelType != 2">{{ date[0] }} 年</span> 
      <span @click="changePanel(3)" v-show="panelType == 1">{{ Number(date[1]) }}月</span>
    </div>
    <i @click="changeMonth(1)" class="el-icon-arrow-right" v-show="panelType == 1"></i>
    <i @click="changeYear(1)" class="el-icon-d-arrow-right"></i>
  </div>
</template>

<script>
  export default {
    props:{
      date: {
        type: Array,
        default: () => {
          const date = new Date(),
                year = date.getFullYear(),
                month = date.getMonth() + 1;
          return [year, month]
        }
      },
      panelType:{
        type: Number,
        default: 1,
      },
      minDate:{
        type: String,
        default: '',
      },
      maxDate:{
        type: String,
        default: '',
      }
    },
    data () {
      return {}
    },
    computed:{
      statrYear(){
        return Math.floor(this.date[0] / 10) * 10;
      },
    },
    mounted () {},
    methods: {
      changeYear(type){
        let panelYear = this.panelType == 2 ? (type ? this.statrYear + 10 : this.statrYear) : this.date[0]
        let limitYear = type ? new Date(this.maxDate).getFullYear() : new Date(this.minDate).getFullYear()
        if(this.minDate && panelYear <= limitYear){
          return false
        }
        if(this.maxDate && panelYear >= limitYear){
          return false
        }
        this.$emit('changeYear', {type})
      },
      changeMonth(type){
        let panelYear = this.date[0],
            panelMonth = this.date[1],
            limitYear = type ? new Date(this.maxDate).getFullYear() : new Date(this.minDate).getFullYear(),
            limitMonth = type ? new Date(this.maxDate).getMonth()+1 : new Date(this.minDate).getMonth()+1
        if(this.minDate && panelYear <= limitYear && panelMonth <= limitMonth){
          return false
        }
        if(this.maxDate && panelYear >= limitYear && panelMonth >= limitMonth){
          return false
        }
        this.$emit('changeMonth', {type})
      },
      changePanel(val){
        this.$emit('changePanel', val)
      }
    },
  }
</script>

<style lang='scss' scoped>
.date-picker-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
  border-bottom: 1px solid #eee;
  i{
    flex: 0 0 auto;
    width: 20px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
    &:nth-child(1),&:nth-child(3){
      margin-right: 5px;
    }
    &:hover{
      color: #0072ff;
    }
  }
  .date-content{
    flex: 1;
    margin: 0 5px;
    text-align: center;
    span{
      font-size: 16px;
      color: #606266;
      cursor: pointer;
      padding: 0 5px;
      &:hover{
        color: #0072ff;
      }
    }
  }
}
</style>
