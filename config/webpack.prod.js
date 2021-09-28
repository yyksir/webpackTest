
const { resolve, join } = require('path');
const  HtmlWebpackPlugin = require('html-webpack-plugin');
const  MiniCssExtractPlugin  = require('mini-css-extract-plugin');//提取css文件成为 单独的css
const  CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//css的压缩
const  TerserPlugin   = require('terser-webpack-plugin');//压缩js
const  {CleanWebpackPlugin}  = require('clean-webpack-plugin');//清空打包后的文件
const  CopyWebpackPlugin = require('copy-webpack-plugin');//复制需要的文件
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { out } = require('../outPath');
const baseConfig = require('./webpack.base');
const config ={
    mode:'production',//两种模式 production development
    entry:resolve(__dirname, '../src/main.js'),
    output:{
        filename:'static/js/[name][fullhash:8].js',
        path:resolve(__dirname,`../${out}`),
        publicPath:`/${out}`,
    },
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
        splitChunks: {
            chunks: 'all', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            minChunks: 3, // 共享最少的chunk数，使用次数超过这个值才会被提取
            maxAsyncRequests: 5, // 最多的异步chunk数
            maxInitialRequests: 5, // 最多的同步chunks数
            cacheGroups: { // 这里开始设置缓存的 chunks
                defaultVendors: { // key 为entry中定义的 入口名称，new webpack.ProvidePlugin中的库
                    test: /[\\/]node_modules[\\/]/, // 正则规则验证，如果符合就提取 chunk (指定是node_modules下的第三方包)
                    name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
                    enforce: true,
                    reuseExistingChunk: true
                },
                components: {
                    test: /[\\/]src[\\/]components[\\/]/,
                    name: 'components',
                    chunks: 'all',
                    enforce: true
                }
            }
        }
      },
    plugins:[
        new webpack.IgnorePlugin(/\.\/locale/,/moment/),//打包去除moment中的所有语言包 但是语言包需要单独引入 其他的模块可参考
        new HtmlWebpackPlugin({
                template: join(__dirname, '../public/index.html'), // 引入模版
                favicon: join(__dirname, '../src/assets/favicon.ico'),
                filename:'index.html',//打包后名称
                minify:{
                    removeAttributeQuotes:true,//去掉引号
                    collapseWhitespace:true,//去掉空格
                },
                hash:true,//hash值
        }),
        new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].css'
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns:[{ from:'./public', to:'public' }]
        }),
        new webpack.BannerPlugin({
                banner: "hash:[fullhash],  name:[name], filebase:[base], query:[query], file:[file]"
        })
    ],
    module:{
        //css-loader 识别@import这种语法 style-loader 把css插入到head的标签中 MiniCssExtractPlugin.loader
        noParse:'/jquery/',//不解析其所依赖的包 提高打包速度
    }
}

module.exports = merge(baseConfig, config);