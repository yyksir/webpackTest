
const { resolve, join } = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let  MiniCssExtractPlugin  = require('mini-css-extract-plugin');//提取css文件成为 单独的css
let CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//css的压缩
let TerserPlugin   = require('terser-webpack-plugin');//压缩js
const  {CleanWebpackPlugin}  = require('clean-webpack-plugin');//清空打包后的文件
const  CopyWebpackPlugin = require('copy-webpack-plugin');//复制需要的文件
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const devMode = process.env.NODE_ENV == "production";
const { out } = require('./outPath');
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
    devServer:{
        port:3000,
        progress:true,
        compress: true,
        contentBase: './build',
    },
    mode:'development',//两种模式 production development
    entry:resolve(__dirname, './src/main.js'),
    output:{
        // filename:'static/js/bundle.[fullhash:8].js',
        // path:resolve(__dirname,'build'),
        publicPath:`/${out}/`,
        filename: '[name].[contenthash:8].js', // 打包后的文件名称(为了缓存，每次打包好的文件名字不一样)
        path: resolve(__dirname, './build') // 打包后的目录
        
    },
    devtool: 'inline-source-map',
    plugins:[
        new VueLoaderPlugin(), // vue加载器
        new webpack.IgnorePlugin(/\.\/locale/,/moment/),//打包去除moment中的所有语言包 但是语言包需要单独引入 其他的模块可参考
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
        //filename:'static/css/[name].css'
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
    resolve: { // 配置路径别名
        extensions: ['.js', '.jsx', '.vue', '.styl','less'], // import引入文件的时候不用加后缀
        modules: [
            'node_modules',
            resolve(__dirname, '../src')
        ],
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js',
            '@': resolve(__dirname, '../src')
        },
    },
    module:{
        //css-loader 识别@import这种语法 style-loader 把css插入到head的标签中 MiniCssExtractPlugin.loader
        noParse:'/jquery/',//不解析其所依赖的包 提高打包速度
        rules: [
            {
                test:/\.vue$/,
                use:['vue-loader']
            },
            {
                test: /\.css$/i,
                use: [
                devMode ?'vue-style-loader': MiniCssExtractPlugin.loader ,
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
                devMode ?'vue-style-loader': MiniCssExtractPlugin.loader ,
                "css-loader",
                "postcss-loader",
                'less-loader'
                ],
            },
            {
                test: /\.styl(us)?$/,
                use: [
                  devMode ?'vue-style-loader': MiniCssExtractPlugin.loader ,
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
                exclude: '/node_modules/',
            },
            // 处理图片(file-loader来处理也可以，url-loader更适合图片)
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/images/[name].[fullhash:7].[ext]',
                },
            },
            // 处理多媒体文件
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                    options: {
                    limit: 10000,
                    name: 'static/media/[name].[fullhash:7].[ext]',
                },
            },
            // 处理字体文件
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/fonts/[name].[fullhash:7].[ext]'
                }
            },
            // html中引用的静态资源在这里处理,默认配置参数attrs=img:src,处理图片的src引用的资源.
            {
                test: /\.html$/,
                loader: 'html-withimg-loader',
            },
        ]
    }
}