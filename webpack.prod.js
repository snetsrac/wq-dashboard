const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const common = require('./webpack.common');

process.env.NODE_ENV = 'production';

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: ['...', new CssMinimizerPlugin()],
    moduleIds: 'deterministic'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[contenthash].css'
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});
