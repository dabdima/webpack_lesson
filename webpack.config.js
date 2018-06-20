//basic vars
const path = require('path')
const webpack = require('webpack')

//additional plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = (process.env.NODE_ENV === 'production');

//module settings
module.exports = {

    //basic route to project
    context: path.resolve(__dirname, 'src'),

    //точки входа js
    entry: {
        //основной файл приложения
        app: [
            './js/app.js',
            './scss/style.scss'
        ],
    },

    //путь для собранных файлов
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '../'
    },

    //devServer configuration
    devServer: {
        contentBase: './app'
    },

    //для запуска дополнительных команд, если они необходимы
    devtool: (isProduction) ? '' : 'inline-source-map',

    //правила для обработки scss-файлов
    module: {
        //правила обработки файлов
        rules: [
            //scss
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'postcss-loader',
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true }
                        },
                    ],
                    fallback: 'style-loader',
                })
            },

            //загрузка изображений
            {
                test: /\.(png|gif|jpe?g)$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                    'img-loader',
                ]
            },

            //fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    },
                ]
            },

            //SVG converter
            {
                test: /\.svg$/,
                loader: 'svg-url-loader',
            },
        ],
    },

    //указываем какие используем плагины с какими файлами
    plugins: [
        new ExtractTextPlugin(
            './css/[name].css'
        ),
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin(
            [
                { from: './img', to: 'img' }
            ],
            {
                ignore: [
                    {glob: 'svg/*'},
                ]
            }
        ),
    ],
};

//PRODUCTION ONLY !!!
if (isProduction) {
    module.exports.plugins.push(
        new UglifyJSPlugin({
            sourceMap: true
        }),
    );

    module.exports.plugins.push(
        new ImageminPlugin({
            test: /\.(png|gpe?g|gif|svg)$/i
        }),
    );

    module.exports.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
    );
}
