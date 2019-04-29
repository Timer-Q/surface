const path = require('path')
const paths = require('./paths')
const fs = require('fs')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.prepub')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const getClientEnvironment = require('./env')

const publicUrl = ''
const env = getClientEnvironment(publicUrl)

const modules = {}
const cPath = path.join(__dirname, '../src/components')
const files = fs.readdirSync(cPath)
if (files) {
  files.forEach(function(name) {
    const p = path.join(cPath, name)
    if (name === 'index.js') {
      modules[name.split('.')[0]] = p
    }
    if (fs.statSync(p).isDirectory() && name !== 'styles') {
      modules[name] = p
    }
  })
}

const webpackConfig = merge(baseWebpackConfig, {
  entry: modules,
  devtool:
    env.stringified['process.env'] === 'development' ? '#source-map' : false,
  output: {
    path: paths.appLib,
    filename: path.posix.join('./', '[name]/index.js'),
    library: 'breezy',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    // extract css into its own file
    new ExtractTextPlugin(path.posix.join('./', '[name]/index.js')),
  ],
})

module.exports = webpackConfig
