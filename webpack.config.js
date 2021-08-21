
const { resolve, join } = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let  MiniCssExtractPlugin  = require('mini-css-extract-plugin');
module.exports ={
    devServer:{
        port:3000,
        progress:true,
        compress: true,
        contentBase: './build',
    },
    mode:'development',//两种模式 production development
    entry:'./src/index.js',
    output:{
        filename:'bundle.[hash:8].js',
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
       })
    ],
    module:{
        //css-loader 识别@import这种语法 style-loader 把css插入到head的标签中 MiniCssExtractPlugin.loader
        rules: [
            {
                test: /\.css$/i,
                use: [
                {
                    loader:'style-loader',
                }, 
                "css-loader"
                ],
            },
            {
                test: /\.less$/i,
                use: [
                {
                    loader:'style-loader',
                }, 
                "css-loader",
                'less-loader'
                ],
            },
        ],
    }
}