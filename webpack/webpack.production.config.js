import 'dotenv/config';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StatsPlugin from 'stats-webpack-plugin';

const basePath = process.env.BASE_PATH || '';

export default {
  entry: [
    path.join(__dirname, '../app/entry.js'),
  ],
  mode: 'production',
  output: {
    path: path.join(__dirname, '../tmp/'),
    filename: '[name]-[hash].min.js',
    publicPath: `${basePath}/`,
  },
  plugins: [
    new webpack.DefinePlugin({
      BASE_PATH: JSON.stringify(basePath),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
      GA_ID: JSON.stringify(process.env.GA_ID || ''),
    }),
    new HtmlWebpackPlugin({
      template: 'server/views/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].min.css',
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false,
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }, {
        test: /\.md$/,
        use: [{
          loader: 'raw-loader',
        }],
      }, {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]',
        ],
      }, {
        test: /\.scss$/,
        loaders: 'style-loader!css-loader!sass-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]',
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      }, {
        test: /\.js$/,
        loader: 'strip-loader?strip[]=console.log',
      }, {
        test: /\.html$/,
        loader: 'raw-loader',
      },
    ],
  },
};
