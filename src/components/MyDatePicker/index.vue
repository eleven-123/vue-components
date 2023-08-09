<template>
  <div class="my-date-picker">
    <el-popover
      ref="dataPickerPopoverRef"
      placement="bottom-start"
      trigger="click"
      popper-class="data-picker-popover"
      v-model="visible"
    >
      <div slot="reference">
        <el-input class="date-picker-input" :prefix-icon="prefixIcon" :placeholder="placeholder" readonly :size="size" :value="value">
          <i slot="suffix" v-if="clearable && value" class="date-picker-clear el-input__icon el-icon-circle-close" @click="clearableFn"></i>
        </el-input>
      </div>
      <div class="data-picker-content">
        <date-picker-header 
          ref="dataPickerHeader" 
          :date="[currYear, currMonth]" 
          :minDate="minDate"
          :maxDate="maxDate"
          @changeYear="changeYear" 
          @changeMonth="changeMonth" 
          :panelType="panelType" 
          @changePanel="changePanel"
        ></date-picker-header>
        <date-picker-panel 
          ref="dataPickerPanel" 
          :date="[currYear, currMonth]" 
          :dateList="dateList" 
          :valueFormat="valueFormat" 
          :panelType="panelType" 
          :type="type"
          :timeStart="timeStart"
          :timeEnd="timeEnd"
          :timeStep="timeStep"
          :minDate="minDate"
          :maxDate="maxDate"
          :defaultValue="value"
          @changePanel="changePanel" 
          @dateChange="dateChange" 
          @confirmDate="confirmDate" 
          @changeMonth="changeMonth"
          @changeYear="changeYear"
        ></date-picker-panel>
      </div>
    </el-popover>
  </div>
</template>

<script>
  import DatePickerHeader from "./DatePickerHeader";
  import DatePickerPanel from "./DatePickerPanel";
  import {genarateDayData, formatTime} from './datePicker'

  const date = formatTime(new Date(), 'object'),
        currYear = date.year,
        currMonth = date.month;
  export default {
    name: 'MyDatePicker',
    components:{
      DatePickerHeader,
      DatePickerPanel,
    },
    props:{
      value:{
        type: String,
        default: ''
      },
      // 选择器类型 date datetime
      type:{
        type: String,
        default: 'date'
      },
      placeholder:{
        type: String,
        default: '请选择'
      },
      // 默认为当前时间
      defaultValue:{
        type: Date,
        default: () => new Date()
      },
      // 输入框头部图标
      prefixIcon:{
        type: String,
        default: 'el-icon-date'
      },
      // 是否可清空
      clearable:{
        type: Boolean,
        default: true
      },
      // 输入框尺寸 medium / small / mini
      size:{
        type: String,
        default: 'small'
      },
      
      valueFormat:{
        type: String,
        default: "yyyy-MM-dd HH:mm"
        // default: "timestamp"
      },
      minDate:{
        type: String,
        default: ''
      },
      maxDate:{
        type: String,
        default: ''
      },
      timeStart: {
        type: String,
        default: "08:00"
      },
      timeEnd: {
        type: String,
        default: "10:30"
      },
      timeStep:{
        type: String,
        default: '00:30'
      }
    },
    model: {
      prop: "value",
      event: "change",
    },
    data () {
      return {
        dateList: [],
        currYear,
        currMonth,
        currDate: '', //当前选中的日期
        currTime: '',
        panelType: 1, //面板显示类型 1-日期 2-年 3-月
        visible: false,
      }
    },
    watch:{
      visible: function(val){
        if(val){
          this.panelType = 1
        }
      }
    },
    mounted () {
      if(this.value){
        this.initData(this.value)
      }
      this.getDateList()
    },
    methods: {
      initData(date){
        if(date){
          let dateObj = formatTime(date, 'object')
          this.currYear = dateObj.year
          this.currMonth = dateObj.month
        }
      },
      clearableFn(event){
        this.doClose()
        this.$refs.dataPickerPanel.init()
        this.$emit('change', '')
        this.currYear = currYear
        this.currMonth = currMonth
        this.getDateList()
      },
      // 获取日期
      getDateList(){
        this.dateList = genarateDayData([this.currYear, this.currMonth])
      },
      // 切换天
      dateChange(val){
        this.currDate = val.date
        let currDateObj = formatTime(this.currDate, 'object');
        if(Number(currDateObj.year) != this.currYear || Number(currDateObj.month) != this.currMonth){
          this.currYear = Number(currDateObj.year)
          this.currMonth = Number(currDateObj.month)
          this.getDateList()
        }
        this.confirmDate({date: this.currDate, time: val.time}, this.type == 'datetime')
      },
      // 切换年份
      changeYear(val={type:'', year:''}){
        if(val.year){
          this.currYear = Number(val.year)
          this.changePanel(3)
          return
        }
        if(this.panelType == 2){
          this.currYear = val.type ? Number(this.currYear) + 10 : Number(this.currYear) - 10
          return
        }
        val.type ? this.currYear++ : this.currYear--
        this.getDateList()
      },
      // 切换月份
      changeMonth(val={type:'', month:''}){
        if(this.panelType == 3){
          this.currMonth = val.month
          this.getDateList()
          this.changePanel(1)
          return
        }
        if(val.type){
          this.currMonth++
          if(this.currMonth > 12){
            this.currYear++
            this.currMonth = 1
          }
        }else{
          this.currMonth--
          if(this.currMonth < 1){
            this.currYear--
            this.currMonth = 12
          }
        }
        this.getDateList()
      },
      confirmDate(val={date:'', time:''}, flag){
        let datetime = val.date + ' ' + val.time
        let formatType = 1;
        if(this.type == 'datetime'){
          formatType = 3
        }
        let dateTxt = formatTime(datetime, formatType)
        this.$emit('change', dateTxt)
        if(!flag){
          this.currYear = new Date(val.date).getFullYear();
          this.currMonth = new Date(val.date).getMonth() + 1;
          this.getDateList()
          this.doClose()
        }
      },
      doClose(){
        this.panelType = 1
        this.$refs.dataPickerPopoverRef.doClose()
      },
      changePanel(val){
        this.panelType = val
      }
    },
  }
</script>

<style lang='scss' scoped>
.my-date-picker{
  width: 200px;
  
  .date-picker-input{
    .date-picker-clear{
      display: none;
      cursor: pointer;
    }
    &:hover .date-picker-clear{
      display: block;
    }
  }
}
</style>
<style lang='scss'>
.data-picker-popover{
  margin: 5px 0;
  padding: 0;
  color: #606266;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background: #fff;
  border-radius: 4px;
  line-height: 30px;
  .data-picker-content{
    min-width: 360px;
  }
  
}
</style>
