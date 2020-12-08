const path = require('path')
const glob = require("glob")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// console.log(path.resolve(__dirname));


let chunksList = []
let entry = {}
// 动态配置多入口
function  getModulesList() {
    //[ '../src/pages/detail', '../src/pages/index' ]
    let modulesList = glob.sync(path.resolve(__dirname,'../src/pages/*'))
    for(let i = 0,len = modulesList.length; i<len;i++){
        let moduleName = modulesList[i].split('/').slice(-1).join()
        chunksList.push(moduleName)
        entry[moduleName] = path.resolve(__dirname,"../src/pages/"+moduleName+'/index.js')
    }
}

getModulesList()
module.exports = {
    // 指定构建环境
    // mode: "development",
    // 入口
    entry: {
        app: './src/index.js',
        detail: './src/detail.js'
    },
    // 出口
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename:'js/[name].[hash].js', // hash生成随机数防止缓存
        publicPath:"/" //打包后的资源的访问路径前缀
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
                // babel-loader的参数配置也可以这样写，我们这里是新建一个.babelrc文件的方式来配置
                // use: {  
                //     loader: 'babel-loader',
                //     options: {
                //     presets: ['@babel/preset-env']
                //     }
                // }
            },
            {
                // 执行顺序：如果loader选项是一个数组 那执行顺序是从右向左的 loader：['style-loader','css-loader'] 配置多个loader的话 是从下到上的执行顺序的
                test:/\.css$/,
                use:[
                    // 把style-loader注释掉是因为两个会冲突，导致报错
                    // {
                    //     // style-loader 是动态创建一个style 标签，然后把样式塞进去 添加到页面中的
                    //     loader:"style-loader"
                    // },
                    {
                        loader:MiniCssExtractPlugin.loader, // 提取css文件
                        options:{
                            hmr:true,
                            reloadAll:true
                        }
                    },
                    {
                        // css-loader是为了处理import require @import url 这样的引入
                        loader:"css-loader"
                    }
                ]
            },
            {
                test:/\.less$/,
                use:[
                    // {
                    //     loader:"style-loader"
                    // },
                    {
                        loader:MiniCssExtractPlugin.loader,
                        options:{
                            hmr:true,
                            reloadAll:true
                        }
                    },
                    {
                        loader:"css-loader"
                    },
                    {
                        // less-loader 是编译less语法
                        loader:"less-loader"
                    }
                ]
            }
        ]
    },
    plugins:[
        // 提取单独的css文件
        new MiniCssExtractPlugin({
            filename:'css/[name].css',
            chunkFilename:'css/[id].css'
        })
    ]
}

// 为什么loader的执行顺序是从右向左，从下向上(提示：compose与pipe)

// terser-webpack-plugin插件和uglifyjs-webpack-plugin插件的区别