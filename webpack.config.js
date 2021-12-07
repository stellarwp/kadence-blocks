const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const SplitChunkName = require( './src/config/split-chunk-name' );
const splitChunkName = new SplitChunkName();
defaultConfig.optimization.splitChunks.chunks = 'all';
defaultConfig.optimization.splitChunks.maxInitialRequests = 30;
defaultConfig.optimization.splitChunks.hidePathInfo = true;
defaultConfig.optimization.splitChunks.name = splitChunkName.name.bind( splitChunkName );

//defaultConfig.optimization.runtimeChunk = 'single';
//defaultConfig.output.filename = '[name].js';
defaultConfig.output.path = __dirname + '/dist/build';
//defaultConfig.output.path = __dirname + '/dist/plugin';
module.exports = {
	...defaultConfig,
	entry: {
		'blocks': './src/blocks.js', // 'name' : 'path/file.ext'.
		//'plugin': './src/plugin.js', // 'name' : 'path/file.ext'.
	},
};
