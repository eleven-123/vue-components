const columns = [
    {
        label: '上课分校',
        prop: "campusName",
    },
    {
        label: '授课形式',
        prop: "courseType",
        formatter: (row) => {
          return ['个别课', '集体课', '练琴', '作业'][row.courseType - 1] || ''
        }
    },
    {
      label: '学习状态',
      prop: "status",
      columnType: 'slot',
      slotName: "status"
    },
    {
      label: '学费详情',
      prop: "biztype",
      width: 180,
      columnType: 'slot',
      slotName: "biztype"
    },
    {
      label: '级别情况',
      prop: "studentLevelName",
      width: 160,
      formatter: (row) => {
        let msg = '';
        if(row.studentLevelName){
          msg += `<p>${'学生级别'}：${row.studentLevelName}</p>`
        }
        if(row.courseType == 1 && row.levelName){
          msg += `<p>${'教师级别'}：${row.levelName}</p>`
        }else if(row.courseType == 2 && row.levelName){
          msg += `<p>${'班别级别'}：${row.levelName}</p>`
        }
        return msg
      }
    },
    {
      label: '剩余节数',
      prop: "nodeNum",
      isShowSummary:true,
      totalProp:'totalnodeNum',
      pageTotalProp:'subtotalnodeNum',
      columnType: 'slot',
      slotName: "nodeNum"
    },
    {
      label: '欠费节数',
      prop: "arrearsNodeNum",
      isShowSummary:true,
      totalProp:'totalArrearsNodeNum',
      pageTotalProp:'subtotalArrearsNodeNum',
      columnType: 'slot',
      slotName: "arrearsNodeNum"
    },
    {
      label: '剩余费用',
      prop: "money",
      isShowSummary:true, // 是否展示合计
      isFormatMoney:true, // 合计时加单位
      totalProp:'totalmoney', // 合计的字段
      pageTotalProp:'subtotalmoney', // 本页合计的字段
      columnType: 'slot',
      slotName: "money",
      formatterTotal: 'money'
    },
    {
      label: '欠费',
      prop: "arrearsMoney",
      isShowSummary:true,
      isFormatMoney:true,
      totalProp:'totalarrearsMoney',
      pageTotalProp:'subtotalarrearsMoney',
      columnType: 'slot',
      slotName: "arrearsMoney",
      formatterTotal: 'money'
    },
    {
      label: '操作',
      prop: "operation",
      columnType: 'slot',
      slotName: "operation",
      align: "center"
    },
  ]
  
  export default {
    columns
  };