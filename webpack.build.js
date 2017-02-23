var webpack = require('webpack');

module.exports = {
	entry: {
		'react-mobile-picker': './src/Picker.jsx'
	},

	output: {
		filename: './lib/[name].js',
		library: 'Picker',
		libraryTarget: 'umd'
	},

	resolve: {
		extensions: ['.js', '.jsx']
	},

	externals: [{
		react: {
			root: 'React',
			commonjs2: 'react',
			commonjs: 'react',
			amd: 'react'
		}
	}, {
		classnames: {
			root: 'classnames',
			commonjs2: 'classnames',
			commonjs: 'classnames',
			amd: 'classnames'
		}
	}],

	module: {
		rules: [{
			test: /\.css$/,
			use: [{
					loader: 'style-loader'
				},
				{
					loader: 'css-loader'
				},
				{
					loader: 'autoprefixer-loader'
				}
			]
		}, {
			test: /\.jsx$/,
			use: 'babel-loader',
			exclude: /node_modules/
		}]
	},

	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		})
	]
};
