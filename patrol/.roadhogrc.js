const path = require('path')
const { version } = require('./package.json')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, '')
]

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  theme: "./theme.config.js",
  publicPath: `/${version}/`,  //测试: /manager/dist  正式:../
  outputPath: `./dist/${version}/`,  //测试:./manager/dist   正式: ./dist
  // 接口代理示例
  env: {
    //开发环境
    development: {
      plugins:[],
      extraBabelPlugins: [
        "dva-hmr",
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "libraryDirectory": "es",
            "style": 'css'  //true,会加载less
          }
        ]
      ]
    },
    //生产环境下
    production: {
      extraBabelPlugins: [
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "libraryDirectory": "es",
            "style": 'css'  //true
          }
        ]
      ]
    }
    
  },
  //dll 加速启动
  dllPlugin: {
    exclude: ["babel-runtime", "roadhog", "cross-env"],
    include: ["dva/router", "dva/saga", "dva/fetch"]
  },
}
