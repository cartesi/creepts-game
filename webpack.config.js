// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


var webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser-arcade-physics.min');

module.exports = (env, argv) => {
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
				__GAME_ONLY__: JSON.stringify(env && env.GAME_ONLY || false),
				__DEVELOPMENT__: JSON.stringify(argv.mode === 'development')
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

	return [ appConfig ];
};
