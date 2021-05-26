const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const SplitChunkName = require( './src/config/split-chunk-name' );
const splitChunkName = new SplitChunkName();
defaultConfig.optimization.runtimeChunk = 'single';
defaultConfig.optimization.splitChunks = {
	chunks: 'all',
	maxInitialRequests: 10,
	hidePathInfo: true,
	name: splitChunkName.name.bind( splitChunkName ),
};
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
