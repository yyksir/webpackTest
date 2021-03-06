const { resolve, join } = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成index.html
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const webpack = require('webpack');
const { out } = require('../outPath');
const baseConfig = require('./webpack.base');

// 获取本机ip
const getIp = require('../get_ip');

const port = 3000;

const config = {
    mode: 'development',
    entry: {
        index: resolve(__dirname, '../src/main.js') // 入口文件
        // index: ['core-js/stable', 'regenerator-runtime/runtime', resolve(__dirname, '../src/main.js')] // 入口文件
    },
    output:{
        filename:'static/js/[name][fullhash:8].js',
        path:resolve(__dirname,`../${out}`),
        publicPath:"/",
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [{
        //         from: resolve(__dirname, '../node_modules/vue/dist/vue.js'),
        //         to: 'modules'
        //     },
        //     {
        //         from: resolve(__dirname, '../node_modules/vue-router/dist/vue-router.js'),
        //         to: 'modules'
        //     },
        //     {
        //         from: resolve(__dirname, '../node_modules/vuex/dist/vuex.js'),
        //         to: 'modules'
        //     }]
        // }),
        new HtmlWebpackPlugin({
            template: join(__dirname, '../src/index.html'), // 引入模版
            favicon: join(__dirname, '../src/assets/favicon.ico'),
            filename: 'index.html',
            minify: { // 对index.html压缩
                collapseWhitespace: false, // 去掉index.html的空格
                removeAttributeQuotes: false // 去掉引号
            },
            hash: true, // 去掉上次浏览器的缓存（使浏览器每次获取到的是最新的html）
            inlineSource: '.(js|css)'
        }),
        new ProgressBarPlugin(
            {
                format: chalk.blue(`[  build :bar ${chalk.green.bold(':percent')} (:elapsed seconds) ]`),
                clear: true,
                summary: false,
                customSummary: () => {
                    console.log(
                        chalk.blueBright.bold('Your application is running here: '),
                        '\n',
                        chalk.greenBright.bold(`http://${getIp()}:${port}/`),
                        '\n',
                        chalk.greenBright.bold(`http://localhost:${port}/`)
                    );
                }
            }
        )
    ],
    cache: true,
    devtool: 'inline-source-map',
    devServer: {
        contentBase: join(__dirname, `../${out}`), // 将 dist 目录下的文件，作为可访问文件。
        compress: true, // 开启Gzip压缩
        host: '0.0.0.0', // 设置服务器的ip地址，默认localhost
        port, // 端口号
        hot: true,
        noInfo: true,
        overlay: { // 当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
            errors: true
        },
        historyApiFallback: {//路由使用history模式下 需要加此命令 
            index: '/index.html' //与output的publicPath
        },
        disableHostCheck: true, //  不检查主机
    }
};

module.exports = merge(baseConfig, config);
