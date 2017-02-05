

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, '../app/main.js'),
  ],
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: '[name]-[hash].min.js',
    publicPath: '/',
  },
  plugins: [
    // new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      template: 'views/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
      },
      mangle: {
        except: ['webpackJsonp', 'exports', 'require'],
        screw_ie8: true,
        keep_fnames: true,
      },
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.json?$/,
      loader: 'json',
    }, { // TODO(Michael): Verfiy css/scss loaders later. Remove -loader from loader names
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]' }),
    }, {
      test: /\.scss$/,
      loaders: 'style-loader!css-loader!sass-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]',
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff',
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader',
    }, {
      test: /\.js$/, loader: 'strip-loader?strip[]=console.log',
    },
    ],
  },
};
