const autoprefixer = require('autoprefixer');
const package = require('./package.json');
const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const nodeEnv = (process.env.NODE_ENV || 'development').trim();
const target = (process.env.SOUNDPANEL_TARGET || '').trim() === 'electron'
	? 'electron-renderer'
	: 'web';

console.log(`Building module for ${target}`);

const styleLoader = nodeEnv !== 'production'
	? 'vue-style-loader'
	: MiniCssExtractPlugin.loader;

const lessLoader = [
	styleLoader,
	{
		loader: 'css-loader',
		options: {
			importLoaders: 2
		}
	},
	{
		loader: 'postcss-loader',
		options: {
			plugins: () => autoprefixer()
		}
	},
	'less-loader'
];

const cssLoader = [
	styleLoader,
	{
		loader: 'css-loader',
		options: {
			importLoaders: 1
		}
	},
	{
		loader: 'postcss-loader',
		options: {
			plugins: () => autoprefixer()
		}
	},
];

module.exports = {
	entry: {
		soundpanel: path.resolve(__dirname, 'app', 'index.js')
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/',
		filename: '[name].bundle.js'
	},

	mode: nodeEnv,
	target,

	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						'less': lessLoader,
						'css': cssLoader,
						'js': {
							loader: 'babel-loader'
						}
					}
				}
			},

			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: [/node_modules/]
			},

			{
				test: /\.less$/,
				loader: lessLoader
			},

			{
				test: /\.css$/,
				use: cssLoader
			},

			{
				test: /\.svg$/,
				oneOf: [
					{
						resourceQuery: /component/,
						loader: 'vue-svg-loader',
						options: {
							svgo: false
						}
					},

					{
						loader: 'file-loader',
						options: {
							name: 'files/[hash:8].[ext]'
						}
					}
				]
			},

			{
				test: /\.(png|jpe?g|gif|woff2?|otf|wav|ttf|eot)(\?|#.*)?$/,
				loader: 'file-loader',
				options: {
					name: 'files/[hash:8].[ext]'
				}
			}
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(nodeEnv),
			'SOUNDPANEL_ENVIRONMENT': JSON.stringify(target),
			'SOUNDPANEL_BUILDDATE': JSON.stringify((() => {
				const date = new Date();
				return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
			})()),
			'SOUNDPANEL_VERSION': JSON.stringify(package.version)
		}),
		new MiniCssExtractPlugin({filename: '[name].bundle.css'}),
		new VueLoaderPlugin()
	],

	target,

	devtool: '#eval-source-map'
};

if(target === 'web') {
	module.exports.plugins.push(new webpack.IgnorePlugin(/^electron$/));
}

if(nodeEnv === 'production') {
	module.exports.devtool = '#source-map';
	module.exports.optimization = {
		minimize: true
	};
}
