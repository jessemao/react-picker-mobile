var webpack = require('webpack');

module.exports = {
	entry: {
		'react-picker-mb': './src/Picker.jsx'
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
