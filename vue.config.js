const { defineConfig } = require('@vue/cli-service')
const port = 8080; // 端口配置
const name = "main-app";

module.exports = {
  // hash 模式下可使用
  publicPath: process.env.NODE_ENV === "development" ? "/" : "/main-app/",
  outputDir: "dist",
  assetsDir: "static",
  transpileDependencies: true,
  // eslint检测
  lintOnSave: false,
  devServer: {
    port: port,
    open: false, // 启动项目以后自动打开浏览器
    hot: true, // 模块热替换(HMR - hot module replacement)功能会在应用程序运行过程中，替换、添加或删除 模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  }
}
