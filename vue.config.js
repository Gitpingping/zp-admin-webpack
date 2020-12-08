const webpack = require('webpack');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
module.exports = {
  //   port: 8088,
  publicPath: './',
  productionSourceMap: false,
  css: { loaderOptions: { less: { javascriptEnabled: true } } },
  devServer: {
    proxy: {
      '/cspcommsystem/': {
        // 测试环境
        target: 'https://test-cspcommapi.vip56.cn', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/cspcommsystem': '/cspcommsystem' //需要rewrite重写的,
        }
      },
    }
  },
  chainWebpack: (config) => {
    config
      .plugin('webpack-bundle-analyzer')
      .use(WebpackBundleAnalyzer.BundleAnalyzerPlugin)
  },
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // 下面是下载的插件的配置
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 0,
        minRatio: 0.8,
      }),
      // new webpack.optimize.LimitChunkCountPlugin({
      //   maxChunks: 5,
      //   minChunkSize: 100
      // }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
      // new webpack.PrefetchPlugin([context], request)
      // new UglifyJsPlugin({
      //     test: /\.js($|\?)/i
      // })
    ]
  }
};
