require("dotenv").config();
const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const autoprefixer = require("autoprefixer");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackCleanupPlugin = require("webpack-cleanup-plugin");

module.exports = function(env, argv) {
  const isEnvProduction = (argv.mode === "production") ? true : false;

  return {
    devServer: {
      publicPath: "/",
      contentBase: "./build",
      port: process.env.APP_PORT,
      host: "0.0.0.0",
      historyApiFallback: true,
      overlay: true,
      useLocalIp: true,
      compress: isEnvProduction
    },
    stats: "errors-only",
    entry: {
      bundle: "./src/index.js"
    },
    output: {
      filename: isEnvProduction ? "[name].[contentHash].js" : "[name].js",
      chunkFilename: isEnvProduction ? "[name].[contentHash].js" : "[name].js",
      path: path.resolve(__dirname, "../build")
    },
    performance: {
      hints: false
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {}
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: {
                minimize: isEnvProduction,
                collapseWhitespace: isEnvProduction,
                removeComments: isEnvProduction
              }
            }
          ]
        },
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins: [autoprefixer("last 2 version")],
                sourceMap: false
              }
            },
            {
              loader: "sass-loader"
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: "babel-loader"
            }
          ]
        }
      ]
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
      },
      minimizer: isEnvProduction
        ? [
            new UglifyJsPlugin({
              cache: true,
              parallel: true,
              sourceMap: false
            }),
            new OptimizeCssAssetsPlugin("default", {
              discardComments: { removeAll: true }
            })
          ]
        : []
    },
    plugins: [
      new Dotenv(),
      new ProgressBarPlugin({
        format: "Build [:bar] :percent (:elapsed seconds)",
        clear: false
      }),
      new CopyWebpackPlugin([
        {
          from: `${__dirname}/../public`,
          to: `${__dirname}/../build`,
        }
      ]),
      isEnvProduction &&
      new WebpackCleanupPlugin(),
      new MiniCssExtractPlugin({
        filename: isEnvProduction ? "[name].[contentHash].css" : "[name].css",
        chunkFilename: isEnvProduction
          ? "[name].[contentHash].css"
          : "[name].css"
      }),
      new HtmlWebpackPlugin({
        template: `${__dirname}/../src/index.html`,
        filename: "index.html",
        inject: "body",
        minify: isEnvProduction
          ? {
              collapseWhitespace: true,
              removeComments: true
            }
          : false
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: "defer"
      })
    ].filter(Boolean)
  };
};
