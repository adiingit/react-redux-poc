const webpack = require('webpack')
const path = require('path')

const libraryName = 'SICKPlatform'

const outputFile = libraryName + '.min.js'

module.exports = {
  entry: path.join(__dirname, '../src/index.js'),
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/../lib'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules)/,
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react', 'stage-0', 'react-optimize']
        }
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: true
      },
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
