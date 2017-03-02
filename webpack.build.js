const webpack = require("webpack");

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
	new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify("production")
    }),
	new webpack.optimize.UglifyJsPlugin(),
  ]
};
