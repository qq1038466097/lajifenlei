const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //分析js
//const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
//const MiniCssPlugin = require("mini-css-extract-plugin");

module.exports = (webpackConfig, env) => {
  const production = env === 'production'
  // FilenameHash
  webpackConfig.output.chunkFilename = '[name].[chunkhash].js'
  if (production) {
    if (webpackConfig.module) {
      // ClassnameHash
      webpackConfig.module.rules.map((item) => {
        if (String(item.test) === '/\\.less$/' || String(item.test) === '/\\.css/') {
          item.use.filter(iitem => iitem.loader === 'css')[0].options.localIdentName = ''
        }
        return item
      })
    }
    webpackConfig.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      })
    )
  }
  webpackConfig.plugins = webpackConfig.plugins.concat([
    //复制
    new CopyWebpackPlugin([
      {
        from: 'src/public',
        to: production ? '../' : webpackConfig.output.outputPath,
      },
    ]),
    new webpack.optimize.ModuleConcatenationPlugin(), //压缩
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/), //去掉语言
    new BundleAnalyzerPlugin(),  //fenxi
    //new LodashModuleReplacementPlugin,
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/entry.ejs`,
      filename: production ? '../index.html' : 'index.html',
      minify: production ? {
        collapseWhitespace: true, //删除空白符与换行符
        removeComments: true, // 移除HTML中的注释
        minifyCSS: true,
        minifyJS: true,
        
      } : null,
      hash: true,
      devtool: false,
      headScripts: production ? null : ['/roadhog.dll.js'],
    }),
  ])

  // Alias
  webpackConfig.resolve.alias = {
    components: `${__dirname}/src/components`,
    utils: `${__dirname}/src/utils`,
    config: `${__dirname}/src/utils/config`,
    enums: `${__dirname}/src/utils/enums`,
    services: `${__dirname}/src/services`,
    models: `${__dirname}/src/models`,
    routes: `${__dirname}/src/routes`,
    themes: `${__dirname}/src/themes`,
    //"@ant-design/icons/lib/dist$": path.resolve(`${__dirname}/src/icons.js`)
    /*"@ant-design/icons": "^4.0.0-alpha.19",*/
  }
  return webpackConfig
}
