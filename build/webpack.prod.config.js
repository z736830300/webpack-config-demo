const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackBaseConifg = require('./webpack.base.config');
const { default: merge } = require('webpack-merge');
const TerserWebpackPlugin = require("terser-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
// 打包之前删除之前打包目录
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
// 打包之后会启动一个服务可以查看打包大小
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
module.exports = merge(webpackBaseConifg, {
    // 指定构建环境
    mode: "production",

    plugins: [
        new HtmlWebpackPlugin({
            filename: process.env.APP_ENV === 'test' ? path.resolve(__dirname, "../test/index.html") : path.resolve(__dirname, "../dist/index.html"),
            template: path.resolve(__dirname, "../public/index.html"),
            inject: true,// 注入选项 有四个值 true,body(script标签位于body底部),head,false(不插入js文件)
            hash: true,//回给script标签中的js文件增加一个随机数 防止缓存 bundle.js?22b9692e22e7be37b57e
            minify: {
                removeComments: true,//去注释
                collapseWhitespace: true,//去空格
                removeAttributeQuotes: true, // 去属性的引号
            },
            chunks:['app'] // 这个和entry中的key对应 代表这个入口html需要引入哪个依赖的文件
        }),
        new HtmlWebpackPlugin({
            filename: process.env.APP_ENV === 'test' ? path.resolve(__dirname, "../test/detail.html") : path.resolve(__dirname, "../dist/detail.html"),
            template: path.resolve(__dirname, "../public/index.html"),
            inject: true,// 注入选项 有四个值 true,body(script标签位于body底部),head,false(不插入js文件)
            hash: true,//回给script标签中的js文件增加一个随机数 防止缓存 bundle.js?22b9692e22e7be37b57e
            minify: {
                removeComments: true,//去注释
                collapseWhitespace: true,//去空格
                removeAttributeQuotes: true, // 去属性的引号
            },
            chunks:['app'] // 这个和entry中的key对应 代表这个入口html需要引入哪个依赖的文件
        }),
        new CleanWebpackPlugin(), // 打包之前删除之前的打包目录
        new BundleAnalyzerPlugin() // 打包之后启动一个服务在浏览器查看打包大小及打包出来的文件包含的内容
    ],
    // Optimization 这个选项是可以覆盖webpack内置的一些配置 比如 压缩、分包机制等等
    // webpack4中通过设置splitChunks参数 splitChunks默认参数：(是在optimization中的一个property)
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                parallel: true,
                sourceMap: false,
                exclude: /\/node_modules/,
                extractComments: true, // 这个选项如果为true 会生成一个app.js.LICENSE.txt文件 存储特定格式的注释
                terserOptions: {
                    warnings: false,
                    compress: {
                        unused: true,
                        drop_debugger: true,
                        drop_console: true
                    },
                }
            }),
            // 压缩css
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }
            })
        ],
        splitChunks: {
            // async表示只从异步加载得模块（动态加载import()）里面进行拆分(会拆分出通过懒加载等方式异步加载的模块)
            // initial表示只从入口模块进行拆分（入口文件会包含node_modules中的react-dom等包,但是在blog.js中异步加载的marterial等插件就没有拆分出来 和业务代码打包成了一个包）
            // all表示以上两者都包括
            chunks: 'all',
            minSize: 30000,   // 大于30k会被webpack进行拆包
            minChunks: 1,     // 被引用次数大于等于这个次数进行拆分
            // import()文件本身算一个
            // 只计算js，不算css
            // 如果同时有两个模块满足cacheGroup的规则要进行拆分，但是maxInitialRequests的值只能允许再拆分一个模块，那尺寸更大的模块会被拆分出来
            maxAsyncRequests: 5, // 最大的按需加载（异步）请求次数
            // 最大的初始化加载请求次数,为了对请求数做限制，不至于拆分出来过多模块
            // 入口文件算一个
            // 如果这个模块有异步加载的不算
            // 只算js，不算css
            // 通过runtimeChunk拆分出来的runtime不算在内
            // 如果同时又两个模块满足cacheGroup的规则要进行拆分，但是maxInitialRequests的值只能允许再拆分一个模块，那尺寸更大的模块会被拆分出来
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                // 默认的配置
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                // 默认的配置，vendors规则不命中的话，就会命中这里
                default: {
                    minChunks: 2,
                    priority: -10,
                    reuseExistingChunk: true
                }
            }
        }
    }
})