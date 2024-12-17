const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, "/dist"), // the bundle output path
    filename: "build.js", // the name of the bundle
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html", // to import index.html file inside index.js
    }),

    new WebpackObfuscator ({
      rotateStringArray: true
    }, []),
  ],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js and .jsx files
        exclude: /node_modules/, // excluding the node_modules folder
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        loader: "url-loader",
        options: {
          modules: true,
          importLoaders: 1,
          localIdentName: '[sha1:hash:hex:4]',
          limit: false
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  devServer: {
    port: 3050,
    static: {
      directory: path.resolve(__dirname, "./dist")
    },
    historyApiFallback: { index: "/", disableDotRule: true },
  }
};