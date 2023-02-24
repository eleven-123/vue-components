import { formatTime } from "@/assets/js/utils";
import {getTableStyleConfig} from '../component/common'
/*
 * params
 * courseTableType: 1-日课表 2-周课表 3-月课表
 * 
*/ 
export function getCourseTable(courseTableType){
  let title = courseTableType == 1 ? '日课表' : courseTableType == 2 ? '周课表' : '月课表'
  return {
    data(){
      const tableStyleConfig = getTableStyleConfig()
      return{
        courseTableType,
        title,
        tableStyleConfig
      }
    },
    created() {},
    mounted() {},
    methods: {
      dealCourseData(list = []){
        let arr = []
        // 按时间排序
        list = list.sort((a, b) => a.startTime - b.startTime)
        list.forEach(item => {
          let obj = item
          if (courseTableType != 2 && courseTableType != 3) {
            obj = item.course
          }
          obj = this.setCourseItemData(obj)
          if(obj){
            arr.push(obj)
          }
        })
        return arr
      },
      setCourseItemData(obj){
        obj.styleIndex = this.getCourseIndex(obj)
        this.setCourseToList(obj)
        return obj
      },
      // 课程插入对应列数据, 对应行数据
      setCourseToList(obj) {
        let x_index = obj.styleIndex.x_index, 
            y_index = parseInt(obj.styleIndex.y_index);
        this.rowData[y_index].list[x_index].push(obj)
      },
      getCourseIndex(item){
        const time = formatTime(item.startTime, 'object')
        let x_index, y_index;
        y_index = time.hour - this.rowData[0].hour + time.minute / 60
        x_index = time.week - 1
        let height = (item.endTime - item.startTime) / 1000 / 60 / 60
        return {
          x_index,
          y_index,
          height
        }
      },
      // 设置课时样式
      getCourseItemStyle(styleIndex){
        const config = this.tableStyleConfig;
        let y_index = styleIndex.y_index || 0;
        let y_index_1 = styleIndex.y_index_1 ? styleIndex.y_index_1 : 0;
        let height = config.height - 2 * config.padding;
        let top = parseInt(y_index) * (config.height + 1) + config.padding + (config.paddingTop || 0) + y_index_1 * (height + config.padding);
        let def = {
          position: "absolute",
          width: config.width - 2 * config.padding + "px",
          left: (styleIndex.x_index || 0) * (config.width + 1) + config.padding + "px",
          top: top + "px",
          height: height + "px",
        };
        return {...def}
      }
    }
  }
}
