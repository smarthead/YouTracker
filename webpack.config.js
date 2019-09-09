const path = require('path');

const common = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
              }
            }
          }
        ]
      },
      {
        test: /\.node$/,
        loader: 'node-loader'
      }
    ],
  }
};

module.exports = [
  {
    target: 'electron-main',
    entry: {
      main: './src/main/main.js'
    },
    ...common
  },
  {
    target: 'electron-renderer',
    entry: {
      renderer: './src/renderer/index.js'
    },
    ...common
  }
];
