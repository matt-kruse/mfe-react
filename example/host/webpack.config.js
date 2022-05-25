const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;

const MODE_DEVELOPMENT = "development";
const MODE_PRODUCTION = "production";


module.exports = (env,argv) => {
  const mode = argv.mode || MODE_DEVELOPMENT;
  const remotes = (mode===MODE_PRODUCTION) ?
      {
        "ComponentLibrary":"../../mfe/dist/remoteEntry.js",
      }
      :
      {
        "ComponentLibrary":"localhost:3002/remoteEntry.js",
      }
  ;

  return {
    entry: './src/index',
        mode: mode,
      devServer: {
        static: {
          directory: path.join(__dirname, 'dist'),
        },
        port: 3001,
        allowedHosts: 'all',
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
      },
    output: {
      publicPath: 'auto',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'HostApp',
        remotes: {
          ComponentLibrary: `ComponentLibrary@//${remotes.ComponentLibrary}`,
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        }
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  }
};
