const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = (env, argv) => {
  const SERVER_PATH = argv.mode === 'production' ?
    './src/server/server-prod.js' :
    './src/server/server-dev.js';

  return {
    entry: {
      server: SERVER_PATH
    },
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].js'
    },
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    node: {
      __dirname: false,
      __filename: false
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new NodemonPlugin({
        watch: path.join(__dirname, 'dist/server.js')
      })
    ]
  }
};
