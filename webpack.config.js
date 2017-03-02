const WebpackOnBuildPlugin = require('on-build-webpack');
const exec = require('child_process').exec;

module.exports = {
  entry: "./front/application.js",
  output: {
    path: "./assets",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/, 
        use :[
		  {loader: "style-loader"},
		  {loader: "css-loader"}
		]
      },
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
		options: {
          "presets": ["react", "es2017", "es2016", "es2015"]
        }
      }
    ],
    
  },
  plugins: [
    new WebpackOnBuildPlugin(function(stats) {
      exec("make build_static", function(e, o, e){}); 
    })
  ],
  devtool: "inline-source-map"
};
