var webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser-arcade-physics.min');

module.exports = env => ({
	entry: './src/app.tsx',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]-[hash]-bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{ test: /\.ts(x?)$/, loader: 'ts-loader', exclude: /node_modules/ },
			{ test: /phaser\.js$/, loader: 'expose-loader?Phaser' }
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
		new CleanWebpackPlugin(),
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
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			phaser: phaser
		  }
	}
});
