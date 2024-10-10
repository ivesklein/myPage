const dotenv  = require('dotenv');
const path = require('path');
const webpack  = require('webpack');

dotenv.config();

module.exports = {
  entry: {
    render: './src/render.js',
    editor: './src/editor.js',
    login: './src/login.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  mode: "development",
  plugins:[
    new webpack.DefinePlugin({
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT)
    })
  ]
};