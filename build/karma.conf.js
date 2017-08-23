require('babel-polyfill')
const webpackConfig = require('./webpack.config.test')

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: true,
    frameworks: ['mocha'],
    files: [
      '../node_modules/phantomjs-polyfill/bind-polyfill.js',
      '../node_modules/babel-polyfill/dist/polyfill.js',
      '../node_modules/fetch-polyfill/fetch.js',
      'tests.webpack.js'
    ],
    reporters: ['mocha'],
    preprocessors: {'tests.webpack.js': ['webpack', 'sourcemap']},
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    }
  })
}
