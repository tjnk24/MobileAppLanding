const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

const development = process.env.NODE_ENV !== 'production';

const cssLoaders = [
    {
        loader: 'style-loader',
        options: {
            hmr: true
        }
    },
    {
        loader: 'css-loader',
        options: {
            sourceMap: true,
            minimize: !development,
            module: true,
            localIdentName: '[local]'
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            plugins: () => [
                precss(),
                autoprefixer()
            ]
        }
    }
];

const config = {
    entry: [
        `./src/main.js`
    ],
    output: {
        filename: './src/main.[hash].js',
        path: path.resolve(__dirname, `build/`)
    },
    devtool: development ? 'eval-source-map' : undefined,
    mode: development ? 'development' : 'production',
    devServer: {
        contentBase: path.resolve(__dirname, `src/`),
        port: 8080,
        host: 'localhost',
        watchContentBase: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.pcss$/,
                use: development ? cssLoaders : [
                    MiniCssExtractPlugin.loader,
                    cssLoaders[1],
                    cssLoaders[2]
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|webp)$/,
                loader: 'file-loader',
                options: {
                    context: path.resolve(__dirname, `src/`),
                    publicPath: development ? undefined : '../',
                    name: development ? '[name].[ext]' : '[path][name].[ext]',
                    limit: 1000
                }
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'main',
                    test: /\.pcss$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin('build'),
        new HtmlWebpackPlugin({
            template: `./src/index.html`
        }),
        new webpack.ProvidePlugin({
            $     : 'jquery',
            jQuery: 'jquery',
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css"
        }),
        new CopyWebpackPlugin([
            {from: `src/img`, to: 'img'}
        ]),
        new UglifyJsPlugin()
    ],
    resolve: {
        modules: [
            path.resolve(__dirname, `src/`),
            'node_modules'
        ],
    }
};

module.exports = config;
