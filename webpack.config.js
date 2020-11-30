const defaultConfig = require("@wordpress/scripts/config/webpack.config");
module.exports = {
	...defaultConfig,
	entry: {
		'blocks': './src/blocks.js', // 'name' : 'path/file.ext'.
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/dist/build'
	}
};
