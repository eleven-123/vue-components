import { registerMicroApps, start } from 'qiankun'
import { qiankunSubApp } from './config.js'
console.log(qiankunSubApp)

const activeRule = (hash) => (location) => location.hash.startsWith(hash) || hash;

// 子应用配置信息
export const apps = [
  {
    // 必填，微应用的名称，必须保证唯一
    name: "newpage",
    // 必填，微应用的入口
    // entry: "http://localhost:7101",
    entry: "http://127.0.0.1:5173",
    // 必填，微应用的容器节点的选择器或者Element实例
    container: "#subappContainer",
    // 必填，微应用的激活规则
    activeRule: activeRule("/newpage"),
    // 可填，主应用需要传递给微应用的数据
    props: top.globalData,
  }
]

export const useQiankun = () => {
  registerMicroApps(apps, {
    beforeLoad: [
      (app) => {
        console.log(`${app.name}的beforeLoad阶段`);
      },
    ],
    beforeMount: [
      (app) => {
        console.log(`${app.name}的beforeMount阶段`);
      },
    ],
    afterMount: [
      (app) => {
        console.log(`${app.name}的afterMount阶段`);
      },
    ],
    beforeUnmount: [
      (app) => {
        console.log(`${app.name}的beforeUnmount阶段`);
      },
    ],
    afterUnmount: [
      (app) => {
        console.log(`${app.name}的afterUnmount阶段`);
      },
    ]
  })

  start({
    experimentalStyleIsolation: true,
    prefetch: "all",
  })
}