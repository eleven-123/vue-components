// 子应用配置信息
export const qiankunSubApp = [
  {
    // 必填，微应用的名称，必须保证唯一
    name: "newpage",
    // 必填，微应用的入口
    entry: "http://localhost:7101",
    // 必填，微应用的容器节点的选择器或者Element实例
    container: "#subappContainer",
    // 必填，微应用的激活规则
    activeRule: ["/#/newpage", 'newpage/#/'],
    // 可填，主应用需要传递给微应用的数据
    props: {
      msg: "我是main-app传过来的值，传递给hello-app应用。",
    },
  }
]