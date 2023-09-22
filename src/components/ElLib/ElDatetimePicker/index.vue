<style lang="scss">
.scdatepicker_panel {
  .el-picker-panel__sidebar {
    right: 0;
    border-right: none;
    border-left: 1px solid #eee;
    text-align: center;
    .picker-panel_title {
      border-bottom: 1px solid #eee;
    }
  }
  .el-picker-panel__sidebar + .el-picker-panel__body {
    margin-right: 110px;
    margin-left: 0;
  }
}
</style>
<template>
  <div class="scdatepicker" v-cloak>
    <el-date-picker
      ref="date"
      v-model="currValue"
      v-bind="currOption"
      v-on="$listeners"
    >
      <div slot="time" class="el-picker-panel__sidebar">
        <div class="picker-panel_title">{{$t('datepicker.time')}}</div>
        <time-select
          :value="timeValue"
          ref="timeselect"
          @pick="timePicker"
        ></time-select>
      </div>
    </el-date-picker>
  </div>
</template>

<script>
import moment from "moment";
import timeSelect from "./time-select";

export default {
  name: "ScDatePicker",
  data() {
    return {
      currValue: this.value || "",
      timeValue: "",
    };
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    dateOption: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /*{
      参数	说明	类型	可选值	默认值
      start	开始时间	string	—	09:00
      end	结束时间	string	—	18:00
      step	间隔时间	string	—	00:30
      minTime	最小时间，小于该时间的时间段将被禁用	string	—	00:00
      maxTime	最大时间，大于该时间的时间段将被禁用	string	—	—
    }*/
    timeOption: {
      type: Object,
      default: () => {
        return null;
      },
    },
    value: "",
  },
  methods: {
    timePicker(time) {
      if (time && this.currValue) {
        this.timeValue = time;
        this.setTimeVlaue();
        const date = this.$refs.date;
        const picker = date.picker;
        if (date && picker) {
          date.pickerVisible = picker.visible = false;
        }
      }
    },
    setTimeVlaue() {
      if (this.timeValue) {
        const [hour, minute] = this.timeValue.split(":");
        this.currValue = moment(this.currValue).set({
          hour,
          minute,
        });
      }
    },
  },
  components: {
    timeSelect,
  },
  mounted() {
    const date = this.$refs.date;
    date.mountPicker();
    setTimeout(() => {
      const picker = date.picker;

      if (!picker) return;
      picker.$slots.sidebar = [this.$slots.time || date.$slots.time];
      picker.$forceUpdate();
      picker.$on("pick", (val) => {
        date.pickerVisible = picker.visible = true;
        if (!val) {
          this.timeValue = "";
        } else {
          this.setTimeVlaue();
        }
      });
      picker.$nextTick(() => {
        if (this.timeOption) {
          const timeselect = this.$refs.timeselect;
          Object.assign(timeselect, this.timeOption);
        }
      });
    }, 100);
  },
  watch: {
    value(val) {
      this.currValue = val;
      if (val) {
        this.timeValue = moment(this.currValue).format("HH:mm");
      }
    },
    timeValue(time) {
      const timeselect = this.$refs.timeselect;
      if (timeselect) {
        timeselect.value = time;
      }
    },
    timeOption(val) {
      if (val) {
        const timeselect = this.$refs.timeselect;
        Object.assign(timeselect, val);
      }
    },
  },
  created() {},
  mixins: [],
  computed: {
    currOption() {
      return Object.assign(
        {
          type: "date",
          size: "small",
          format: "yyyy-MM-dd HH:mm",
          popperClass: "scdatepicker_panel",
        },
        this.dateOption
      );
    },
  },
};
</script>