
const { resolve, join } = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

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
        filename:'bundle.js',
        path:resolve(__dirname,'build'),
    },
    plugins:[
       new HtmlWebpackPlugin({
            template: join(__dirname, '../src/index.html'), // 引入模版
            filename:'index.html',
       })
    ]
}