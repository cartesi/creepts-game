const path = require('path');
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser-arcade-physics.min');

module.exports = {
	entry: './src/app.ts',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{ test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' }
		]
	},
	devServer: {
		contentBase: path.resolve(__dirname, './'),
		publicPath: '/dist/',
		host: '127.0.0.1',
		port: 8080,
		open: true
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			phaser: phaser
		  }
	}
};