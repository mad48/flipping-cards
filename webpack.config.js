const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
         app: "./app.js",
        //"flipping.css": "./css/flipping.scss",
        //"card.css": "./css/card.scss"
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        //filename: 'js/[name].js',
        filename: '[name].bundle.js'
        //library: "flipping",
        //publicPath: '/public'
    },
    devServer: {
        contentBase: path.resolve(__dirname, './src')
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react']
                }
            },

            /*            {
             test: /\.scss$/,
             //loaders: ['style-loader', 'css-loader', 'sass-loader']
             loader: ExtractTextPlugin.extract("style-loader", "css-loader","sass-loader")
             },
             {
             test: /\.css$/,
             loader: ExtractTextPlugin.extract("style-loader", "css-loader")
             //loaders: ['style-loader', 'css-loader', 'sass-loader']
             },*/

            /*            {
             test: /\.css$/,
             loader: 'css-loader?{discardComments:{removeAll:true}}'
             },*/

            /*            {
             test: /\.html$/,
             use: [ {
             loader: 'html-loader',
             options: {
             minimize: true,
             removeComments: false,
             collapseWhitespace: false
             }
             }]
             },*/
            {
                test: /\.(scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                // minimize: {discardComments: {removeAll: true}}
                            }
                        },

                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer({
                                        // browsers: ['ie >= 8', 'last 10 version']
                                        // browsers: [ 'last 8 versions', 'iOS 7']

                                    })
                                ],
                                sourceMap: true
                            }
                        },

                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist/css/*', 'dist/js/*'], {
            exclude: ['flipping.html', 'index.html']
        }),

        /*new ExtractTextPlugin("css/[name]", {
            // disable: false,
            allChunks: true
        }),*/

       new ExtractTextPlugin('css/flipping.css'),

        new CopyWebpackPlugin([
            {from: 'js/flipping.js', to: 'js/flipping.js'},
            /*{from: 'from/file.txt', to: 'to/file.txt'}*/
        ]),
        /*        new webpack.optimize.UglifyJsPlugin({
         include: /\.min\.js$/,
         minimize: true

         })*/


        /*        new UglifyJsPlugin({
         uglifyOptions: {
         ie8: false,
         ecma: 8,
         parse: {},
         mangle: {

         properties: {
         // mangle property options
         }
         },
         output: {
         comments: false,
         beautify: false,
         mangle: false

         },
         compress: {warnings: true},
         warnings: false
         }
         })*/
    ]
};