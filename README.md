# webpackTest
一个webpack的从0搭建的项目
##webpack安装
-webpack webpack-cli -D
##手动配置webpack
-默认的文件名称 webpack.config.js
-webpack-dev-server -D 本地开发服务
-less less-loader
-node-saas saas-loader
-style style-loader
- mini-css-extract-plugin 抽离css到单独的文件中
- 自动添加前缀 postcss-loader autoprefixer
- css-minimizer-webpack-plugin  压缩css
- cross-env 设置环境变量是开发环境还是生产环境
- terser-webpack-plugin 压缩js
-  babel-core babel-loader babel-preset-env 