const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: {
    main: './src/js/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ['html-loader']
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: ['...', new CssMinimizerPlugin()],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'MAPBOX_TOKEN': JSON.stringify(process.env.MAPBOX_TOKEN)
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};
