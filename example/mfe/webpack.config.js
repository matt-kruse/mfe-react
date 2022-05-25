const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;


module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3002,
    allowedHosts: 'all',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
    },
  resolve: {
    extensions: ['.js','.jsx']
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.solid\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['solid'],
        },
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules|\.solid\.jsx?/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        options: {
            name: '[path][name].[hash].[ext]',
        },
      }
      ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'ComponentLibrary',
      library: { type: 'var', name: 'ComponentLibrary' },
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button',
        './ComponentError': './src/ComponentError',
        './DelayedComponent': './src/DelayedComponent',
        './PlainJavascriptComponent': './src/PlainJavascript',
        './PlainJavascriptError': './src/PlainJavascriptError',
        './VueComponent': './src/VueComponent.js',
        './UnwrappedVueComponent': './src/VueComponent.vue',
        './ShadowStyleComponent': './src/ShadowStyleComponent',
        './DestructiveStyleComponent': './src/DestructiveStyleComponent',
        './ReactVersionComponent': './src/ReactVersionComponent',
        './SolidComponent': './src/SolidComponent.solid.jsx',
      },
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new VueLoaderPlugin(),
  ],
};
