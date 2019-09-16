var path = require('path');
var pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(pathToPhaser, 'dist/phaser-arcade-physics.min');

module.exports = {
	entry: './src/app.tsx',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{ test: /\.ts(x?)$/, loader: 'ts-loader', exclude: /node_modules/ },
			{ test: /phaser\.js$/, loader: 'expose-loader?Phaser' }
		]
	},
	devServer: {
		contentBase: path.resolve(__dirname, './'),
		publicPath: '/dist/',
		host: '127.0.0.1',
		port: 8080,
		open: true,
		historyApiFallback: true
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			phaser: phaser
		  }
	}
};