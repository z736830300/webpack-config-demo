const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackBaseConifg = require('./webpack.base.config');
// 共同的配置抽离出来webpack.base.config.js文件。然后通过webpack-merge插件把他们合并起来
const { default: merge } = require('webpack-merge');
module.exports = merge(webpackBaseConifg, {
    // 指定构建环境
    mode: "development",
    
    plugins: [
        new HtmlWebpackPlugin({
            filename: process.env.APP_ENV === 'test' ? path.resolve(__dirname, "../test/index.html") : path.resolve(__dirname, "../dist/index.html"),
            template: path.resolve(__dirname, "../public/index.html"),
            inject: true,// 注入选项 有四个值 true,body(script标签位于body底部),head,false(不插入js文件)
            hash: true,//回给script标签中的js文件增加一个随机数 防止缓存 bundle.js?22b9692e22e7be37b57e
        })
    ]
})