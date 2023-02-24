<template>
  <div class="week_time_picker">
      <span class="next_btn next_btn_left" @click="nextWeek(-1)">
        <i class="el-icon-arrow-left"></i>
      </span>
      <el-date-picker v-model="value" v-bind="option" @change="change" :format="format" >
      </el-date-picker>
      <span class="next_btn next_btn_right" @click="nextWeek(1)">
        <i class="el-icon-arrow-right"></i>
      </span>
      <el-button size="small" @click="toThisWeek()" v-if="!isThisWeek">{{pickerType==1?'本月':'本周'}}</el-button>
    </div>
</template>
<script>
import {getWeekStart, getMonthStart, getMonthEnd, getWeekEnd} from './common'
import {formatTime} from '@/assets/js/utils'
export default {
  props:{
    // 其他DatePicker参数,参照element
    pickerOption: {
      type: Object,
      default: () => {}
    },
    // 默认日期
    defaultTime: { type: Date, default: null },
    // 0：周 1： 月
    pickerType: { type: [Number,String], default: 0 },
  },
  data(){
    return{
      format: '',
      value: '',
      isThisWeek: true,
    }
  },
  computed:{
    option(){
      const now = Date.now()
      const data = {
        type: ["week", "month"][this.pickerType],
        size: "small",
        clearable: false,
        editable: false,
        pickerOptions: {
          firstDayOfWeek: 1,
          disabledDate:(time)=>{
            return time.getTime() > now + 52 * 7 * 24 * 3600 * 1000
          }
        },
        ...this.pickerOption,
      };
      return data;
    }
  },
  mounted(){
    this.toThisWeek(this.defaultTime,true);
  },
  methods:{
    change(val, bol){
      const startDate = this.getStrart({ date: val })
      const endDate = this.getEnd({ date: val })
      const start = formatTime(startDate, "object");
      const end = formatTime(endDate, "object");
      if(this.pickerType){
        this.format = `${start.year}年${start.month}月`;
      }else {
        this.format = `${start.year}年${start.month}月${start.day}日~${start.month != end.month ? end.month+'月':''}${end.day}日`;
      }
      this.isThisWeek = startDate.getTime() == this.getStrart().getTime()
      if(!bol){
        this.$emit("change",{startDate,endDate});
      }
    },
    // 本周
    toThisWeek(val, bol){
      this.value = val || this.getStrart();
      this.change(this.value, bol);
    },
    // 开始日期
    getStrart(option){
      if(this.pickerType){
        return getMonthStart(option)
      }else {
        return getWeekStart(option)
      }
    },
    // 结束日期
    getEnd(option){
      if(this.pickerType){
        return getMonthEnd(option)
      }else {
        return getWeekEnd(option)
      }
    },
    nextWeek(val) {
      let time = this.pickerType ? new Date(this.value).setDate(15) : new Date(this.value).getTime();
      time += val * (this.pickerType ? 31 : 7) * 24 * 3600 * 1000;
      this.value = new Date(time);
      this.change(this.value);
    },
  }
}
</script>
<style lang="scss" scoped>
.week_time_picker {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  .el-date-editor {
    width: auto;
    min-width: 200px;
  }
  .next_btn {
    display: inline-block;
    border: 1px solid #dadbdf;
    line-height: 26px;
    padding: 0 1px;
    cursor: pointer;
    color: #999;
  }
  .next_btn_left {
    border-right: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    >span{
      margin-right: 5px;
    }
  }
  .next_btn_right {
    border-left: none;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    >span{
      margin-left: 5px;
    }
  }
  .el-button {
    margin-left: 10px;
  }
}
</style>
<style lang="scss">
.week_time_picker {
  .el-date-editor {
    .el-input__inner {
      border-radius: 0;
      border-color: #dadbdf;
    }
  }
}
</style>