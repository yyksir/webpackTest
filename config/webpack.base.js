const { resolve } = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 文本分离插件，分离js和css
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const { VueLoaderPlugin } = require('vue-loader');
const {
    name, version, author, license
} = require('../package.json');

const { NODE_ENV, ENV } = process.env;

// 获取时间
const TimeFn = require('../get_time');

const banner = `@${name} v${version}
(c) 2019-2021 ${author}
Released under the ${license} License.
${TimeFn()}`;

/**
 * 判断是生产环境还是开发环境
 * @type {boolean}
 * isProd为true表示生产
 */
const devMode = NODE_ENV === 'production';
const config = {
    module: {
        rules: [
            {
                test:/\.vue$/,
                use:['vue-loader']
            },
            {
                test: /\.css$/i,
                use: [
                'vue-style-loader',
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
                'vue-style-loader',
                devMode ? MiniCssExtractPlugin.loader : 'style-loader',
                "css-loader",
                "postcss-loader",
                'less-loader'
                ],
            },
            {
                test: /\.styl(us)?$/,
                use: [
                  'vue-style-loader',
                  devMode ? MiniCssExtractPlugin.loader : 'style-loader',
                  'css-loader',
                  'stylus-loader'
                ]
              },
            {
                test: /\.js$/,
                use: {
                  loader: 'babel-loader',
                },
                include:resolve(__dirname,'src'),
                exclude: '/node_modules/'
            },
            // 处理图片(file-loader来处理也可以，url-loader更适合图片)
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/images/[name].[hash:7].[ext]',
                },
            },
            // 处理多媒体文件
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                    options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:7].[ext]',
                },
            },
            // 处理字体文件
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/fonts/[name].[hash:7].[ext]'
                }
            },
            // html中引用的静态资源在这里处理,默认配置参数attrs=img:src,处理图片的src引用的资源.
            {
                test: /\.html$/,
                loader: 'html-withimg-loader',
            },
        ]
    },
    resolve: { // 配置路径别名
        extensions:['*','.js','.json','.vue'], // import引入文件的时候不用加后缀
        modules: [
            'node_modules',
            resolve(__dirname, '../src')
        ],
        alias: {
            '@': resolve(__dirname, '../src')
        },
        // fallback: {
        //     crypto: require.resolve('crypto-browserify'),
        //     stream: require.resolve('stream-browserify'),
        //     buffer: require.resolve('buffer/')
        // }
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new VueLoaderPlugin(), // vue加载器
        new ProgressBarPlugin(
            {
                format: chalk.blue(`[  build :bar ${chalk.green.bold(':percent')} (:elapsed seconds) ]`),
                clear: true,
                summary: true
            }
        )
    ],
    // externals: {
    //     vue: 'Vue',
    //     'vue-router': 'VueRouter',
    //     vuex: 'Vuex'
    // },
    bail: true, // 在第一个错误出现时抛出失败结果
    target: 'web'
};

module.exports = config;
