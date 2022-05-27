const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  entry: {
    index: './src/static/js/index/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: process.env.NODE_ENV === 'production' ? '[contenthash].bundle.js' : '[name].bundle.js',
    assetModuleFilename: '[name][ext]',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ['html-loader']
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.ico$/i,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxSize: 1000000
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/views/index.html',
      filename: 'index.html',
      favicon: './src/static/img/favicon.ico',
      chunks: ['index']
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'MAPBOX_TOKEN': JSON.stringify(process.env.MAPBOX_TOKEN)
    })
  ]
};
