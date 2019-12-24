var webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser-arcade-physics.min');

module.exports = env => {
	const appConfig = {
		name: 'app',
		entry: {
			app: './src/app.tsx'
		},
		devtool: 'source-map',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name]-[hash]-bundle.js',
			publicPath: '/'
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
					exclude: /node_modules/
				},
				{
					test: /\.ts(x?)$/,
					loader: 'ts-loader',
					exclude: /node_modules/
				},
				{
					test: /phaser\.js$/,
					loader: 'expose-loader?Phaser'
				}
			]
		},
		devServer: {
			contentBase: path.resolve(__dirname, 'dist'),
			host: '0.0.0.0',
			port: 8080,
			open: true,
			compress: true,
			historyApiFallback: true
		},
		plugins: [
			new BundleTracker({filename: './stats-app.json'}),
			// new BundleAnalyzer(),
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: ['**/*', '!env*', '!*-verifier-*', '!levels-*']
			}),
			new CopyWebpackPlugin([
				{ from: 'assets/', to: 'assets/' }
			]),
			new HtmlWebpackPlugin({
				template: 'index.html'
			}),
			new webpack.DefinePlugin({
				__GAME_ONLY__: JSON.stringify(env && env.GAME_ONLY || false)
			})
		],
		optimization: {
			splitChunks: {
				chunks: 'all'
			}
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js'],
			alias: {
				phaser: phaser
			}
		}
	};

	const cmdlineConfig = {
		name: 'cmdline',
		target: 'node',
		entry: {
			'djs-verifier': './cmdline/djs-verifier.js',
			'qjs-verifier': './cmdline/qjs-verifier.js',
			'node-verifier': './cmdline/node-verifier.js',
			'levels': './cmdline/levels.ts'
		},
		devtool: 'source-map',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name]-bundle.js'
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					loader: 'ts-loader',
					exclude: /node_modules/
				},
			]
		},
		plugins: [
			new BundleTracker({filename: './stats-cmdline.json'})
		],
		resolve: {
			extensions: ['.ts', '.js']
		}
	};

	return [ appConfig, cmdlineConfig ];
};
