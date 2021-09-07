
const { resolve, join } = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let  MiniCssExtractPlugin  = require('mini-css-extract-plugin');//提取css文件成为 单独的css
let CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//css的压缩
let TerserPlugin   = require('terser-webpack-plugin');//压缩js

const devMode = process.env.NODE_ENV == "production";
console.log(devMode)
module.exports ={
    optimization: {
        minimizer: [
            new TerserPlugin ({
                terserOptions: {
                    format: {
                        comments: /@license/i,
                    },
                },
                parallel: true,
                parallel: 4,
                minify: TerserPlugin.uglifyJsMinify,
                extractComments: true,
            }),
            new CssMinimizerPlugin(),
        ],
      },
    devServer:{
        port:3000,
        progress:true,
        compress: true,
        contentBase: './build',
    },
    mode:'production',//两种模式 production development
    entry:'./src/index.js',
    output:{
        filename:'bundle.[fullhash:8].js',
        path:resolve(__dirname,'build'),
    },
    plugins:[
       new HtmlWebpackPlugin({
            template: './src/index.html',//'./src/index.html',// join(__dirname, './src/index.html'), // 引入模版
            filename:'index.html',//打包后名称
            minify:{
                removeAttributeQuotes:true,//去掉引号
                collapseWhitespace:true,//去掉空格
            },
            hash:true,//hash值
       }),
       new MiniCssExtractPlugin({
        filename:'main.css'
       }),
    ],
    module:{
        //css-loader 识别@import这种语法 style-loader 把css插入到head的标签中 MiniCssExtractPlugin.loader
        rules: [
            {
                test: /\.css$/i,
                use: [
                devMode ? MiniCssExtractPlugin.loader : 'style-loader',
                 {
                    loader: 'css-loader',
                    options: { importLoaders: 1 }
                  },
                  {
                    loader: 'postcss-loader'
                  }
                ],
            },
            {
                test: /\.less$/i,
                use: [
                devMode ? MiniCssExtractPlugin.loader : 'style-loader',
                "css-loader",
                "postcss-loader",
                'less-loader'
                ],
            },
        ],
    }
}